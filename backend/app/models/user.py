"""User database document model.

NOTE: This model represents the database document structure in the 'users' collection.
Password security rule: Plaintext passwords must NEVER be stored. The field 'password_hash'
holds a secure hash. Actual password hashing and authentication workflows belong to the
dedicated Auth prompt and are not implemented here.
"""
from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class UserDocument(BaseModel):
    id: Optional[str] = Field(default=None, description="Unique user document identifier (string ObjectId)")
    email: str = Field(..., description="Unique email address for user identification")
    password_hash: str = Field(..., description="Bcrypt-hashed password string (NEVER store plaintext passwords)")
    full_name: Optional[str] = Field(default=None, description="Full name of the user")
    is_active: bool = Field(default=True, description="Account active status flag")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp when the user account was created in UTC",
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp when the user account was last updated in UTC",
    )
