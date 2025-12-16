from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# ============================================
# COMMENT SCHEMAS
# ============================================

class CommentBase(BaseModel):
    """Base comment schema"""
    text: str = Field(..., min_length=1, max_length=1000)

class CommentCreate(CommentBase):
    """Schema for creating a comment"""
    post_id: int

class CommentUpdate(BaseModel):
    """Schema for updating a comment"""
    text: str = Field(..., min_length=1, max_length=1000)

class CommentResponse(CommentBase):
    """Schema for comment response"""
    comment_id: int
    post_id: int
    user_id: int
    username: str  # From join with User table
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True