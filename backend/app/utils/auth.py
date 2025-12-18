from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from ..config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Debug: Print SECRET_KEY on module load (first 10 chars only for security)
print(f"🔑 AUTH MODULE LOADED - SECRET_KEY starts with: {settings.SECRET_KEY[:10]}...")
print(f"🔑 ALGORITHM: {settings.ALGORITHM}")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hash a password using bcrypt.
    """
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token.

    Args:
        data: Dictionary containing user data (usually {'sub': user_id})
        expires_delta: Optional expiration time delta

    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    print(f"")
    print(f"=" * 60)
    print(f"🎫 CREATING ACCESS TOKEN")
    print(f"=" * 60)
    print(f"🎫 Payload: {to_encode}")
    print(f"🎫 SECRET_KEY starts with: {settings.SECRET_KEY[:15]}...")
    print(f"🎫 ALGORITHM: {settings.ALGORITHM}")

    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    print(f"🎫 Token created (first 80 chars): {encoded_jwt[:80]}...")
    print(f"🎫 Token length: {len(encoded_jwt)}")

    return encoded_jwt

def verify_token(token: str) -> Optional[dict]:
    """
    Verify and decode a JWT token.

    Args:
        token: JWT token string

    Returns:
        Decoded token payload or None if invalid
    """
    try:
        print(f"🔐 Verifying token: {token[:50] if token else 'NO TOKEN'}...")
        print(f"🔐 Using SECRET_KEY starting with: {settings.SECRET_KEY[:10]}...")
        print(f"🔐 Using ALGORITHM: {settings.ALGORITHM}")
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        print(f"✅ Token valid! User ID: {payload.get('sub')}")
        print(f"✅ Full payload: {payload}")
        return payload
    except JWTError as e:
        print(f"❌ Token verification failed: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return None
    except Exception as e:
        print(f"❌ Unexpected error in verify_token: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return None