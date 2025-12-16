from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# ============================================
# POST SCHEMAS
# ============================================

class PostBase(BaseModel):
    """Base post schema"""
    text: Optional[str] = Field(None, max_length=5000)
    media: Optional[str] = None

class PostCreate(PostBase):
    """Schema for creating a post"""
    text: str = Field(..., min_length=1, max_length=5000)
    hashtags: Optional[List[str]] = []

class PostUpdate(BaseModel):
    """Schema for updating a post"""
    text: Optional[str] = Field(None, min_length=1, max_length=5000)
    media: Optional[str] = None

class PostResponse(PostBase):
    """Schema for post response"""
    post_id: int
    user_id: int
    username: str  # From join with User table
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    # Engagement metrics
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False  # Whether current user liked this post
    
    # Hashtags
    hashtags: List[str] = []
    
    class Config:
        from_attributes = True

class PostDetailResponse(PostResponse):
    """Extended post response with comments"""
    comments: List['CommentResponse'] = []

# Import after defining PostResponse to avoid circular import
from .comment import CommentResponse
PostDetailResponse.model_rebuild()