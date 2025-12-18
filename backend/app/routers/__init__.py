from .auth import router as auth_router
from .users import router as users_router
from .posts import router as posts_router
from .comments import router as comments_router
from .likes import router as likes_router
from .follows import router as follows_router
from .messages import router as messages_router
from .notifications import router as notifications_router
from .stories import router as stories_router
from .hashtags import router as hashtags_router
from .saved_posts import router as saved_posts_router
from .uploads import router as uploads_router

__all__ = [
    "auth_router",
    "users_router",
    "posts_router",
    "comments_router",
    "likes_router",
    "follows_router",
    "messages_router",
    "notifications_router",
    "stories_router",
    "hashtags_router",
    "saved_posts_router",
    "uploads_router",
]