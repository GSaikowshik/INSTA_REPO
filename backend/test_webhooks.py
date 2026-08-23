import sys
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

def test_clerk_webhook_full_lifecycle():
    with TestClient(app) as client:
        # 1. Test user.created
        created_payload = {
            "type": "user.created",
            "data": {
                "id": "user_clerk_test_9999",
                "email_addresses": [{"email_address": "sync_test_user@example.com"}],
                "first_name": "Clerk",
                "last_name": "SyncedUser"
            }
        }
        
        resp_create = client.post("/api/v1/webhooks/clerk", json=created_payload)
        print(f"user.created status: {resp_create.status_code}, json: {resp_create.json()}")
        assert resp_create.status_code == 200
        assert resp_create.json()["event"] == "user.created"

        # 2. Test user.updated
        updated_payload = {
            "type": "user.updated",
            "data": {
                "id": "user_clerk_test_9999",
                "email_addresses": [{"email_address": "sync_test_updated@example.com"}],
                "first_name": "ClerkUpdated",
                "last_name": "SyncedUser"
            }
        }
        resp_update = client.post("/api/v1/webhooks/clerk", json=updated_payload)
        print(f"user.updated status: {resp_update.status_code}, json: {resp_update.json()}")
        assert resp_update.status_code == 200
        assert resp_update.json()["event"] == "user.updated"

        # 3. Test user.deleted
        deleted_payload = {
            "type": "user.deleted",
            "data": {
                "id": "user_clerk_test_9999"
            }
        }
        resp_delete = client.post("/api/v1/webhooks/clerk", json=deleted_payload)
        print(f"user.deleted status: {resp_delete.status_code}, json: {resp_delete.json()}")
        assert resp_delete.status_code == 200
        assert resp_delete.json()["event"] == "user.deleted"

        # 4. Test invalid signature when CLERK_WEBHOOK_SIGNING_SECRET is configured
        original_secret = settings.CLERK_WEBHOOK_SIGNING_SECRET
        try:
            # Svix base64 signing secret format (dummy test key)
            settings.CLERK_WEBHOOK_SIGNING_SECRET = "whsec_dGVzdF9kdW1teV9zZWNyZXRfc2lnbmluZ19zZWNyZXRfa2V5"
            resp_invalid_sig = client.post(
                "/api/v1/webhooks/clerk",
                json=created_payload,
                headers={
                    "svix-id": "msg_fake_id",
                    "svix-timestamp": "1234567890",
                    "svix-signature": "v1,invalid_signature"
                }
            )
            print(f"invalid signature status: {resp_invalid_sig.status_code}, detail: {resp_invalid_sig.json()}")
            assert resp_invalid_sig.status_code == 400
        finally:
            settings.CLERK_WEBHOOK_SIGNING_SECRET = original_secret

if __name__ == "__main__":
    print("Running Clerk Webhook full lifecycle tests...")
    try:
        test_clerk_webhook_full_lifecycle()
        print("All Clerk Webhook tests passed successfully!")
    except Exception as e:
        print(f"Webhook lifecycle test failed: {e}")
        sys.exit(1)
