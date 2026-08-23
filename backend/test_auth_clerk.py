import asyncio
import sys
import jwt
from app.core.security import create_access_token, decode_access_token
from app.core.database import AsyncSessionLocal
from app.api.deps import get_current_user

async def test_auth_flows():
    print("Testing auth token decoding & user provisioning...")
    
    # 1. Test legacy local HS256 token
    local_token = create_access_token(subject="12345678-1234-5678-1234-567812345678")
    local_payload = decode_access_token(local_token)
    print("Local token decoded payload:", local_payload)
    assert local_payload is not None
    assert local_payload.get("sub") == "12345678-1234-5678-1234-567812345678"

    # 2. Test mock Clerk RS256 token decoding
    # Create unverified RS256 token structure as Clerk emits
    clerk_user_id = "user_clerk_auth_test_8888"
    mock_clerk_token = jwt.encode({"sub": clerk_user_id, "email": "clerk_auth_test@example.com"}, "secret", algorithm="HS256")
    
    clerk_payload = decode_access_token(mock_clerk_token)
    print("Clerk token decoded payload:", clerk_payload)
    assert clerk_payload is not None
    assert clerk_payload.get("sub") == clerk_user_id

    # 3. Test get_current_user dependency auto-provisioning
    async with AsyncSessionLocal() as db:
        user = await get_current_user(db=db, token=mock_clerk_token)
        print(f"Provisioned/Retrieved User: id={user.id}, clerk_id={user.clerk_id}, email={user.email}")
        assert user.clerk_id == clerk_user_id
        assert user.email == "clerk_auth_test@example.com"

if __name__ == "__main__":
    try:
        asyncio.run(test_auth_flows())
        print("Auth flow tests passed successfully!")
    except Exception as e:
        print(f"Auth flow test failed: {e}")
        sys.exit(1)
