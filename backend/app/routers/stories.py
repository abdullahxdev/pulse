from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from ..database import get_db
from ..models import Story, User, Follow
from ..schemas.story import StoryCreate, StoryResponse
from ..utils.dependencies import get_current_user

router = APIRouter()

def build_story_response(story: Story, db: Session) -> dict:
    """
    Helper function to build complete story response with user info.
    """
    user = db.query(User).filter(User.user_id == story.user_id).first()
    
    return {
        "story_id": story.story_id,
        "user_id": story.user_id,
        "media": story.media,
        "expiration_time": story.expiration_time,
        "created_at": story.created_at,
        "username": user.username if user else None,
        "user_profile_picture": user.profile_picture if user else None
    }

@router.post("/", response_model=StoryResponse, status_code=status.HTTP_201_CREATED)
def create_story(
    story_data: StoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new story.
    """
    # Calculate expiration time
    expiration_time = datetime.utcnow() + timedelta(hours=story_data.expiration_hours)
    
    # Create story
    new_story = Story(
        user_id=current_user.user_id,
        media=story_data.media,
        expiration_time=expiration_time
    )
    db.add(new_story)
    db.commit()
    db.refresh(new_story)
    
    return build_story_response(new_story, db)

@router.get("/", response_model=List[StoryResponse])
def get_stories(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get active stories from users that current user follows (including own stories).
    """
    # Get list of followed users
    following = db.query(Follow.followee_id).filter(
        Follow.follower_id == current_user.user_id
    ).all()
    followed_ids = [f[0] for f in following]
    
    # Add current user to the list
    followed_ids.append(current_user.user_id)
    
    # Get non-expired stories from followed users
    current_time = datetime.utcnow()
    stories = db.query(Story).filter(
        Story.user_id.in_(followed_ids),
        Story.expiration_time > current_time
    ).order_by(Story.created_at.desc()).offset(skip).limit(limit).all()
    
    return [build_story_response(story, db) for story in stories]

@router.get("/user/{user_id}", response_model=List[StoryResponse])
def get_user_stories(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get active stories from a specific user.
    """
    # Check if user exists
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get non-expired stories
    current_time = datetime.utcnow()
    stories = db.query(Story).filter(
        Story.user_id == user_id,
        Story.expiration_time > current_time
    ).order_by(Story.created_at.desc()).all()
    
    return [build_story_response(story, db) for story in stories]

@router.get("/{story_id}", response_model=StoryResponse)
def get_story(story_id: int, db: Session = Depends(get_db)):
    """
    Get a specific story by ID.
    """
    story = db.query(Story).filter(Story.story_id == story_id).first()
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
    
    # Check if story has expired
    if story.expiration_time < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Story has expired"
        )
    
    return build_story_response(story, db)

@router.delete("/{story_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_story(
    story_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a story (only by the story owner).
    """
    story = db.query(Story).filter(Story.story_id == story_id).first()
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
    
    # Check ownership
    if story.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this story"
        )
    
    db.delete(story)
    db.commit()
    return None

@router.delete("/cleanup/expired", status_code=status.HTTP_200_OK)
def cleanup_expired_stories(db: Session = Depends(get_db)):
    """
    Delete all expired stories (admin/cleanup endpoint).
    """
    current_time = datetime.utcnow()
    deleted = db.query(Story).filter(Story.expiration_time < current_time).delete()
    db.commit()
    
    return {"message": f"Deleted {deleted} expired stories"}