from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# ============================================
# MESSAGE SCHEMAS
# ============================================

class MessageBase(BaseModel):
    """Base message schema"""
    content: str = Field(..., min_length=1, max_length=5000)

class MessageCreate(MessageBase):
    """Schema for creating a message"""
    receiver_id: int

class MessageResponse(MessageBase):
    """Schema for message response"""
    message_id: int
    sender_id: int
    sender_username: str  # From join with User table
    receiver_id: int
    receiver_username: str  # From join with User table
    created_at: datetime
    is_read: int  # 0 = unread, 1 = read
    
    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    """Schema for conversation with another user"""
    user_id: int
    username: str
    profile_picture: Optional[str] = None
    last_message: MessageResponse
    unread_count: int = 0

class MessageMarkReadResponse(BaseModel):
    """Schema for marking message as read"""
    success: bool
    message: str