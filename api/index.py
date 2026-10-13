import logging
import os
from datetime import date, datetime
from typing import Any, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, Field
from supabase import Client, create_client

logger = logging.getLogger("pacific_bank")

app = FastAPI(title="Pacific Bank API")

security = HTTPBearer(auto_error=False)


def _require_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def get_anon_client() -> Client:
    return create_client(
        _require_env("SUPABASE_URL"),
        _require_env("SUPABASE_ANON_KEY"),
    )


def get_service_client() -> Client:
    return create_client(
        _require_env("SUPABASE_URL"),
        _require_env("SUPABASE_SERVICE_KEY"),
    )


class LoginRequest(BaseModel):
    email: str
    password: str


class ApplicationRequest(BaseModel):
    full_name: str
    date_of_birth: str
    address: str
    employer: str
    job_title: str
    annual_income: float = Field(gt=0)
    loan_amount: float = Field(gt=0)
    loan_purpose: str


def get_authenticated_email(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> str:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = credentials.credentials
    try:
        response = get_anon_client().auth.get_user(token)
        user = response.user
        if user is None or not user.email:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return user.email
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(
            "Token verification failed: %s",
            type(exc).__name__,
        )
        raise HTTPException(status_code=401, detail="Invalid or expired token") from None


def _sign_in_and_return(email: str, password: str) -> dict[str, str]:
    try:
        result = get_anon_client().auth.sign_in_with_password(
            {"email": email, "password": password}
        )
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if result.session is None or result.user is None or not result.user.email:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "access_token": result.session.access_token,
        "email": result.user.email,
    }


def _is_existing_user_error(exc: Exception) -> bool:
    message = str(exc).lower()
    markers = (
        "already been registered",
        "already registered",
        "user already exists",
        "email address has already been registered",
        "duplicate",
    )
    return any(marker in message for marker in markers)


def _validate_date_of_birth(value: str) -> None:
    raw = value.strip()
    try:
        dob = datetime.strptime(raw, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid date of birth in YYYY-MM-DD format.",
        ) from None

    if dob.isoformat() != raw:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid date of birth in YYYY-MM-DD format.",
        )

    today = date.today()

    if dob > today:
        raise HTTPException(
            status_code=400,
            detail="Date of birth cannot be in the future.",
        )

    age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
    if age < 18:
        raise HTTPException(
            status_code=400,
            detail="You must be at least 18 years old to apply.",
        )


@app.post("/api/signup")
def signup(body: LoginRequest) -> dict[str, str]:
    email = body.email.strip()
    password = body.password

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters",
        )

    try:
        get_service_client().auth.admin.create_user(
            {
                "email": email,
                "password": password,
                "email_confirm": True,
            }
        )
    except Exception as exc:
        if _is_existing_user_error(exc):
            raise HTTPException(
                status_code=409,
                detail="An account with this email already exists",
            ) from None
        logger.error("Signup failed: %s", type(exc).__name__)
        raise HTTPException(
            status_code=400,
            detail="Unable to create account. Please try again.",
        ) from None

    return _sign_in_and_return(email, password)


@app.post("/api/login")
def login(body: LoginRequest) -> dict[str, str]:
    email = body.email.strip()
    password = body.password

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    return _sign_in_and_return(email, password)


@app.post("/api/applications")
def create_application(
    body: ApplicationRequest,
    email: str = Depends(get_authenticated_email),
) -> dict[str, Any]:
    _validate_date_of_birth(body.date_of_birth)

    payload = {
        "email": email,
        "full_name": body.full_name.strip(),
        "date_of_birth": body.date_of_birth,
        "address": body.address.strip(),
        "employer": body.employer.strip(),
        "job_title": body.job_title.strip(),
        "annual_income": body.annual_income,
        "loan_amount": body.loan_amount,
        "loan_purpose": body.loan_purpose.strip(),
    }

    try:
        result = (
            get_service_client()
            .table("applications")
            .insert(payload)
            .execute()
        )
    except Exception as exc:
        logger.error(
            "Could not save application: %s: %s",
            type(exc).__name__,
            exc,
        )
        raise HTTPException(
            status_code=500,
            detail="Could not save your application. Please try again.",
        ) from None

    if not result.data:
        logger.error("Application insert returned no data")
        raise HTTPException(
            status_code=500,
            detail="Could not save your application. Please try again.",
        )

    return result.data[0]


@app.get("/api/applications")
def list_applications(
    email: str = Depends(get_authenticated_email),
) -> list[dict[str, Any]]:
    try:
        result = (
            get_service_client()
            .table("applications")
            .select("*")
            .eq("email", email)
            .order("created_at", desc=True)
            .execute()
        )
    except Exception as exc:
        logger.error(
            "Could not load applications: %s: %s",
            type(exc).__name__,
            exc,
        )
        raise HTTPException(
            status_code=500,
            detail="Could not load your applications. Please try again.",
        ) from None

    return result.data or []
