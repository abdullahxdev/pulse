from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from ..database import get_db
from ..models import User
from ..schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from ..utils.auth import verify_password, get_password_hash, create_access_token
from ..config import settings

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    """
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hashed_password,
        profile_info=user_data.profile_info,
        profile_picture=user_data.profile_picture
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token (sub must be a string per JWT spec)
    access_token = create_access_token(
        data={"sub": str(new_user.user_id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return access token.
    """
    # Find user by username
    user = db.query(User).filter(User.username == credentials.username).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token (sub must be a string per JWT spec)
    access_token = create_access_token(
        data={"sub": str(user.user_id)},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    print(f"🎫 LOGIN - Created token for user {user.username} (ID: {user.user_id})")
    print(f"🎫 LOGIN - Token starts with: {access_token[:50]}...")

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/debug-token")
def debug_token(request_body: dict):
    """
    Debug endpoint to test token verification.
    Pass {"token": "your-token-here"} in the request body.
    """
    from ..utils.auth import verify_token

    token = request_body.get("token", "")
    print(f"🔍 DEBUG - Testing token: {token[:50] if token else 'NO TOKEN'}...")

    if not token:
        return {"valid": False, "error": "No token provided"}

    payload = verify_token(token)

    if payload:
        return {
            "valid": True,
            "payload": payload,
            "user_id": payload.get("sub")
        }
    else:
        return {
            "valid": False,
            "error": "Token verification failed"
        }