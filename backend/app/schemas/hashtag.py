from pydantic import BaseModel, Field
from typing import List

# ============================================
# HASHTAG SCHEMAS
# ============================================

class HashtagBase(BaseModel):
    """Base hashtag schema"""
    tag_name: str = Field(..., min_length=1, max_length=50)

class HashtagResponse(HashtagBase):
    """Schema for hashtag response"""
    tag_id: int
    posts_count: int = 0  # Number of posts with this hashtag
    
    class Config:
        from_attributes = True

class TrendingHashtagResponse(HashtagResponse):
    """Schema for trending hashtag with stats"""
    recent_posts_count: int = 0  # Posts in last 24 hours
    growth_percentage: float = 0.0  # Growth compared to previous period

class HashtagSearchResponse(BaseModel):
    """Schema for hashtag search results"""
    hashtags: List[HashtagResponse]
    total: int