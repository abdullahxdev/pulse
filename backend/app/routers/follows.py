from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from ..database import get_db
from ..models import Follow, User, Notification
from ..schemas.follow import FollowCreate, FollowResponse
from ..utils.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=FollowResponse, status_code=status.HTTP_201_CREATED)
def follow_user(
    follow_data: FollowCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Follow a user.
    """
    # Check if trying to follow self
    if follow_data.followee_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot follow yourself"
        )
    
    # Check if followee exists
    followee = db.query(User).filter(User.user_id == follow_data.followee_id).first()
    if not followee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Check if already following
    existing_follow = db.query(Follow).filter(
        Follow.follower_id == current_user.user_id,
        Follow.followee_id == follow_data.followee_id
    ).first()
    
    if existing_follow:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already following this user"
        )
    
    # Create follow
    try:
        new_follow = Follow(
            follower_id=current_user.user_id,
            followee_id=follow_data.followee_id
        )
        db.add(new_follow)
        db.commit()
        db.refresh(new_follow)
        
        # Create notification for followed user
        notification = Notification(
            user_id=follow_data.followee_id,
            type="follow",
            content=f"{current_user.username} started following you"
        )
        db.add(notification)
        db.commit()
        
        return {
            "follow_id": new_follow.follow_id,
            "follower_id": new_follow.follower_id,
            "followee_id": new_follow.followee_id,
            "created_at": new_follow.created_at,
            "followee_username": followee.username,
            "followee_profile_picture": followee.profile_picture
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already following this user"
        )

@router.delete("/{followee_id}", status_code=status.HTTP_204_NO_CONTENT)
def unfollow_user(
    followee_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Unfollow a user.
    """
    # Find follow relationship
    follow = db.query(Follow).filter(
        Follow.follower_id == current_user.user_id,
        Follow.followee_id == followee_id
    ).first()
    
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Not following this user"
        )
    
    db.delete(follow)
    db.commit()
    return None

@router.get("/followers/{user_id}")
def get_followers(
    user_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get list of followers for a user.
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    followers = db.query(User).join(
        Follow, Follow.follower_id == User.user_id
    ).filter(
        Follow.followee_id == user_id
    ).offset(skip).limit(limit).all()
    
    return [{
        "user_id": u.user_id,
        "username": u.username,
        "profile_picture": u.profile_picture
    } for u in followers]

@router.get("/following/{user_id}")
def get_following(
    user_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get list of users that a user is following.
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    following = db.query(User).join(
        Follow, Follow.followee_id == User.user_id
    ).filter(
        Follow.follower_id == user_id
    ).offset(skip).limit(limit).all()
    
    return [{
        "user_id": u.user_id,
        "username": u.username,
        "profile_picture": u.profile_picture
    } for u in following]

@router.get("/check/{followee_id}")
def check_if_following(
    followee_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if current user is following another user.
    """
    follow = db.query(Follow).filter(
        Follow.follower_id == current_user.user_id,
        Follow.followee_id == followee_id
    ).first()
    
    return {"followee_id": followee_id, "is_following": follow is not None}