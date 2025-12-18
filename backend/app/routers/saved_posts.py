from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List
from ..database import get_db
from ..models import SavedPost, Post, User, Like, Comment, Hashtag, PostHashtag
from ..utils.dependencies import get_current_user

router = APIRouter()


def build_post_response(post: Post, current_user_id: int, db: Session) -> dict:
    """
    Helper function to build complete post response with user info and stats.
    """
    # Get user info
    user = db.query(User).filter(User.user_id == post.user_id).first()

    # Get likes count
    likes_count = db.query(Like).filter(Like.post_id == post.post_id).count()

    # Get comments count
    comments_count = db.query(Comment).filter(Comment.post_id == post.post_id).count()

    # Check if current user liked this post
    is_liked = db.query(Like).filter(
        Like.post_id == post.post_id,
        Like.user_id == current_user_id
    ).first() is not None

    # Get hashtags
    hashtags = db.query(Hashtag).join(PostHashtag).filter(
        PostHashtag.post_id == post.post_id
    ).all()
    hashtag_names = [tag.tag_name for tag in hashtags]

    return {
        "post_id": post.post_id,
        "user_id": post.user_id,
        "text": post.text,
        "media": post.media,
        "created_at": post.created_at,
        "updated_at": post.updated_at,
        "username": user.username if user else None,
        "user_profile_picture": user.profile_picture if user else None,
        "likes_count": likes_count,
        "comments_count": comments_count,
        "is_liked": is_liked,
        "is_saved": True,  # Always true since these are saved posts
        "hashtags": hashtag_names
    }


@router.post("/{post_id}", status_code=status.HTTP_201_CREATED)
def save_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save a post for later.
    """
    # Check if post exists
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check if already saved
    existing = db.query(SavedPost).filter(
        SavedPost.user_id == current_user.user_id,
        SavedPost.post_id == post_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post already saved"
        )

    # Create saved post
    try:
        saved_post = SavedPost(
            user_id=current_user.user_id,
            post_id=post_id
        )
        db.add(saved_post)
        db.commit()
        db.refresh(saved_post)

        return {
            "saved_id": saved_post.saved_id,
            "post_id": post_id,
            "message": "Post saved successfully"
        }
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Post already saved"
        )


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsave_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Remove a post from saved.
    """
    saved_post = db.query(SavedPost).filter(
        SavedPost.user_id == current_user.user_id,
        SavedPost.post_id == post_id
    ).first()

    if not saved_post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not saved"
        )

    db.delete(saved_post)
    db.commit()
    return None


@router.get("/")
def get_saved_posts(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all saved posts for current user.
    """
    saved = db.query(SavedPost).filter(
        SavedPost.user_id == current_user.user_id
    ).order_by(SavedPost.created_at.desc()).offset(skip).limit(limit).all()

    # Get the actual posts
    post_ids = [s.post_id for s in saved]
    posts = db.query(Post).filter(Post.post_id.in_(post_ids)).all()

    # Build response maintaining saved order
    post_map = {p.post_id: p for p in posts}
    return [
        build_post_response(post_map[s.post_id], current_user.user_id, db)
        for s in saved if s.post_id in post_map
    ]


@router.get("/check/{post_id}")
def check_if_saved(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if a post is saved by current user.
    """
    saved = db.query(SavedPost).filter(
        SavedPost.user_id == current_user.user_id,
        SavedPost.post_id == post_id
    ).first()

    return {"post_id": post_id, "is_saved": saved is not None}


@router.post("/toggle/{post_id}")
def toggle_save_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggle save status for a post (save if not saved, unsave if saved).
    """
    # Check if post exists
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )

    # Check if already saved
    existing = db.query(SavedPost).filter(
        SavedPost.user_id == current_user.user_id,
        SavedPost.post_id == post_id
    ).first()

    if existing:
        # Unsave
        db.delete(existing)
        db.commit()
        return {"post_id": post_id, "is_saved": False, "message": "Post unsaved"}
    else:
        # Save
        saved_post = SavedPost(
            user_id=current_user.user_id,
            post_id=post_id
        )
        db.add(saved_post)
        db.commit()
        return {"post_id": post_id, "is_saved": True, "message": "Post saved"}
