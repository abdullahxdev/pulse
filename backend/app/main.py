from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base

# Import routers (we'll create these next)
# from .routers import auth, users, posts, comments, likes, follows, messages, notifications, stories

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG
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
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Include routers (uncomment as we create them)
# app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# app.include_router(users.router, prefix="/users", tags=["Users"])
# app.include_router(posts.router, prefix="/posts", tags=["Posts"])
# app.include_router(comments.router, prefix="/comments", tags=["Comments"])
# app.include_router(likes.router, prefix="/likes", tags=["Likes"])
# app.include_router(follows.router, prefix="/follows", tags=["Follows"])
# app.include_router(messages.router, prefix="/messages", tags=["Messages"])
# app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
# app.include_router(stories.router, prefix="/stories", tags=["Stories"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)