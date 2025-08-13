"""
Notification system API with QBit integration
"""

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from typing import Dict, Any, List, Optional
from datetime import datetime
import uuid
import structlog

from app.core.security import rate_limiter
from app.api.chat import get_current_user

logger = structlog.get_logger()
router = APIRouter()

class NotificationService:
    """Service for managing notifications"""
    
    def __init__(self):
        self.notifications = {}
        self.user_preferences = {}
    
    async def create_notification(
        self,
        user_id: str,
        notification: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create a new notification"""
        
        notification_id = str(uuid.uuid4())
        
        notification_data = {
            "id": notification_id,
            "user_id": user_id,
            "type": notification["type"],
            "title": notification["title"],
            "message": notification["message"],
            "priority": notification.get("priority", "normal"),
            "status": "unread",
            "created_at": datetime.utcnow().isoformat(),
            "data": notification.get("data", {}),
            "actions": notification.get("actions", [])
        }
        
        if user_id not in self.notifications:
            self.notifications[user_id] = []
        
        self.notifications[user_id].append(notification_data)
        
        # Send to WebSocket if user connected
        from app.websocket.manager import ws_manager
        await ws_manager.send_to_user(user_id, {
            "type": "notification",
            "notification": notification_data
        })
        
        return notification_data
    
    async def get_notifications(
        self,
        user_id: str,
        status: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Get notifications for user"""
        
        if user_id not in self.notifications:
            return []
        
        notifications = self.notifications[user_id]
        
        if status:
            notifications = [n for n in notifications if n["status"] == status]
        
        # Sort by created_at desc
        notifications.sort(key=lambda x: x["created_at"], reverse=True)
        
        return notifications[:limit]
    
    async def mark_as_read(
        self,
        user_id: str,
        notification_id: str
    ) -> bool:
        """Mark notification as read"""
        
        if user_id not in self.notifications:
            return False
        
        for notification in self.notifications[user_id]:
            if notification["id"] == notification_id:
                notification["status"] = "read"
                notification["read_at"] = datetime.utcnow().isoformat()
                return True
        
        return False
    
    async def delete_notification(
        self,
        user_id: str,
        notification_id: str
    ) -> bool:
        """Delete a notification"""
        
        if user_id not in self.notifications:
            return False
        
        self.notifications[user_id] = [
            n for n in self.notifications[user_id]
            if n["id"] != notification_id
        ]
        
        return True

# Global notification service
notification_service = NotificationService()

@router.post("/")
async def create_notification(
    notification: Dict[str, Any],
    background_tasks: BackgroundTasks,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Create a new notification"""
    
    # Validate notification
    required_fields = ["type", "title", "message"]
    if not all(field in notification for field in required_fields):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required fields"
        )
    
    # Validate notification type
    valid_types = [
        "claim_update", "exam_scheduled", "document_received",
        "decision_made", "payment_processed", "system_alert",
        "reminder", "message"
    ]
    
    if notification["type"] not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid notification type. Must be one of: {valid_types}"
        )
    
    # Create notification
    result = await notification_service.create_notification(
        user_id=current_user["user_id"],
        notification=notification
    )
    
    # Process with QBit if needed
    if notification.get("process_with_qbit", False):
        background_tasks.add_task(
            process_notification_with_qbit,
            notification=result,
            user_id=current_user["user_id"]
        )
    
    return result

@router.get("/")
async def get_notifications(
    status: Optional[str] = None,
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get notifications for current user"""
    
    notifications = await notification_service.get_notifications(
        user_id=current_user["user_id"],
        status=status,
        limit=limit
    )
    
    unread_count = sum(1 for n in notifications if n["status"] == "unread")
    
    return {
        "notifications": notifications,
        "total": len(notifications),
        "unread_count": unread_count
    }

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Mark notification as read"""
    
    success = await notification_service.mark_as_read(
        user_id=current_user["user_id"],
        notification_id=notification_id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {"status": "success", "message": "Notification marked as read"}

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Delete a notification"""
    
    success = await notification_service.delete_notification(
        user_id=current_user["user_id"],
        notification_id=notification_id
    )
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    return {"status": "success", "message": "Notification deleted"}

@router.put("/mark-all-read")
async def mark_all_read(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Mark all notifications as read"""
    
    notifications = await notification_service.get_notifications(
        user_id=current_user["user_id"],
        status="unread"
    )
    
    count = 0
    for notification in notifications:
        await notification_service.mark_as_read(
            user_id=current_user["user_id"],
            notification_id=notification["id"]
        )
        count += 1
    
    return {
        "status": "success",
        "message": f"Marked {count} notifications as read"
    }

@router.get("/preferences")
async def get_notification_preferences(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Get notification preferences"""
    
    user_id = current_user["user_id"]
    
    if user_id not in notification_service.user_preferences:
        # Default preferences
        notification_service.user_preferences[user_id] = {
            "email_enabled": True,
            "push_enabled": True,
            "sms_enabled": False,
            "notification_types": {
                "claim_update": True,
                "exam_scheduled": True,
                "document_received": True,
                "decision_made": True,
                "payment_processed": True,
                "system_alert": True,
                "reminder": True,
                "message": True
            },
            "quiet_hours": {
                "enabled": False,
                "start": "22:00",
                "end": "08:00"
            }
        }
    
    return notification_service.user_preferences[user_id]

@router.put("/preferences")
async def update_notification_preferences(
    preferences: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> Dict[str, Any]:
    """Update notification preferences"""
    
    user_id = current_user["user_id"]
    
    if user_id not in notification_service.user_preferences:
        notification_service.user_preferences[user_id] = {}
    
    notification_service.user_preferences[user_id].update(preferences)
    
    return {
        "status": "success",
        "message": "Preferences updated",
        "preferences": notification_service.user_preferences[user_id]
    }

async def process_notification_with_qbit(
    notification: Dict[str, Any],
    user_id: str
):
    """Process notification with QBit for intelligent handling"""
    
    from app.main import app
    from app.services.qbit_chatbot import QBitChatbot, MessageType
    
    qbit = QBitChatbot(
        kb_service=app.state.kb_service,
        orchestrator=app.state.agent_orchestrator
    )
    
    # Generate intelligent notification summary
    summary = await qbit.process_message(
        user_id=user_id,
        session_id=f"notification_{notification['id']}",
        message=f"Summarize this notification: {notification['title']} - {notification['message']}",
        message_type=MessageType.NOTIFICATION,
        context={"notification": notification}
    )
    
    # Update notification with QBit analysis
    notification["qbit_analysis"] = summary
    
    logger.info(
        "Notification processed with QBit",
        notification_id=notification["id"],
        user_id=user_id
    )