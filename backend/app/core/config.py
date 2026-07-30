import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ArkiveX Document Intelligence"
    API_V1_STR: str = "/api/v1"

    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://jeoswprqdlcqsmebjvwv.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

    # Google OAuth Authentication
    GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/api/auth/callback/google")

    # Cloud Storage Bucket
    DEFAULT_STORAGE_BUCKET: str = "documents"

    class Config:
        case_sensitive = True

settings = Settings()
