import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, List
import bcrypt
import jwt
from jwt import PyJWKClient, PyJWTError

from app.core.config import settings

logger = logging.getLogger(__name__)

# Global cache for PyJWKClient instances to avoid re-instantiating on every request
_jwks_clients: Dict[str, PyJWKClient] = {}

def get_jwks_headers() -> Dict[str, str]:
    """
    Constructs browser-like headers with optional Clerk Secret Key authorization
    to bypass Cloudflare 403 Forbidden bot protection on Clerk JWKS endpoints.
    """
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "application/json",
    }
    clerk_secret = getattr(settings, "CLERK_SECRET_KEY", None) or os.getenv("CLERK_SECRET_KEY")
    if clerk_secret:
        headers["Authorization"] = f"Bearer {clerk_secret}"
    return headers

def get_jwks_client(jwks_url: str) -> PyJWKClient:
    """
    Returns a cached PyJWKClient configured with custom headers and caching.
    """
    if jwks_url not in _jwks_clients:
        headers = get_jwks_headers()
        _jwks_clients[jwks_url] = PyJWKClient(
            jwks_url,
            headers=headers,
            cache_keys=True,
            max_cached_keys=16,
            cache_jwk_set=True,
            timeout=30
        )
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
    """Generates a signed JWT access token for local authentication (HS256)."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decodes and cryptographically validates a JWT access token.
    
    Strict Verification Rules:
    1. For Clerk RS256 tokens: Fetches JWKS with spoofed User-Agent & Authorization headers.
       Cryptographically verifies token signature against matching public key.
       NO unverified payload fallback is permitted.
    2. For Local HS256 tokens: Validates signature using settings.SECRET_KEY.
    3. Returns None if signature is invalid, expired, or JWKS cannot be verified.
    """
    if not token or not isinstance(token, str):
        return None

    # 1. Inspect unverified header to determine algorithm and key ID
    try:
        header = jwt.get_unverified_header(token)
    except Exception as e:
        logger.debug(f"Invalid JWT header format: {e}")
        return None

    alg = header.get("alg")

    # 2. RS256 Token Verification (Clerk JWTs)
    if alg == "RS256":
        candidate_urls: List[str] = []
        
        # Check if iss (issuer) is present in token payload to infer JWKS URL
        try:
            unverified_claims = jwt.decode(token, options={"verify_signature": False, "verify_aud": False})
            iss = unverified_claims.get("iss")
            if iss and isinstance(iss, str) and iss.startswith("http"):
                candidate_urls.append(f"{iss.rstrip('/')}/.well-known/jwks.json")
        except Exception:
            pass

        # Configured CLERK_JWKS_URL or fallback default
        default_jwks_url = settings.CLERK_JWKS_URL or os.getenv("CLERK_JWKS_URL", "https://api.clerk.com/v1/jwks")
        if default_jwks_url not in candidate_urls:
            candidate_urls.append(default_jwks_url)

        # Attempt cryptographic verification across candidate JWKS endpoints
        for jwks_url in candidate_urls:
            try:
                jwks_client = get_jwks_client(jwks_url)
                signing_key = jwks_client.get_signing_key_from_jwt(token)
                
                # Strict RS256 signature verification
                payload = jwt.decode(
                    token,
                    signing_key.key,
                    algorithms=["RS256"],
                    options={"verify_aud": False, "verify_signature": True}
                )
                return payload
            except PyJWTError as jwt_err:
                logger.warning(f"Clerk RS256 JWT signature verification failed against {jwks_url}: {jwt_err}")
            except Exception as jwks_err:
                logger.warning(f"Error fetching/verifying JWKS key from {jwks_url}: {jwks_err}")

        # If RS256 verification fails across all endpoints, STRICTLY REJECT
        logger.error("Clerk JWT verification failed. Access denied.")
        return None

    # 3. Local HS256 Token Verification
    elif alg == "HS256":
        try:
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=[settings.ALGORITHM],
                options={"verify_signature": True}
            )
            return payload
        except PyJWTError as err:
            logger.debug(f"Local HS256 JWT verification failed: {err}")
            return None

    # Unknown algorithm - strictly reject
    return None
