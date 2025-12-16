from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# ============================================
# STORY SCHEMAS
# ============================================

class StoryBase(BaseModel):
    """Base story schema"""
    media: str = Field(..., max_length=255)  # URL or path to media

class StoryCreate(StoryBase):
    """Schema for creating a story"""
    pass

class StoryResponse(StoryBase):
    """Schema for story response"""
    story_id: int
    user_id: int
    username: str  # From join with User table
    profile_picture: Optional[str] = None
    created_at: datetime
    expiration_time: datetime
    is_expired: bool = False  # Computed field
    
    class Config:
        from_attributes = True

class StoryDeleteResponse(BaseModel):
    """Schema for story deletion response"""
    success: bool
    message: str