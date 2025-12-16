from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ============================================
# USER SCHEMAS
# ============================================

class UserBase(BaseModel):
    """Base user schema with common fields"""
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    profile_info: Optional[str] = Field(None, max_length=500)
    profile_picture: Optional[str] = None

class UserResponse(UserBase):
    """Schema for user response (public info)"""
    user_id: int
    profile_info: Optional[str] = None
    profile_picture: Optional[str] = None
    created_at: datetime
    
    # Stats (will be added from queries)
    posts_count: int = 0
    followers_count: int = 0
    following_count: int = 0
    
    class Config:
        from_attributes = True

class UserProfileResponse(UserResponse):
    """Extended user profile with follow status"""
    is_following: bool = False
    
class TokenResponse(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse