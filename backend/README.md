# Pulse Backend - Technical Documentation

A comprehensive technical breakdown of the Pulse social media backend API built with FastAPI, SQLAlchemy, and PostgreSQL.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [API Routers](#api-routers)
- [Authentication System](#authentication-system)
- [Schemas (Pydantic Models)](#schemas-pydantic-models)
- [Utility Modules](#utility-modules)
- [API Endpoints Reference](#api-endpoints-reference)
- [Data Flow](#data-flow)
- [Known Challenges and Solutions](#known-challenges-and-solutions)
- [Development Setup](#development-setup)

---

## Architecture Overview

The Pulse backend follows a layered architecture pattern:

```
+-----------------------------------------------------------------------+
|                         FastAPI Application                            |
|                           (app/main.py)                               |
+-----------------------------------------------------------------------+
                                    |
        +---------------------------+---------------------------+
        |                           |                           |
        v                           v                           v
+---------------+           +---------------+           +---------------+
|   Routers     |           |  Middleware   |           | Static Files  |
| (API Routes)  |           |    (CORS)     |           |  (Uploads)    |
+---------------+           +---------------+           +---------------+
        |
        v
+-----------------------------------------------------------------------+
|                          Router Layer                                  |
|  auth | users | posts | comments | likes | follows | messages | etc.  |
+-----------------------------------------------------------------------+
        |
        +---------------------------+---------------------------+
        |                           |                           |
        v                           v                           v
+---------------+           +---------------+           +---------------+
|  Pydantic     |           |  Dependencies |           |   Utils       |
|  Schemas      |           | (Auth Guards) |           | (Hash, JWT)   |
+---------------+           +---------------+           +---------------+
        |                           |
        +---------------------------+
                    |
                    v
+-----------------------------------------------------------------------+
|                       SQLAlchemy ORM Layer                             |
|                  Models: User, Post, Comment, etc.                    |
+-----------------------------------------------------------------------+
                    |
                    v
+-----------------------------------------------------------------------+
|                        PostgreSQL Database                             |
+-----------------------------------------------------------------------+
```

### Design Principles

1. **Dependency Injection**: FastAPI's `Depends()` system for database sessions and auth
2. **Layered Architecture**: Clear separation between routes, schemas, models, and utils
3. **Token-based Auth**: JWT tokens with bcrypt password hashing
4. **RESTful Design**: Standard HTTP methods and status codes
5. **Automatic Documentation**: OpenAPI/Swagger docs at `/docs`

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.115.5 | Web framework |
| SQLAlchemy | 2.0.36 | ORM |
| PostgreSQL | 14+ | Database |
| Pydantic | 2.10.3 | Data validation |
| python-jose | 3.3.0 | JWT handling |
| passlib | 1.7.4 | Password hashing |
| bcrypt | 4.2.1 | Bcrypt algorithm |
| uvicorn | 0.32.1 | ASGI server |
| pydantic-settings | 2.6.1 | Settings management |
| python-multipart | 0.0.17 | File uploads |

---

## Project Structure

```
backend/
├── app/
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── __init__.py         # Model exports
│   │   ├── user.py             # User model
│   │   ├── post.py             # Post model
│   │   ├── comment.py          # Comment model
│   │   ├── like.py             # Like model
│   │   ├── follow.py           # Follow model
│   │   ├── message.py          # Message model
│   │   ├── notification.py     # Notification model
│   │   ├── story.py            # Story model
│   │   ├── hashtag.py          # Hashtag model
│   │   ├── post_hashtag.py     # Post-Hashtag junction
│   │   └── saved_post.py       # Saved posts model
│   │
│   ├── routers/                # API route handlers
│   │   ├── __init__.py         # Router exports
│   │   ├── auth.py             # Authentication routes
│   │   ├── users.py            # User management routes
│   │   ├── posts.py            # Post CRUD routes
│   │   ├── comments.py         # Comment routes
│   │   ├── likes.py            # Like/unlike routes
│   │   ├── follows.py          # Follow/unfollow routes
│   │   ├── messages.py         # Messaging routes
│   │   ├── notifications.py    # Notification routes
│   │   ├── stories.py          # Stories routes
│   │   ├── hashtags.py         # Hashtag routes
│   │   ├── saved_posts.py      # Saved posts routes
│   │   └── uploads.py          # File upload routes
│   │
│   ├── schemas/                # Pydantic validation schemas
│   │   ├── __init__.py         # Schema exports
│   │   ├── user.py             # User schemas
│   │   ├── post.py             # Post schemas
│   │   ├── comment.py          # Comment schemas
│   │   ├── like.py             # Like schemas
│   │   ├── follow.py           # Follow schemas
│   │   ├── message.py          # Message schemas
│   │   ├── notification.py     # Notification schemas
│   │   └── story.py            # Story schemas
│   │
│   ├── utils/                  # Utility functions
│   │   ├── __init__.py
│   │   ├── auth.py             # JWT and password utilities
│   │   └── dependencies.py     # FastAPI dependencies
│   │
│   ├── config.py               # Application settings
│   ├── database.py             # Database connection
│   └── main.py                 # Application entry point
│
├── uploads/                    # Uploaded media files
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── README.md                   # This file
```

---

## Database Models

### Entity Relationship Diagram

```
+-------------+       +-------------+       +-------------+
|    User     |       |    Post     |       |   Comment   |
+-------------+       +-------------+       +-------------+
| user_id PK  |<------| user_id FK  |       | comment_id  |
| username    |       | post_id PK  |<------| post_id FK  |
| email       |       | text        |       | user_id FK  |
| hashed_pwd  |       | media       |       | text        |
| profile_info|       | created_at  |       | created_at  |
| created_at  |       +-------------+       +-------------+
+-------------+              |
      |                      |
      |     +----------------+----------------+
      |     |                |                |
      v     v                v                v
+-------------+       +-------------+   +-------------+
|    Like     |       |   Follow    |   |  SavedPost  |
+-------------+       +-------------+   +-------------+
| like_id PK  |       | follow_id   |   | saved_id    |
| post_id FK  |       | follower_id |   | user_id FK  |
| user_id FK  |       | followee_id |   | post_id FK  |
| created_at  |       | created_at  |   | created_at  |
+-------------+       +-------------+   +-------------+

+-------------+       +---------------+       +-------------+
|   Message   |       | Notification  |       |    Story    |
+-------------+       +---------------+       +-------------+
| message_id  |       | notification_id|      | story_id    |
| sender_id   |       | user_id FK    |       | user_id FK  |
| receiver_id |       | type          |       | media       |
| content     |       | message       |       | created_at  |
| is_read     |       | is_read       |       | expires_at  |
| created_at  |       | created_at    |       +-------------+
+-------------+       +---------------+

+-------------+       +---------------+
|   Hashtag   |       | PostHashtag   |
+-------------+       +---------------+
| tag_id PK   |<------| tag_id FK     |
| tag_name    |       | post_id FK    |
+-------------+       +---------------+
```

### Model Details

#### 1. User Model (`models/user.py`)

```python
class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    profile_info = Column(Text, nullable=True)
    profile_picture = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
```

**Relationships**:
- `posts`: One-to-Many with Post
- `comments`: One-to-Many with Comment
- `likes`: One-to-Many with Like
- `sent_messages`: One-to-Many with Message (as sender)
- `received_messages`: One-to-Many with Message (as receiver)
- `followers`: One-to-Many with Follow (users following this user)
- `following`: One-to-Many with Follow (users this user follows)
- `stories`: One-to-Many with Story
- `notifications`: One-to-Many with Notification
- `saved_posts`: One-to-Many with SavedPost

#### 2. Post Model (`models/post.py`)

```python
class Post(Base):
    __tablename__ = "posts"

    post_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    text = Column(Text, nullable=True)
    media = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
```

**Relationships**:
- `user`: Many-to-One with User
- `comments`: One-to-Many with Comment
- `likes`: One-to-Many with Like
- `post_hashtags`: One-to-Many with PostHashtag
- `saved_by`: One-to-Many with SavedPost

#### 3. Follow Model (`models/follow.py`)

```python
class Follow(Base):
    __tablename__ = "follows"

    follow_id = Column(Integer, primary_key=True, autoincrement=True)
    follower_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    followee_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    created_at = Column(DateTime, server_default=func.now())
```

**Unique Constraint**: Ensures a user can only follow another user once.

#### 4. Message Model (`models/message.py`)

```python
class Message(Base):
    __tablename__ = "messages"

    message_id = Column(Integer, primary_key=True, autoincrement=True)
    sender_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    receiver_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"))
    content = Column(Text, nullable=False)
    is_read = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
```

---

## API Routers

### Router Registration (`main.py`)

```python
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
```

### 1. Auth Router (`routers/auth.py`)

**Purpose**: User registration and authentication.

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/register` | POST | Create new user account |
| `/auth/login` | POST | Authenticate and get token |
| `/auth/debug-token` | POST | Debug token verification |

**Register Flow**:
1. Validate username/email uniqueness
2. Hash password with bcrypt
3. Create user record
4. Generate JWT token
5. Return token and user data

**Login Flow**:
1. Find user by username
2. Verify password
3. Generate JWT token
4. Return token and user data

### 2. Posts Router (`routers/posts.py`)

**Purpose**: Post CRUD operations with hashtag support.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/posts/` | GET | Yes | Get feed (all posts) |
| `/posts/` | POST | Yes | Create new post |
| `/posts/{post_id}` | GET | Yes | Get specific post |
| `/posts/{post_id}` | PUT | Yes | Update post (owner only) |
| `/posts/{post_id}` | DELETE | Yes | Delete post (owner only) |
| `/posts/user/{user_id}` | GET | Yes | Get user's posts |

**Post Response Builder**:
```python
def build_post_response(post, current_user_id, db):
    return {
        "post_id": post.post_id,
        "user_id": post.user_id,
        "text": post.text,
        "media": post.media,
        "username": user.username,
        "likes_count": likes_count,
        "comments_count": comments_count,
        "is_liked": is_liked,       # Current user's like status
        "is_saved": is_saved,       # Current user's save status
        "hashtags": hashtag_names
    }
```

### 3. Users Router (`routers/users.py`)

**Purpose**: User profile management.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/users/` | GET | Yes | List users (with search) |
| `/users/me` | GET | Yes | Get current user profile |
| `/users/me` | PUT | Yes | Update current user profile |
| `/users/{user_id}` | GET | Yes | Get user by ID |
| `/users/{user_id}/stats` | GET | Yes | Get user statistics |

**User Stats Response**:
```python
{
    "posts_count": post_count,
    "followers_count": followers_count,
    "following_count": following_count
}
```

### 4. Follows Router (`routers/follows.py`)

**Purpose**: Follow/unfollow functionality.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/follows/` | POST | Yes | Follow a user |
| `/follows/{user_id}` | DELETE | Yes | Unfollow a user |
| `/follows/check/{user_id}` | GET | Yes | Check follow status |
| `/follows/followers/{user_id}` | GET | Yes | Get user's followers |
| `/follows/following/{user_id}` | GET | Yes | Get user's following |

### 5. Likes Router (`routers/likes.py`)

**Purpose**: Like/unlike posts.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/likes/` | POST | Yes | Like a post |
| `/likes/{post_id}` | DELETE | Yes | Unlike a post |
| `/likes/post/{post_id}` | GET | Yes | Get post likes |
| `/likes/post/{post_id}/check` | GET | Yes | Check if user liked |

### 6. Comments Router (`routers/comments.py`)

**Purpose**: Comment on posts.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/comments/` | POST | Yes | Add comment |
| `/comments/post/{post_id}` | GET | Yes | Get post comments |
| `/comments/{comment_id}` | DELETE | Yes | Delete comment |

### 7. Messages Router (`routers/messages.py`)

**Purpose**: Direct messaging.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/messages/` | POST | Yes | Send message |
| `/messages/conversations` | GET | Yes | Get conversation list |
| `/messages/conversation/{user_id}` | GET | Yes | Get messages with user |

### 8. Saved Posts Router (`routers/saved_posts.py`)

**Purpose**: Save/unsave posts.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/saved/` | GET | Yes | Get saved posts |
| `/saved/toggle/{post_id}` | POST | Yes | Toggle save status |
| `/saved/check/{post_id}` | GET | Yes | Check if saved |

### 9. Uploads Router (`routers/uploads.py`)

**Purpose**: File upload handling.

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/upload/image` | POST | Yes | Upload image file |

**Supported Formats**: JPEG, JPG, PNG, GIF, WebP

**Upload Process**:
1. Validate file type
2. Generate unique filename with UUID
3. Save to `uploads/` directory
4. Return URL path

---

## Authentication System

### JWT Token Flow

```
+-------------+     +-------------+     +-------------+
|   Client    |---->|  /auth/login|---->|   Backend   |
|             |     |             |     |             |
+-------------+     +-------------+     +-------------+
                          |
                          v
              +-------------------------+
              | 1. Validate credentials |
              | 2. Hash compare (bcrypt)|
              | 3. Create JWT token     |
              +-------------------------+
                          |
                          v
              +-------------------------+
              | JWT Token Contains:     |
              | - sub: user_id          |
              | - exp: expiration time  |
              +-------------------------+
                          |
                          v
+-------------+     +-------------+
|   Client    |<----| Token + User|
| stores token|     |             |
+-------------+     +-------------+
```

### Password Hashing (`utils/auth.py`)

```python
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

### JWT Token Creation

```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=1440))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm="HS256")
    return encoded_jwt
```

### Token Verification

```python
def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        return None
```

### Authentication Dependency (`utils/dependencies.py`)

```python
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id = payload.get("sub")
    user = db.query(User).filter(User.user_id == int(user_id)).first()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user
```

---

## Schemas (Pydantic Models)

### User Schemas (`schemas/user.py`)

```python
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    profile_info: Optional[str] = None
    profile_picture: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    profile_info: Optional[str]
    profile_picture: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
```

### Post Schemas (`schemas/post.py`)

```python
class PostCreate(BaseModel):
    text: Optional[str] = None
    media: Optional[str] = None
    hashtags: Optional[List[str]] = None

class PostResponse(BaseModel):
    post_id: int
    user_id: int
    text: Optional[str]
    media: Optional[str]
    created_at: datetime
    username: Optional[str]
    likes_count: int
    comments_count: int
    is_liked: bool
    is_saved: bool
    hashtags: List[str]
```

### Follow Schemas (`schemas/follow.py`)

```python
class FollowCreate(BaseModel):
    followee_id: int

class FollowResponse(BaseModel):
    follow_id: int
    follower_id: int
    followee_id: int
    created_at: datetime
```

---

## Utility Modules

### Configuration (`config.py`)

```python
class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    CORS_ORIGINS: str = "http://localhost:5173"
    APP_NAME: str = "Pulse Social Media API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
```

### Database Connection (`database.py`)

```python
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=settings.DEBUG
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

## API Endpoints Reference

### Complete Endpoint List

| Category | Method | Endpoint | Auth | Description |
|----------|--------|----------|------|-------------|
| **Auth** | POST | `/auth/register` | No | Register user |
| | POST | `/auth/login` | No | Login user |
| | POST | `/auth/debug-token` | No | Debug token |
| **Users** | GET | `/users/` | Yes | List users |
| | GET | `/users/me` | Yes | Current user |
| | PUT | `/users/me` | Yes | Update profile |
| | GET | `/users/{id}` | Yes | Get user |
| | GET | `/users/{id}/stats` | Yes | User stats |
| **Posts** | GET | `/posts/` | Yes | Feed |
| | POST | `/posts/` | Yes | Create post |
| | GET | `/posts/{id}` | Yes | Get post |
| | PUT | `/posts/{id}` | Yes | Update post |
| | DELETE | `/posts/{id}` | Yes | Delete post |
| | GET | `/posts/user/{id}` | Yes | User posts |
| **Comments** | POST | `/comments/` | Yes | Add comment |
| | GET | `/comments/post/{id}` | Yes | Post comments |
| | DELETE | `/comments/{id}` | Yes | Delete comment |
| **Likes** | POST | `/likes/` | Yes | Like post |
| | DELETE | `/likes/{id}` | Yes | Unlike post |
| | GET | `/likes/post/{id}` | Yes | Post likes |
| | GET | `/likes/post/{id}/check` | Yes | Check liked |
| **Follows** | POST | `/follows/` | Yes | Follow user |
| | DELETE | `/follows/{id}` | Yes | Unfollow |
| | GET | `/follows/check/{id}` | Yes | Check follow |
| | GET | `/follows/followers/{id}` | Yes | Followers |
| | GET | `/follows/following/{id}` | Yes | Following |
| **Messages** | POST | `/messages/` | Yes | Send message |
| | GET | `/messages/conversations` | Yes | Conversations |
| | GET | `/messages/conversation/{id}` | Yes | Get chat |
| **Saved** | GET | `/saved/` | Yes | Saved posts |
| | POST | `/saved/toggle/{id}` | Yes | Toggle save |
| | GET | `/saved/check/{id}` | Yes | Check saved |
| **Upload** | POST | `/upload/image` | Yes | Upload image |
| **Notifications** | GET | `/notifications/` | Yes | Get notifications |
| | PUT | `/notifications/{id}` | Yes | Mark as read |
| **Stories** | GET | `/stories/` | Yes | Get stories |
| | POST | `/stories/` | Yes | Create story |
| **Hashtags** | GET | `/hashtags/{tag}/posts` | Yes | Posts by tag |

---

## Data Flow

### Post Creation Flow

```
Client Request                Backend Processing
     |
     |  POST /posts/
     |  {text, media, hashtags}
     |
     v
+------------------+
| Authentication   |  <-- Verify JWT token
| get_current_user |
+------------------+
     |
     v
+------------------+
| Validation       |  <-- Pydantic PostCreate schema
| PostCreate       |
+------------------+
     |
     v
+------------------+
| Create Post      |  <-- SQLAlchemy insert
| db.add(post)     |
+------------------+
     |
     v
+------------------+
| Process Hashtags |  <-- Get or create hashtag records
| Link to post     |      Insert PostHashtag junction
+------------------+
     |
     v
+------------------+
| Build Response   |  <-- Add user info, counts, statuses
| build_post_resp  |
+------------------+
     |
     v
Client Response
{post_id, text, username, likes_count, is_liked, ...}
```

### Authentication Flow

```
Login Request              Backend Processing
     |
     |  POST /auth/login
     |  {username, password}
     |
     v
+------------------+
| Find User        |  <-- Query by username
| db.query(User)   |
+------------------+
     |
     v
+------------------+
| Verify Password  |  <-- bcrypt.verify()
| pwd_context      |
+------------------+
     |
     v
+------------------+
| Create Token     |  <-- JWT encode with user_id
| create_token()   |
+------------------+
     |
     v
Client Response
{access_token, token_type, user}
```

---

## Known Challenges and Solutions

### Challenge 1: Token Format Issues

**Problem**: Frontend couldn't authenticate after login.

**Root Cause**: Token subject (`sub`) was stored as integer instead of string.

**Solution**: Convert user_id to string in JWT payload:
```python
access_token = create_access_token(
    data={"sub": str(user.user_id)}  # String, not int
)
```

### Challenge 2: Follow Status Not Returned in Profile

**Problem**: Frontend couldn't determine if user is following another user.

**Root Cause**: User profile endpoint didn't include `is_following` field.

**Solution**: Added follow status check in user profile query:
```python
is_following = db.query(Follow).filter(
    Follow.follower_id == current_user.user_id,
    Follow.followee_id == user_id
).first() is not None

return {**user_data, "is_following": is_following}
```

### Challenge 3: CORS Issues

**Problem**: Frontend requests blocked by CORS policy.

**Solution**: Configured CORS middleware properly:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Challenge 4: Image Upload Not Working

**Problem**: File uploads returned 422 validation error.

**Solution**:
1. Added `python-multipart` dependency
2. Used `UploadFile` type for file parameter
3. Configured static file serving:
```python
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
```

### Challenge 5: Circular Import Issues

**Problem**: Model relationships caused circular imports.

**Solution**: Used string references for relationships:
```python
posts = relationship("Post", back_populates="user")  # String, not class
```

---

## Development Setup

### Prerequisites
- Python 3.11+
- PostgreSQL 14+
- pip or pipenv

### Installation

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Unix)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables (.env)

```env
DATABASE_URL=postgresql://user:password@localhost:5432/pulse_db
SECRET_KEY=your-super-secret-key-here-make-it-long
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:5173
APP_NAME=Pulse Social Media API
APP_VERSION=1.0.0
DEBUG=True
```

### Database Setup

```bash
# Create database (PostgreSQL)
createdb pulse_db

# Tables are created automatically on first run
python -c "from app.database import engine, Base; Base.metadata.create_all(bind=engine)"
```

### Running the Server

```bash
# Development with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### API Documentation

Once running, access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
- OpenAPI JSON: `http://localhost:8000/openapi.json`

---

## Dependencies (requirements.txt)

```
fastapi==0.115.5
uvicorn==0.32.1
sqlalchemy==2.0.36
psycopg2-binary==2.9.10
pydantic==2.10.3
pydantic-settings==2.6.1
python-jose==3.3.0
passlib==1.7.4
bcrypt==4.2.1
python-multipart==0.0.17
email-validator==2.2.0
python-dotenv==1.0.1
```

---

## Security Considerations

1. **Password Storage**: All passwords are hashed with bcrypt (never stored plain)
2. **JWT Tokens**: Tokens expire after 24 hours by default
3. **CORS**: Restricted to specific origins
4. **SQL Injection**: Prevented by SQLAlchemy ORM parameterized queries
5. **Authorization**: Ownership checks on update/delete operations
6. **File Uploads**: Type validation for image uploads

---

## License

This backend is part of the Pulse social media platform project.
