from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models.user import User
from .auth import verify_token

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency to get the current authenticated user.

    Args:
        token: JWT token from Authorization header
        db: Database session

    Returns:
        User object if authentication successful

    Raises:
        HTTPException 401 if authentication fails
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    print(f"")
    print(f"=" * 60)
    print(f"🔒 GET_CURRENT_USER CALLED")
    print(f"=" * 60)
    print(f"🔒 Token received (first 80 chars): {token[:80] if token else 'NO TOKEN'}...")
    print(f"🔒 Token length: {len(token) if token else 0}")

    # Verify token
    payload = verify_token(token)
    if payload is None:
        print("❌ Token verification failed in get_current_user")
        raise credentials_exception

    # Get user_id from token
    user_id: str = payload.get("sub")
    if user_id is None:
        print("❌ No 'sub' claim in token payload")
        raise credentials_exception

    # Get user from database
    user = db.query(User).filter(User.user_id == int(user_id)).first()
    if user is None:
        print(f"❌ User with ID {user_id} not found in database")
        raise credentials_exception

    print(f"✅ User authenticated: {user.username} (ID: {user.user_id})")
    return user


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Optional dependency to get the current authenticated user.
    Returns None if no token or invalid token (doesn't raise exception).

    Args:
        token: JWT token from Authorization header (optional)
        db: Database session

    Returns:
        User object if authentication successful, None otherwise
    """
    if token is None:
        return None

    # Verify token
    payload = verify_token(token)
    if payload is None:
        return None

    # Get user_id from token
    user_id: str = payload.get("sub")
    if user_id is None:
        return None

    # Get user from database
    user = db.query(User).filter(User.user_id == int(user_id)).first()
    return user