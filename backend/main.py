"""
main.py – FastAPI application for the Trishul Eco-Homestays Review Analytics Platform.

Week 5: Real PostgreSQL integration via SQLAlchemy (replaces in-memory list).
"""

import datetime

from fastapi import FastAPI, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Optional

import models
from database import engine, get_db
from schemas import ReviewCreate, ReviewUpdate, ReviewOut

# ---------------------------------------------------------------------------
# App & middleware
# ---------------------------------------------------------------------------

app = FastAPI(title="Trishul Eco-Homestays Backend API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": True, "message": exc.detail},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": True, "message": "An unexpected server error occurred."},
    )


# ---------------------------------------------------------------------------
# Startup – create tables & seed initial data
# ---------------------------------------------------------------------------

@app.on_event("startup")
def on_startup():
    """Create all tables (if they don't already exist) and seed demo rows."""
    models.Base.metadata.create_all(bind=engine)
    _seed_demo_data()


def _seed_demo_data():
    """Insert demo reviews only when the table is empty (first run)."""
    from database import SessionLocal

    db = SessionLocal()
    try:
        if db.query(models.Review).count() > 0:
            return  # already seeded

        now = datetime.datetime.now(datetime.timezone.utc)
        seeds = [
            models.Review(
                guest_name="Aarav Sharma",
                homestay_name="Pinecrest Retreat",
                original_review="जगह बहुत सुंदर है और कर्मचारी बहुत मददगार हैं। कमरे साफ थे।",
                original_language="hi",
                translated_review_en="The place is very beautiful and the staff is very helpful. Rooms were clean.",
                ai_draft_response="Dear Aarav, thank you so much for your kind words! We are thrilled to hear that you found our retreat beautiful and our staff helpful. We look forward to hosting you again.",
                status="pending",
                rating=5,
                created_at=now,
            ),
            models.Review(
                guest_name="Maria Gonzalez",
                homestay_name="Valley View Eco-Lodge",
                original_review="Me encantó la estancia. La comida era orgánica y deliciosa, pero el wifi era un poco lento en la noche.",
                original_language="es",
                translated_review_en="I loved the stay. The food was organic and delicious, but the wifi was a bit slow at night.",
                ai_draft_response="Dear Maria, thank you for your feedback! We're glad you enjoyed our organic food. We apologize for the slow WiFi during the night and are actively working on upgrading our network infrastructure.",
                status="approved",
                rating=4,
                created_at=now,
            ),
            models.Review(
                guest_name="John Doe",
                homestay_name="Pinecrest Retreat",
                original_review="Absolutely breathtaking views and sustainable practices. Highly recommend!",
                original_language="en",
                translated_review_en="Absolutely breathtaking views and sustainable practices. Highly recommend!",
                ai_draft_response="Hi John, thank you for the wonderful review! We pride ourselves on our sustainable practices and are so happy you enjoyed the views. See you next time!",
                status="pending",
                rating=5,
                created_at=now,
            ),
            models.Review(
                guest_name="Yuki Tanaka",
                homestay_name="Riverside Haven",
                original_review="景色は素晴らしいですが、シャワーのお湯が時々止まりました。",
                original_language="ja",
                translated_review_en="The scenery is wonderful, but the shower hot water stopped sometimes.",
                ai_draft_response="Dear Yuki, thank you for visiting us. We appreciate your compliment on the scenery. We sincerely apologize for the inconvenience caused by the hot water issue; our maintenance team has been notified to fix it immediately.",
                status="pending",
                rating=3,
                created_at=now,
            ),
        ]
        db.add_all(seeds)
        db.commit()
    finally:
        db.close()


# ---------------------------------------------------------------------------
# REST Endpoints – real PostgreSQL CRUD via SQLAlchemy
# ---------------------------------------------------------------------------

@app.get("/api/reviews", response_model=List[ReviewOut], status_code=status.HTTP_200_OK)
async def get_all_reviews(db: Session = Depends(get_db)):
    """List all reviews from the database."""
    return db.query(models.Review).order_by(models.Review.created_at.desc()).all()


@app.get("/api/reviews/search", response_model=List[ReviewOut], status_code=status.HTTP_200_OK)
async def search_reviews(
    homestay_name: Optional[str] = None,
    keyword: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Search reviews by homestay name (exact, case-insensitive) and/or keyword
    in the original review text (partial, case-insensitive)."""
    query = db.query(models.Review)

    if homestay_name:
        query = query.filter(models.Review.homestay_name.ilike(homestay_name))

    if keyword:
        query = query.filter(models.Review.original_review.ilike(f"%{keyword}%"))

    return query.order_by(models.Review.created_at.desc()).all()


@app.get("/api/reviews/{review_id}", response_model=ReviewOut, status_code=status.HTTP_200_OK)
async def get_review(review_id: int, db: Session = Depends(get_db)):
    """Fetch a single review by ID."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@app.post("/api/reviews", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def create_review(review_in: ReviewCreate, db: Session = Depends(get_db)):
    """Create a new review with mock translation and AI draft response."""
    new_review = models.Review(
        guest_name=review_in.guest_name,
        homestay_name=review_in.homestay_name,
        original_review=review_in.original_review,
        original_language=review_in.original_language,
        translated_review_en=f"[MOCK TRANSLATION]: {review_in.original_review}",
        ai_draft_response=f"Dear {review_in.guest_name}, thank you for your feedback! This is a mock AI response.",
        status="pending",
        rating=review_in.rating,
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review


@app.put("/api/reviews/{review_id}", response_model=ReviewOut, status_code=status.HTTP_200_OK)
async def update_review(review_id: int, review_update: ReviewUpdate, db: Session = Depends(get_db)):
    """Partially update a review (e.g., staff editing the AI response draft or
    changing the status to approved/rejected)."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    if review_update.ai_draft_response is not None:
        review.ai_draft_response = review_update.ai_draft_response
    if review_update.status is not None:
        review.status = review_update.status

    db.commit()
    db.refresh(review)
    return review


@app.delete("/api/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(review_id: int, db: Session = Depends(get_db)):
    """Delete a review by ID."""
    review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    db.delete(review)
    db.commit()
    return None
