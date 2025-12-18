from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .config import settings
from .database import engine, Base
import os

# Import all routers
from .routers import (
    auth_router,
    users_router,
    posts_router,
    comments_router,
    likes_router,
    follows_router,
    messages_router,
    notifications_router,
    stories_router,
    hashtags_router,
    saved_posts_router,
    uploads_router
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    description="Pulse Social Media Platform API - A modern social networking backend"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to Pulse Social Media API",
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "status": "running"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Pulse API"}

# Include all routers
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(posts_router, prefix="/posts", tags=["Posts"])
app.include_router(comments_router, prefix="/comments", tags=["Comments"])
app.include_router(likes_router, prefix="/likes", tags=["Likes"])
app.include_router(follows_router, prefix="/follows", tags=["Follows"])
app.include_router(messages_router, prefix="/messages", tags=["Messages"])
app.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
app.include_router(stories_router, prefix="/stories", tags=["Stories"])
app.include_router(hashtags_router, prefix="/hashtags", tags=["Hashtags"])
app.include_router(saved_posts_router, prefix="/saved", tags=["Saved Posts"])
app.include_router(uploads_router, prefix="/upload", tags=["File Uploads"])

# Mount static files directory for uploaded images
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)