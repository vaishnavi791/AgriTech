"""Authentication workflows built on the user persistence service."""

from typing import Any, Dict

from app.core.security import create_access_token, hash_password, verify_password
from app.services.user_service import create_user, get_user_by_email


class DuplicateAccountError(Exception):
	"""Raised when an account already exists for an email address."""


class InvalidCredentialsError(Exception):
	"""Raised when login credentials do not match an active account."""


def public_user(user: Dict[str, Any]) -> Dict[str, Any]:
	return {
		"id": user["id"],
		"email": user["email"],
		"full_name": user.get("full_name"),
	}


async def register_user(email: str, password: str, full_name: str | None) -> Dict[str, Any]:
	if await get_user_by_email(email):
		raise DuplicateAccountError

	user = await create_user(
		{
			"email": email,
			"password_hash": hash_password(password),
			"full_name": full_name,
		}
	)
	return public_user(user)


async def authenticate_user(email: str, password: str) -> Dict[str, Any]:
	user = await get_user_by_email(email)
	if (
		user is None
		or user.get("is_active") is False
		or not verify_password(password, user.get("password_hash", ""))
	):
		raise InvalidCredentialsError
	return user


def issue_access_token(user: Dict[str, Any]) -> str:
	return create_access_token(user["id"])

