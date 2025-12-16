"""
Pydantic schemas for request/response validation
"""

from .user import (
    UserCreate,
    UserLogin,
    UserUpdate,
    UserResponse,
    UserProfileResponse,
    TokenResponse
)

from .post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostDetailResponse
)

from .comment import (
    CommentCreate,
    CommentUpdate,
    CommentResponse
)

from .like import (
    LikeResponse,
    LikeToggleResponse
)

from .follow import (
    FollowResponse,
    FollowToggleResponse,
    FollowerResponse,
    FollowingResponse
)

from .message import (
    MessageCreate,
    MessageResponse,
    ConversationResponse,
    MessageMarkReadResponse
)

from .notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationMarkReadResponse,
    NotificationStatsResponse
)

from .story import (
    StoryCreate,
    StoryResponse,
    StoryDeleteResponse
)

from .hashtag import (
    HashtagResponse,
    TrendingHashtagResponse,
    HashtagSearchResponse
)

__all__ = [
    # User
    "UserCreate",
    "UserLogin",
    "UserUpdate",
    "UserResponse",
    "UserProfileResponse",
    "TokenResponse",
    
    # Post
    "PostCreate",
    "PostUpdate",
    "PostResponse",
    "PostDetailResponse",
    
    # Comment
    "CommentCreate",
    "CommentUpdate",
    "CommentResponse",
    
    # Like
    "LikeResponse",
    "LikeToggleResponse",
    
    # Follow
    "FollowResponse",
    "FollowToggleResponse",
    "FollowerResponse",
    "FollowingResponse",
    
    # Message
    "MessageCreate",
    "MessageResponse",
    "ConversationResponse",
    "MessageMarkReadResponse",
    
    # Notification
    "NotificationCreate",
    "NotificationResponse",
    "NotificationMarkReadResponse",
    "NotificationStatsResponse",
    
    # Story
    "StoryCreate",
    "StoryResponse",
    "StoryDeleteResponse",
    
    # Hashtag
    "HashtagResponse",
    "TrendingHashtagResponse",
    "HashtagSearchResponse",
]