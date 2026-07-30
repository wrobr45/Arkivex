from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, LargeBinary
from sqlalchemy.sql import func
from app.db import Base

class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, index=True)
    subcategory = Column(String, nullable=True)
    user_email = Column(String, index=True, nullable=False, default="guest@arkivex.io")
    owner_id = Column(String, nullable=True)
    security_level = Column(String, default="Internal")
    storage_provider = Column(String, default="Supabase Cloud Storage")
    storage_path = Column(String, nullable=True)
    checksum_sha256 = Column(String, nullable=True)
    ai_summary = Column(Text, nullable=True)
    ocr_text = Column(Text, nullable=True)
    version = Column(String, default="v1.0")
    is_locked = Column(Boolean, default=False)
    security_pin = Column(String, default="1234")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CategoryModel(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    user_email = Column(String, index=True, nullable=False, default="system")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    role = Column(String, default="Owner")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    user_email = Column(String, index=True)
    action = Column(String)
    resource = Column(String)
    ip_address = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class BiometricCredentialModel(Base):
    __tablename__ = "user_biometrics"

    id = Column(String, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    credential_id = Column(String, unique=True, index=True, nullable=False)
    public_key = Column(Text, nullable=False)
    sign_count = Column(Integer, default=0)
    device_name = Column(String, default="TouchID / Windows Hello Sensor")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BiometricChallengeModel(Base):
    __tablename__ = "biometric_challenges"

    id = Column(String, primary_key=True, index=True)
    user_email = Column(String, index=True, nullable=False)
    challenge = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
