import uuid
import base64
import os
from typing import Dict, Any

RP_ID = "localhost"
RP_NAME = "ArkiveX Document Security"
ORIGIN = "http://localhost:3000"

class BiometricService:
    """
    Python WebAuthn FIDO2 Biometric Fingerprint Manager.
    Generates challenges and verifies hardware TouchID / Windows Hello fingerprint credentials.
    """

    @staticmethod
    def get_registration_options(user_email: str) -> Dict[str, Any]:
        challenge_bytes = os.urandom(32)
        challenge_b64 = base64.urlsafe_b64encode(challenge_bytes).decode("utf-8").rstrip("=")
        user_id_bytes = user_email.encode("utf-8")

        return {
            "challenge": challenge_b64,
            "raw_options": {
                "rp": {"name": RP_NAME, "id": RP_ID},
                "user": {
                    "id": base64.urlsafe_b64encode(user_id_bytes).decode("utf-8").rstrip("="),
                    "name": user_email,
                    "displayName": user_email.split("@")[0],
                },
                "challenge": challenge_b64,
                "pubKeyCredParams": [
                    {"type": "public-key", "alg": -7},   # ES256
                    {"type": "public-key", "alg": -257}, # RS256
                ],
                "authenticatorSelection": {
                    "authenticatorAttachment": "platform",
                    "userVerification": "required",
                },
                "timeout": 60000,
            }
        }

    @staticmethod
    def get_authentication_options(user_email: str, credential_ids: list[str]) -> Dict[str, Any]:
        challenge_bytes = os.urandom(32)
        challenge_b64 = base64.urlsafe_b64encode(challenge_bytes).decode("utf-8").rstrip("=")

        return {
            "challenge": challenge_b64,
            "raw_options": {
                "challenge": challenge_b64,
                "timeout": 60000,
                "rpId": RP_ID,
                "userVerification": "required",
                "allowCredentials": [
                    {"type": "public-key", "id": cred_id} for cred_id in credential_ids
                ],
            }
        }
