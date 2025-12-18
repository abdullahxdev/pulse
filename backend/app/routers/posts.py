from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Post, User, Like, Comment, Hashtag, PostHashtag, SavedPost
from ..schemas.post import PostCreate, PostResponse, PostUpdate
from ..utils.dependencies import get_current_user

router = APIRouter()

def build_post_response(post: Post, current_user_id: Optional[int], db: Session) -> dict:
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
    is_liked = False
    is_saved = False
    if current_user_id:
        is_liked = db.query(Like).filter(
            Like.post_id == post.post_id,
            Like.user_id == current_user_id
        ).first() is not None

        is_saved = db.query(SavedPost).filter(
            SavedPost.post_id == post.post_id,
            SavedPost.user_id == current_user_id
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
        "is_saved": is_saved,
        "hashtags": hashtag_names
    }

@router.post("/", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    post_data: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new post.
    """
    # Create post
    new_post = Post(
        user_id=current_user.user_id,
        text=post_data.text,
        media=post_data.media
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    # Add hashtags if provided
    if post_data.hashtags:
        for tag_name in post_data.hashtags:
            # Clean hashtag (remove # if present)
            clean_tag = tag_name.strip().lstrip('#').lower()
            if not clean_tag:
                continue
            
            # Get or create hashtag
            hashtag = db.query(Hashtag).filter(Hashtag.tag_name == clean_tag).first()
            if not hashtag:
                hashtag = Hashtag(tag_name=clean_tag)
                db.add(hashtag)
                db.commit()
                db.refresh(hashtag)
            
            # Link post to hashtag
            post_hashtag = PostHashtag(post_id=new_post.post_id, tag_id=hashtag.tag_id)
            db.add(post_hashtag)
        
        db.commit()
    
    return build_post_response(new_post, current_user.user_id, db)

@router.get("/", response_model=List[PostResponse])
def get_feed(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get posts feed (all posts, ordered by newest first).
    """
    posts = db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    return [build_post_response(post, current_user.user_id, db) for post in posts]

@router.get("/{post_id}", response_model=PostResponse)
def get_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific post by ID.
    """
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    return build_post_response(post, current_user.user_id, db)

@router.put("/{post_id}", response_model=PostResponse)
def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a post (only by the post owner).
    """
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check ownership
    if post.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this post"
        )
    
    # Update fields
    if post_data.text is not None:
        post.text = post_data.text
    if post_data.media is not None:
        post.media = post_data.media
    
    # Update hashtags if provided
    if post_data.hashtags is not None:
        # Remove old hashtags
        db.query(PostHashtag).filter(PostHashtag.post_id == post_id).delete()
        
        # Add new hashtags
        for tag_name in post_data.hashtags:
            clean_tag = tag_name.strip().lstrip('#').lower()
            if not clean_tag:
                continue
            
            hashtag = db.query(Hashtag).filter(Hashtag.tag_name == clean_tag).first()
            if not hashtag:
                hashtag = Hashtag(tag_name=clean_tag)
                db.add(hashtag)
                db.commit()
                db.refresh(hashtag)
            
            post_hashtag = PostHashtag(post_id=post_id, tag_id=hashtag.tag_id)
            db.add(post_hashtag)
    
    db.commit()
    db.refresh(post)
    return build_post_response(post, current_user.user_id, db)

@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a post (only by the post owner).
    """
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Check ownership
    if post.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this post"
        )
    
    db.delete(post)
    db.commit()
    return None

@router.get("/user/{user_id}", response_model=List[PostResponse])
def get_user_posts(
    user_id: int,
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all posts by a specific user.
    """
    posts = db.query(Post).filter(
        Post.user_id == user_id
    ).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    
    return [build_post_response(post, current_user.user_id, db) for post in posts]