from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Comment, Post, User, Notification
from ..schemas.comment import CommentCreate, CommentResponse, CommentUpdate
from ..utils.dependencies import get_current_user

router = APIRouter()

def build_comment_response(comment: Comment, db: Session) -> dict:
    """
    Helper function to build complete comment response with user info.
    """
    user = db.query(User).filter(User.user_id == comment.user_id).first()
    
    return {
        "comment_id": comment.comment_id,
        "post_id": comment.post_id,
        "user_id": comment.user_id,
        "text": comment.text,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
        "username": user.username if user else None,
        "user_profile_picture": user.profile_picture if user else None
    }

@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new comment on a post.
    """
    # Check if post exists
    post = db.query(Post).filter(Post.post_id == comment_data.post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Create comment
    new_comment = Comment(
        post_id=comment_data.post_id,
        user_id=current_user.user_id,
        text=comment_data.text
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    # Create notification for post owner (if not commenting on own post)
    if post.user_id != current_user.user_id:
        notification = Notification(
            user_id=post.user_id,
            type="comment",
            content=f"{current_user.username} commented on your post"
        )
        db.add(notification)
        db.commit()
    
    return build_comment_response(new_comment, db)

@router.get("/post/{post_id}", response_model=List[CommentResponse])
def get_post_comments(
    post_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Get all comments for a specific post.
    """
    # Check if post exists
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    comments = db.query(Comment).filter(
        Comment.post_id == post_id
    ).order_by(Comment.created_at.asc()).offset(skip).limit(limit).all()
    
    return [build_comment_response(comment, db) for comment in comments]

@router.get("/{comment_id}", response_model=CommentResponse)
def get_comment(comment_id: int, db: Session = Depends(get_db)):
    """
    Get a specific comment by ID.
    """
    comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    return build_comment_response(comment, db)

@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(
    comment_id: int,
    comment_data: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a comment (only by the comment owner).
    """
    comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check ownership
    if comment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this comment"
        )
    
    comment.text = comment_data.text
    db.commit()
    db.refresh(comment)
    return build_comment_response(comment, db)

@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a comment (only by the comment owner).
    """
    comment = db.query(Comment).filter(Comment.comment_id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Check ownership
    if comment.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )
    
    db.delete(comment)
    db.commit()
    return None