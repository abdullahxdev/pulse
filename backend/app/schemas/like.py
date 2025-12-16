from pydantic import BaseModel
from datetime import datetime

# ============================================
# LIKE SCHEMAS
# ============================================

class LikeResponse(BaseModel):
    """Schema for like response"""
    like_id: int
    post_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class LikeToggleResponse(BaseModel):
    """Schema for like/unlike action response"""
    success: bool
    is_liked: bool
    likes_count: int
    message: str