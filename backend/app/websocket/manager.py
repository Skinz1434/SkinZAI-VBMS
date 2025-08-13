"""
Secure WebSocket connection manager with user isolation
"""

from typing import Dict, Set, Optional, Any
from fastapi import WebSocket, WebSocketDisconnect, status
import json
import asyncio
import uuid
import time
import structlog
from collections import defaultdict
import hashlib

logger = structlog.get_logger()

class WebSocketConnection:
    """Represents a single WebSocket connection"""
    
    def __init__(self, websocket: WebSocket, user_id: str, session_id: str):
        self.websocket = websocket
        self.user_id = user_id
        self.session_id = session_id
        self.connection_id = str(uuid.uuid4())
        self.connected_at = time.time()
        self.last_activity = time.time()
        self.message_count = 0
        self.rate_limit_window = []
    
    async def send_json(self, data: Dict[str, Any]):
        """Send JSON data to the client"""
        try:
            await self.websocket.send_json(data)
            self.last_activity = time.time()
            self.message_count += 1
        except Exception as e:
            logger.error(f"Error sending message: {e}")
            raise
    
    async def receive_json(self) -> Dict[str, Any]:
        """Receive JSON data from the client"""
        try:
            data = await self.websocket.receive_json()
            self.last_activity = time.time()
            return data
        except Exception as e:
            logger.error(f"Error receiving message: {e}")
            raise
    
    def is_rate_limited(self, max_messages: int = 30, window: int = 60) -> bool:
        """Check if connection is rate limited"""
        current_time = time.time()
        
        # Remove old entries outside the window
        self.rate_limit_window = [
            msg_time for msg_time in self.rate_limit_window
            if current_time - msg_time < window
        ]
        
        # Check if limit exceeded
        if len(self.rate_limit_window) >= max_messages:
            return True
        
        # Add current message
        self.rate_limit_window.append(current_time)
        return False


class WebSocketManager:
    """Manages WebSocket connections with security and isolation"""
    
    def __init__(self):
        # User ID -> Set of connections
        self.user_connections: Dict[str, Set[WebSocketConnection]] = defaultdict(set)
        # Connection ID -> Connection
        self.connections: Dict[str, WebSocketConnection] = {}
        # Session ID -> Connection (for single session per user)
        self.session_connections: Dict[str, WebSocketConnection] = {}
        # Lock for thread-safe operations
        self.lock = asyncio.Lock()
        # Heartbeat task
        self.heartbeat_task = None
    
    async def connect(
        self,
        websocket: WebSocket,
        user_id: str,
        session_id: str,
        single_session: bool = True
    ) -> WebSocketConnection:
        """Accept and register a new WebSocket connection"""
        await websocket.accept()
        
        async with self.lock:
            # Check for existing session if single session mode
            if single_session and session_id in self.session_connections:
                # Disconnect existing session
                existing = self.session_connections[session_id]
                await self.disconnect(existing.connection_id)
                logger.info(f"Disconnected existing session for user {user_id}")
            
            # Create new connection
            connection = WebSocketConnection(websocket, user_id, session_id)
            
            # Register connection
            self.connections[connection.connection_id] = connection
            self.user_connections[user_id].add(connection)
            self.session_connections[session_id] = connection
            
            logger.info(
                "WebSocket connected",
                user_id=user_id,
                session_id=session_id,
                connection_id=connection.connection_id
            )
            
            # Send connection confirmation
            await connection.send_json({
                "type": "connection_established",
                "connection_id": connection.connection_id,
                "session_id": session_id,
                "timestamp": time.time()
            })
            
            # Start heartbeat if not running
            if not self.heartbeat_task:
                self.heartbeat_task = asyncio.create_task(self._heartbeat_loop())
            
            return connection
    
    async def disconnect(self, connection_id: str):
        """Disconnect and unregister a WebSocket connection"""
        async with self.lock:
            if connection_id not in self.connections:
                return
            
            connection = self.connections[connection_id]
            
            # Remove from registries
            self.user_connections[connection.user_id].discard(connection)
            if not self.user_connections[connection.user_id]:
                del self.user_connections[connection.user_id]
            
            if connection.session_id in self.session_connections:
                del self.session_connections[connection.session_id]
            
            del self.connections[connection_id]
            
            logger.info(
                "WebSocket disconnected",
                user_id=connection.user_id,
                session_id=connection.session_id,
                connection_id=connection_id,
                duration=time.time() - connection.connected_at,
                message_count=connection.message_count
            )
            
            try:
                await connection.websocket.close()
            except Exception:
                pass
    
    async def disconnect_all(self):
        """Disconnect all WebSocket connections"""
        connection_ids = list(self.connections.keys())
        for connection_id in connection_ids:
            await self.disconnect(connection_id)
        
        if self.heartbeat_task:
            self.heartbeat_task.cancel()
            self.heartbeat_task = None
    
    async def send_to_user(self, user_id: str, message: Dict[str, Any]):
        """Send message to all connections of a specific user"""
        if user_id not in self.user_connections:
            return
        
        disconnected = []
        for connection in self.user_connections[user_id]:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection.connection_id)
        
        # Clean up disconnected connections
        for connection_id in disconnected:
            await self.disconnect(connection_id)
    
    async def send_to_session(self, session_id: str, message: Dict[str, Any]):
        """Send message to a specific session"""
        if session_id not in self.session_connections:
            return False
        
        connection = self.session_connections[session_id]
        try:
            await connection.send_json(message)
            return True
        except Exception:
            await self.disconnect(connection.connection_id)
            return False
    
    async def broadcast_to_role(self, role: str, message: Dict[str, Any], exclude_user: Optional[str] = None):
        """Broadcast message to all users with a specific role"""
        # This would integrate with your auth system to check user roles
        # For now, this is a placeholder
        pass
    
    async def handle_message(self, connection: WebSocketConnection, message: Dict[str, Any]) -> Dict[str, Any]:
        """Process incoming WebSocket message with security checks"""
        # Check rate limiting
        if connection.is_rate_limited():
            logger.warning(
                "Rate limit exceeded",
                user_id=connection.user_id,
                connection_id=connection.connection_id
            )
            return {
                "type": "error",
                "error": "rate_limit_exceeded",
                "message": "Too many messages. Please slow down."
            }
        
        # Validate message structure
        if not isinstance(message, dict) or 'type' not in message:
            return {
                "type": "error",
                "error": "invalid_message",
                "message": "Invalid message format"
            }
        
        # Sanitize message content
        message_type = str(message.get('type', ''))[:50]
        
        # Log message
        logger.info(
            "WebSocket message received",
            user_id=connection.user_id,
            message_type=message_type,
            connection_id=connection.connection_id
        )
        
        return message
    
    async def _heartbeat_loop(self):
        """Send heartbeat to all connections periodically"""
        while True:
            try:
                await asyncio.sleep(30)  # Heartbeat every 30 seconds
                
                disconnected = []
                for connection_id, connection in self.connections.items():
                    try:
                        await connection.websocket.send_json({
                            "type": "heartbeat",
                            "timestamp": time.time()
                        })
                    except Exception:
                        disconnected.append(connection_id)
                
                # Clean up disconnected connections
                for connection_id in disconnected:
                    await self.disconnect(connection_id)
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Heartbeat error: {e}")
    
    def get_connection_stats(self) -> Dict[str, Any]:
        """Get statistics about current connections"""
        return {
            "total_connections": len(self.connections),
            "unique_users": len(self.user_connections),
            "connections_by_user": {
                user_id: len(connections)
                for user_id, connections in self.user_connections.items()
            }
        }


# Global WebSocket manager instance
ws_manager = WebSocketManager()