"""Authentication request and response schemas."""

from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: Optional[str] = Field(default=None, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class AuthUserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None


class RegisterResponse(BaseModel):
    status: str = "registered"
    message: str = "User registered successfully"
    user: AuthUserResponse


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: AuthUserResponse


class UserMeResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: Optional[str] = None
