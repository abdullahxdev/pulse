from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# User Registration Schema
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    profile_info: Optional[str] = None
    profile_picture: Optional[str] = None

# User Login Schema
class UserLogin(BaseModel):
    username: str
    password: str

# User Update Schema
class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    profile_info: Optional[str] = None
    profile_picture: Optional[str] = None
    password: Optional[str] = Field(None, min_length=6)

# User Response Schema (what we send back to client)
class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    profile_info: Optional[str] = None
    profile_picture: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Token Response Schema
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse