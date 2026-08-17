"""
auth.py
JWT authentication for the Flask app — SQLite user store (users.db, created
on first run), bcrypt password hashing, 30-day access tokens.

Security note: a 30-day token has no refresh/rotation here — fine for a
hackathon prototype. For production, prefer a short-lived access token
(15-60 min) plus a rotating refresh token, or a server-side revocation list.
"""

import os
import sqlite3
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.getenv("AUTH_DB_PATH", os.path.join(BASE_DIR, "users.db"))
JWT_SECRET = os.getenv("JWT_SECRET_KEY", "")
JWT_ALGORITHM = "HS256"
SESSION_DAYS = 30


def _conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with _conn() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )
            """
        )


init_db()


def is_configured() -> bool:
    """True once JWT_SECRET_KEY is set in the environment (.env)."""
    return bool(JWT_SECRET)


def _hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def _verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_user(email: str, password: str) -> dict:
    email = email.strip().lower()
    password_hash = _hash_password(password)
    created_at = datetime.now(timezone.utc).isoformat()
    with _conn() as conn:
        try:
            cur = conn.execute(
                "INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)",
                (email, password_hash, created_at),
            )
        except sqlite3.IntegrityError:
            raise ValueError("An account with this email already exists.")
        return {"id": cur.lastrowid, "email": email, "created_at": created_at}


def authenticate_user(email: str, password: str) -> dict | None:
    email = email.strip().lower()
    with _conn() as conn:
        row = conn.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
    if row is None or not _verify_password(password, row["password_hash"]):
        return None
    return {"id": row["id"], "email": row["email"], "created_at": row["created_at"]}


def get_user_by_id(user_id: int) -> dict | None:
    with _conn() as conn:
        row = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    if row is None:
        return None
    return {"id": row["id"], "email": row["email"], "created_at": row["created_at"]}


def create_access_token(user_id: int) -> str:
    if not is_configured():
        raise RuntimeError("JWT_SECRET_KEY not set — add it to hackathon/.env")
    expire = datetime.now(timezone.utc) + timedelta(days=SESSION_DAYS)
    payload = {"sub": str(user_id), "exp": expire, "iat": datetime.now(timezone.utc)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Raises jwt.PyJWTError (expired, invalid signature, malformed) on failure."""
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
