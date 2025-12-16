from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# ============================================
# NOTIFICATION SCHEMAS
# ============================================

class NotificationBase(BaseModel):
    """Base notification schema"""
    type: str = Field(..., max_length=50)  # like, comment, follow, message, mention
    content: str = Field(..., max_length=500)

class NotificationCreate(NotificationBase):
    """Schema for creating a notification"""
    user_id: int

class NotificationResponse(NotificationBase):
    """Schema for notification response"""
    notification_id: int
    user_id: int
    created_at: datetime
    is_read: int  # 0 = unread, 1 = read
    
    class Config:
        from_attributes = True

class NotificationMarkReadResponse(BaseModel):
    """Schema for marking notification as read"""
    success: bool
    message: str

class NotificationStatsResponse(BaseModel):
    """Schema for notification statistics"""
    total: int
    unread: int
    read: int