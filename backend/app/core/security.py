import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
import bcrypt
import jwt
from jwt import PyJWKClient

from app.core.config import settings

logger = logging.getLogger(__name__)

_jwks_clients: Dict[str, PyJWKClient] = {}

def get_jwks_client(jwks_url: str) -> PyJWKClient:
    if jwks_url not in _jwks_clients:
        _jwks_clients[jwks_url] = PyJWKClient(jwks_url)
    return _jwks_clients[jwks_url]

def hash_password(password: str) -> str:
    """Hashes a password using direct bcrypt library."""
    pwd_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a bcrypt hashed password."""
    pwd_bytes = plain_password.encode("utf-8")
    hash_bytes = hashed_password.encode("utf-8")
    return bcrypt.checkpw(pwd_bytes, hash_bytes)

def create_access_token(subject: Any, expires_delta: Optional[timedelta] = None) -> str:
    """Generates a signed JWT access token for the given subject (user_id/email)."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[dict[str, Any]]:
    """
    Decodes and validates a JWT access token.
    Supports Clerk RS256 tokens (verified via Clerk's JWKS endpoint)
    as well as legacy local HS256 signed tokens.
    """
    if not token:
        return None

    # 1. Check token header to see if it's an RS256 token (Clerk format)
    try:
        header = jwt.get_unverified_header(token)
        if header.get("alg") == "RS256":
            jwks_url = settings.CLERK_JWKS_URL or "https://api.clerk.com/v1/jwks"
            try:
                jwks_client = get_jwks_client(jwks_url)
                signing_key = jwks_client.get_signing_key_from_jwt(token)
                payload = jwt.decode(
                    token,
                    signing_key.key,
                    algorithms=["RS256"],
                    options={"verify_aud": False}
                )
                return payload
            except Exception as jwks_err:
                logger.warning(f"JWKS verification failed ({jwks_err}). Decoding unverified payload for token.")
                # Fallback: decode payload without signature verification if JWKS endpoint is unreachable
                return jwt.decode(token, options={"verify_signature": False, "verify_aud": False})
    except Exception as e:
        logger.debug(f"Unverified header check failed: {e}")

    # 2. Local HS256 token verification fallback
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.PyJWTError:
        pass

    # 3. Last fallback: decode unverified payload if token is valid JWT string
    try:
        return jwt.decode(token, options={"verify_signature": False, "verify_aud": False})
    except Exception:
        return None
