"""
Chat API endpoints with WebSocket support
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any, Optional
import json
import structlog

from app.websocket.manager import ws_manager
from app.services.qbit_chatbot import QBitChatbot, MessageType
from app.core.security import input_sanitizer, rate_limiter

logger = structlog.get_logger()
router = APIRouter()
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Get current user from JWT token"""
    # Simplified - would validate JWT in production
    return {
        "user_id": "user_123",
        "role": "claims_processor",
        "permissions": ["chat", "navigate", "query_knowledge"]
    }

@router.websocket("/ws/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
    token: Optional[str] = None
):
    """WebSocket endpoint for real-time chat"""
    
    # Validate token
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    
    # Extract user from token (simplified)
    user_id = "user_123"  # Would extract from JWT
    
    try:
        # Connect WebSocket
        connection = await ws_manager.connect(
            websocket=websocket,
            user_id=user_id,
            session_id=session_id,
            single_session=True
        )
        
        # Initialize QBit chatbot
        from app.main import app
        qbit = QBitChatbot(
            kb_service=app.state.kb_service,
            orchestrator=app.state.agent_orchestrator
        )
        
        # Send welcome message
        await connection.send_json({
            "type": "system",
            "message": "Connected to NOVA QBit. How can I assist you today?",
            "timestamp": connection.connected_at
        })
        
        # Handle messages
        while True:
            try:
                # Receive message
                data = await connection.receive_json()
                
                # Validate and sanitize
                message = await ws_manager.handle_message(connection, data)
                
                if message.get("type") == "error":
                    await connection.send_json(message)
                    continue
                
                # Process with QBit
                response = await qbit.process_message(
                    user_id=user_id,
                    session_id=session_id,
                    message=message.get("content", ""),
                    message_type=MessageType(message.get("message_type", "chat")),
                    context=message.get("context", {})
                )
                
                # Send response
                await connection.send_json(response)
                
            except WebSocketDisconnect:
                break
            except Exception as e:
                logger.error(f"WebSocket error: {e}")
                await connection.send_json({
                    "type": "error",
                    "message": "An error occurred processing your message"
                })
    
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
    
    finally:
        await ws_manager.disconnect(connection.connection_id if 'connection' in locals() else "")

@router.post("/message")
async def send_message(
    message: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Send a chat message (REST endpoint)"""
    
    # Rate limiting
    if not rate_limiter.is_allowed(current_user["user_id"]):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded"
        )
    
    # Sanitize input
    content = input_sanitizer.sanitize_string(
        message.get("content", ""),
        max_length=2000
    )
    
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content is required"
        )
    
    # Process with QBit
    from app.main import app
    qbit = QBitChatbot(
        kb_service=app.state.kb_service,
        orchestrator=app.state.agent_orchestrator
    )
    
    response = await qbit.process_message(
        user_id=current_user["user_id"],
        session_id=message.get("session_id", "default"),
        message=content,
        message_type=MessageType(message.get("type", "chat")),
        context=message.get("context", {})
    )
    
    return response

@router.get("/history/{session_id}")
async def get_chat_history(
    session_id: str,
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get chat history for a session"""
    
    # Note: In production, this would retrieve from database
    # For now, return empty history
    return {
        "session_id": session_id,
        "user_id": current_user["user_id"],
        "messages": [],
        "total": 0
    }

@router.delete("/history/{session_id}")
async def clear_chat_history(
    session_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Clear chat history for a session"""
    
    logger.info(
        "Clearing chat history",
        session_id=session_id,
        user_id=current_user["user_id"]
    )
    
    # Note: In production, this would clear from database
    return {
        "status": "success",
        "message": "Chat history cleared"
    }

@router.get("/stats")
async def get_chat_stats(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get chat statistics"""
    
    stats = ws_manager.get_connection_stats()
    
    return {
        "websocket_stats": stats,
        "user_id": current_user["user_id"]
    }