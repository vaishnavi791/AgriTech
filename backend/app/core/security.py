"""Password hashing, JWT handling, and current-user authentication."""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pwdlib import PasswordHash

from app.core.config import settings
from app.services.user_service import get_user_by_id


password_hasher = PasswordHash.recommended()
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
	return password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
	return password_hasher.verify(password, password_hash)


def create_access_token(user_id: str) -> str:
	expires_at = datetime.now(timezone.utc) + timedelta(
		minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
	)
	claims: Dict[str, Any] = {"sub": user_id, "exp": expires_at}
	return jwt.encode(claims, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def _authentication_error(detail: str = "Invalid or expired authentication token") -> HTTPException:
	return HTTPException(
		status_code=status.HTTP_401_UNAUTHORIZED,
		detail=detail,
		headers={"WWW-Authenticate": "Bearer"},
	)


async def get_current_user(
	credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> Dict[str, Any]:
	if credentials is None or credentials.scheme.lower() != "bearer":
		raise _authentication_error("Authentication credentials were not provided")

	try:
		payload = jwt.decode(
			credentials.credentials,
			settings.JWT_SECRET_KEY,
			algorithms=[settings.JWT_ALGORITHM],
		)
		user_id = payload.get("sub")
		if not isinstance(user_id, str) or not user_id:
			raise _authentication_error()
	except JWTError as exc:
		raise _authentication_error() from exc

	user = await get_user_by_id(user_id)
	if user is None or user.get("is_active") is False:
		raise _authentication_error("Authenticated user was not found")
	return user

