"""
schemas.py – Pydantic request/response schemas for the Review resource.
"""

import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ReviewCreate(BaseModel):
    """Payload for creating a new review."""

    guest_name: str
    homestay_name: str
    original_review: str
    original_language: str
    rating: int


class ReviewUpdate(BaseModel):
    """Payload for partially updating an existing review."""

    ai_draft_response: Optional[str] = None
    status: Optional[str] = None


class ReviewOut(BaseModel):
    """Schema returned to clients – serialises SQLAlchemy ORM objects."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    guest_name: str
    homestay_name: str
    original_review: str
    original_language: str
    translated_review_en: Optional[str] = None
    ai_draft_response: Optional[str] = None
    status: str
    rating: int
    created_at: datetime.datetime
