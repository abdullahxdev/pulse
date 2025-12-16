from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Hashtag, PostHashtag, Post, User, Like, Comment
from ..schemas.hashtag import HashtagResponse
from ..schemas.post import PostResponse
from ..utils.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[HashtagResponse])
def get_trending_hashtags(
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Get trending hashtags (sorted by post count).
    """
    # Get all hashtags with their post counts
    hashtags = db.query(Hashtag).all()
    
    hashtag_data = []
    for hashtag in hashtags:
        post_count = db.query(PostHashtag).filter(
            PostHashtag.tag_id == hashtag.tag_id
        ).count()
        
        hashtag_data.append({
            "tag_id": hashtag.tag_id,
            "tag_name": hashtag.tag_name,
            "post_count": post_count
        })
    
    # Sort by post count
    hashtag_data.sort(key=lambda x: x["post_count"], reverse=True)
    
    return hashtag_data[:limit]

@router.get("/{tag_name}", response_model=HashtagResponse)
def get_hashtag(tag_name: str, db: Session = Depends(get_db)):
    """
    Get a specific hashtag by name.
    """
    # Clean tag name
    clean_tag = tag_name.strip().lstrip('#').lower()
    
    hashtag = db.query(Hashtag).filter(Hashtag.tag_name == clean_tag).first()
    if not hashtag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hashtag not found"
        )
    
    post_count = db.query(PostHashtag).filter(
        PostHashtag.tag_id == hashtag.tag_id
    ).count()
    
    return {
        "tag_id": hashtag.tag_id,
        "tag_name": hashtag.tag_name,
        "post_count": post_count
    }

@router.get("/{tag_name}/posts", response_model=List[PostResponse])
def get_posts_by_hashtag(
    tag_name: str,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all posts with a specific hashtag.
    """
    # Clean tag name
    clean_tag = tag_name.strip().lstrip('#').lower()
    
    # Find hashtag
    hashtag = db.query(Hashtag).filter(Hashtag.tag_name == clean_tag).first()
    if not hashtag:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hashtag not found"
        )
    
    # Get posts with this hashtag
    posts = db.query(Post).join(PostHashtag).filter(
        PostHashtag.tag_id == hashtag.tag_id
    ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    
    # Build response for each post
    result = []
    for post in posts:
        # Get user info
        user = db.query(User).filter(User.user_id == post.user_id).first()
        
        # Get stats
        likes_count = db.query(Like).filter(Like.post_id == post.post_id).count()
        comments_count = db.query(Comment).filter(Comment.post_id == post.post_id).count()
        is_liked = db.query(Like).filter(
            Like.post_id == post.post_id,
            Like.user_id == current_user.user_id
        ).first() is not None
        
        # Get all hashtags for this post
        all_hashtags = db.query(Hashtag).join(PostHashtag).filter(
            PostHashtag.post_id == post.post_id
        ).all()
        hashtag_names = [tag.tag_name for tag in all_hashtags]
        
        result.append({
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
            "hashtags": hashtag_names
        })
    
    return result

@router.get("/search/{query}", response_model=List[HashtagResponse])
def search_hashtags(
    query: str,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Search hashtags by name.
    """
    # Clean query
    clean_query = query.strip().lstrip('#').lower()
    
    # Search hashtags
    hashtags = db.query(Hashtag).filter(
        Hashtag.tag_name.contains(clean_query)
    ).limit(limit).all()
    
    result = []
    for hashtag in hashtags:
        post_count = db.query(PostHashtag).filter(
            PostHashtag.tag_id == hashtag.tag_id
        ).count()
        
        result.append({
            "tag_id": hashtag.tag_id,
            "tag_name": hashtag.tag_name,
            "post_count": post_count
        })
    
    # Sort by post count
    result.sort(key=lambda x: x["post_count"], reverse=True)
    
    return result