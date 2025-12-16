from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from ..database import get_db
from ..models import Like, Post, User, Notification
from ..schemas.like import LikeCreate, LikeResponse
from ..utils.dependencies import get_current_user

router = APIRouter()

@router.post("/", response_model=LikeResponse, status_code=status.HTTP_201_CREATED)
def like_post(
    like_data: LikeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Like a post.
    """
    # Check if post exists
    post = db.query(Post).filter(Post.post_id == like_data.post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check if already liked
    existing_like = db.query(Like).filter(
        Like.post_id == like_data.post_id,
        Like.user_id == current_user.user_id
    ).first()
    
    if existing_like:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post already liked"
        )
    
    # Create like
    try:
        new_like = Like(
            post_id=like_data.post_id,
            user_id=current_user.user_id
        )
        db.add(new_like)
        db.commit()
        db.refresh(new_like)
        
        # Create notification for post owner (if not liking own post)
        if post.user_id != current_user.user_id:
            notification = Notification(
                user_id=post.user_id,
                type="like",
                content=f"{current_user.username} liked your post"
            )
            db.add(notification)
            db.commit()
        
        return new_like
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post already liked"
        )

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Unlike a post.
    """
    # Find like
    like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.user_id
    ).first()
    
    if not like:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Like not found"
        )
    
    db.delete(like)
    db.commit()
    return None

@router.get("/post/{post_id}/count")
def get_post_likes_count(post_id: int, db: Session = Depends(get_db)):
    """
    Get the number of likes for a post.
    """
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    count = db.query(Like).filter(Like.post_id == post_id).count()
    return {"post_id": post_id, "likes_count": count}

@router.get("/post/{post_id}/check")
def check_if_liked(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if current user has liked a post.
    """
    like = db.query(Like).filter(
        Like.post_id == post_id,
        Like.user_id == current_user.user_id
    ).first()
    
    return {"post_id": post_id, "is_liked": like is not None}