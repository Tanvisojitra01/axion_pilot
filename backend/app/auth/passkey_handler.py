import json
import os
import secrets
import base64
import cbor2
from datetime import datetime, timedelta
from typing import Optional
import logging

from webauthn import (
    generate_registration_options,
    verify_registration_response,
    generate_authentication_options,
    verify_authentication_response,
    options_to_json,
)
from webauthn.helpers.structs import (
    AuthenticatorSelectionCriteria,
    ResidentKeyRequirement,
    UserVerificationRequirement,
)
from webauthn.helpers.base64url_to_bytes import base64url_to_bytes

logger = logging.getLogger(__name__)

# Get the origin from environment
ORIGIN = os.environ.get("PASSKEY_ORIGIN", "http://localhost:3000")
RP_ID = os.environ.get("PASSKEY_RP_ID", "localhost")
RP_NAME = os.environ.get("PASSKEY_RP_NAME", "Pilot App")


def generate_challenge() -> str:
    """Generate a random 32-byte challenge and encode as base64url."""
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode().rstrip("=")


def generate_passkey_registration_options(email: str, name: str):
    """Generate WebAuthn registration options for passkey creation."""
    try:
        options = generate_registration_options(
            rp_id=RP_ID,
            rp_name=RP_NAME,
            user_id=email.encode(),  # Use email as user ID
            user_name=email,
            user_display_name=name or email,
            authenticator_selection=AuthenticatorSelectionCriteria(
                # Allow both platform and external authenticators for flexibility
                resident_key=ResidentKeyRequirement.PREFERRED,  # Prefer but don't require
                user_verification=UserVerificationRequirement.PREFERRED,  # More flexible
            ),
            supported_alg_ids=[-7, -257],  # ES256 and RS256
        )
        return options_to_json(options)
    except Exception as e:
        logger.error(f"Error generating passkey registration options: {e}")
        raise


def verify_passkey_registration(email: str, credential: dict, challenge: str) -> dict:
    """Verify WebAuthn registration response and return credential details."""
    try:
        # The credential is already in the correct format (dict)
        # verify_registration_response expects the raw credential data
        verified_registration = verify_registration_response(
            credential=credential,
            expected_challenge=base64url_to_bytes(challenge),
            expected_origin=ORIGIN,
            expected_rp_id=RP_ID,
        )
        
        # Extract and properly encode public key COSE
        credential_public_key = verified_registration.credential_public_key
        
        # Store as base64-encoded CBOR (preserves COSE structure)
        public_key_b64 = base64.b64encode(credential_public_key).decode()
        
        return {
            "credential_id": base64.b64encode(verified_registration.credential_id).decode(),
            "public_key": public_key_b64,  # Base64-encoded COSE key
            "sign_count": verified_registration.sign_count,
            "aaguid": verified_registration.aaguid.hex() if verified_registration.aaguid else None,
        }
    except Exception as e:
        logger.error(f"Passkey registration verification failed: {e}")
        raise


def generate_passkey_authentication_options(email: str):
    """Generate WebAuthn authentication options for passkey login."""
    try:
        options = generate_authentication_options(
            rp_id=RP_ID,
            user_verification=UserVerificationRequirement.REQUIRED,
        )
        return options_to_json(options)
    except Exception as e:
        logger.error(f"Error generating passkey authentication options: {e}")
        raise


def verify_passkey_authentication(
    credential: dict,
    challenge: str,
    public_key_b64: str,
    sign_count: int,
) -> dict:
    """Verify WebAuthn authentication response."""
    try:
        # The credential is already in the correct format (dict)
        # Decode public key from base64 (COSE format preserved)
        public_key_bytes = base64.b64decode(public_key_b64)
        
        verified_auth = verify_authentication_response(
            credential=credential,
            expected_challenge=base64url_to_bytes(challenge),
            expected_origin=ORIGIN,
            expected_rp_id=RP_ID,
            credential_public_key=public_key_bytes,
            credential_current_sign_count=sign_count,
        )
        
        return {
            "new_sign_count": verified_auth.new_sign_count,
            "sign_count_valid": verified_auth.sign_count_valid,
        }
    except Exception as e:
        logger.error(f"Passkey authentication verification failed: {e}")
        raise
