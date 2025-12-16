from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Follow, Post
from ..schemas.user import UserResponse, UserUpdate
from ..utils.dependencies import get_current_user
from ..utils.auth import get_password_hash

router = APIRouter()

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user's profile.
    """
    return current_user

@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    """
    Get user profile by user ID.
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get("/username/{username}", response_model=UserResponse)
def get_user_by_username(username: str, db: Session = Depends(get_db)):
    """
    Get user profile by username.
    """
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/me", response_model=UserResponse)
def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile.
    """
    # Update username if provided
    if user_data.username:
        existing = db.query(User).filter(
            User.username == user_data.username,
            User.user_id != current_user.user_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        current_user.username = user_data.username
    
    # Update email if provided
    if user_data.email:
        existing = db.query(User).filter(
            User.email == user_data.email,
            User.user_id != current_user.user_id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = user_data.email
    
    # Update other fields
    if user_data.profile_info is not None:
        current_user.profile_info = user_data.profile_info
    if user_data.profile_picture is not None:
        current_user.profile_picture = user_data.profile_picture
    if user_data.password:
        current_user.hashed_password = get_password_hash(user_data.password)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_current_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete current user's account.
    """
    db.delete(current_user)
    db.commit()
    return None

@router.get("/{user_id}/stats")
def get_user_stats(user_id: int, db: Session = Depends(get_db)):
    """
    Get user statistics (followers, following, posts count).
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    followers_count = db.query(Follow).filter(Follow.followee_id == user_id).count()
    following_count = db.query(Follow).filter(Follow.follower_id == user_id).count()
    posts_count = db.query(Post).filter(Post.user_id == user_id).count()
    
    return {
        "user_id": user_id,
        "followers_count": followers_count,
        "following_count": following_count,
        "posts_count": posts_count
    }

@router.get("/", response_model=List[UserResponse])
def search_users(
    query: str = "",
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Search users by username.
    """
    users = db.query(User).filter(
        User.username.contains(query)
    ).offset(skip).limit(limit).all()
    
    return users