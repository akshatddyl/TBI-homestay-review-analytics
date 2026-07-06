"""
models.py – SQLAlchemy ORM models for the Trishul Eco-Homestays platform.
"""

import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime

from database import Base


class Review(Base):
    """Represents a single guest review stored in PostgreSQL."""

    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    guest_name = Column(String(255), nullable=False)
    homestay_name = Column(String(255), nullable=False, index=True)
    original_review = Column(Text, nullable=False)
    original_language = Column(String(10), nullable=False)
    translated_review_en = Column(Text, nullable=True)
    ai_draft_response = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="pending")
    rating = Column(Integer, nullable=False)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.datetime.now(datetime.timezone.utc),
    )

    def __repr__(self) -> str:
        return f"<Review id={self.id} guest={self.guest_name!r} homestay={self.homestay_name!r}>"
