from pydantic import BaseModel
from datetime import datetime
from typing import List

# ============================================
# FOLLOW SCHEMAS
# ============================================

class FollowCreate(BaseModel):
    """Schema for creating a follow"""
    followee_id: int

class FollowResponse(BaseModel):
    """Schema for follow relationship response"""
    follow_id: int
    follower_id: int
    followee_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class FollowToggleResponse(BaseModel):
    """Schema for follow/unfollow action response"""
    success: bool
    is_following: bool
    message: str

class FollowerResponse(BaseModel):
    """Schema for follower user info"""
    user_id: int
    username: str
    profile_picture: str | None
    profile_info: str | None
    is_following: bool = False  # Whether current user follows this follower
    
    class Config:
        from_attributes = True

class FollowingResponse(BaseModel):
    """Schema for following user info"""
    user_id: int
    username: str
    profile_picture: str | None
    profile_info: str | None
    is_following: bool = True  # Always true for following list
    
    class Config:
        from_attributes = True