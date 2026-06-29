from fastapi import FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import datetime

app = FastAPI(title="Trishul Eco-Homestays Backend API")

# 1. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Exception Handling
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

# 2. Data Model & In-Memory Seed Data
class Review(BaseModel):
    id: int
    guest_name: str
    homestay_name: str
    original_review: str
    original_language: str
    translated_review_en: str
    ai_draft_response: str
    status: str  # "pending", "approved", "rejected"
    rating: int
    created_at: str

class ReviewCreate(BaseModel):
    guest_name: str
    homestay_name: str
    original_review: str
    original_language: str
    rating: int

class ReviewUpdate(BaseModel):
    ai_draft_response: Optional[str] = None
    status: Optional[str] = None

# Pre-seeded Database
REVIEWS_DATABASE: List[Review] = [
    Review(
        id=1,
        guest_name="Aarav Sharma",
        homestay_name="Pinecrest Retreat",
        original_review="जगह बहुत सुंदर है और कर्मचारी बहुत मददगार हैं। कमरे साफ थे।",
        original_language="hi",
        translated_review_en="The place is very beautiful and the staff is very helpful. Rooms were clean.",
        ai_draft_response="Dear Aarav, thank you so much for your kind words! We are thrilled to hear that you found our retreat beautiful and our staff helpful. We look forward to hosting you again.",
        status="pending",
        rating=5,
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat()
    ),
    Review(
        id=2,
        guest_name="Maria Gonzalez",
        homestay_name="Valley View Eco-Lodge",
        original_review="Me encantó la estancia. La comida era orgánica y deliciosa, pero el wifi era un poco lento en la noche.",
        original_language="es",
        translated_review_en="I loved the stay. The food was organic and delicious, but the wifi was a bit slow at night.",
        ai_draft_response="Dear Maria, thank you for your feedback! We're glad you enjoyed our organic food. We apologize for the slow WiFi during the night and are actively working on upgrading our network infrastructure.",
        status="approved",
        rating=4,
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat()
    ),
    Review(
        id=3,
        guest_name="John Doe",
        homestay_name="Pinecrest Retreat",
        original_review="Absolutely breathtaking views and sustainable practices. Highly recommend!",
        original_language="en",
        translated_review_en="Absolutely breathtaking views and sustainable practices. Highly recommend!",
        ai_draft_response="Hi John, thank you for the wonderful review! We pride ourselves on our sustainable practices and are so happy you enjoyed the views. See you next time!",
        status="pending",
        rating=5,
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat()
    ),
    Review(
        id=4,
        guest_name="Yuki Tanaka",
        homestay_name="Riverside Haven",
        original_review="景色は素晴らしいですが、シャワーのお湯が時々止まりました。",
        original_language="ja",
        translated_review_en="The scenery is wonderful, but the shower hot water stopped sometimes.",
        ai_draft_response="Dear Yuki, thank you for visiting us. We appreciate your compliment on the scenery. We sincerely apologize for the inconvenience caused by the hot water issue; our maintenance team has been notified to fix it immediately.",
        status="pending",
        rating=3,
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )
]

# Helper for ID generation
def get_next_id() -> int:
    if not REVIEWS_DATABASE:
        return 1
    return max(r.id for r in REVIEWS_DATABASE) + 1


# 3. REST Endpoints

@app.get("/api/reviews", response_model=List[Review], status_code=status.HTTP_200_OK)
async def get_all_reviews():
    """List all reviews."""
    return REVIEWS_DATABASE

@app.get("/api/reviews/search", response_model=List[Review], status_code=status.HTTP_200_OK)
async def search_reviews(homestay_name: Optional[str] = None, keyword: Optional[str] = None):
    """Search through reviews by homestay_name or keyword in the original_review."""
    results = REVIEWS_DATABASE
    if homestay_name:
        results = [r for r in results if r.homestay_name.lower() == homestay_name.lower()]
    if keyword:
        results = [r for r in results if keyword.lower() in r.original_review.lower()]
    return results

@app.get("/api/reviews/{review_id}", response_model=Review, status_code=status.HTTP_200_OK)
async def get_review(review_id: int):
    """Fetch a single review by ID."""
    review = next((r for r in REVIEWS_DATABASE if r.id == review_id), None)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review

@app.post("/api/reviews", response_model=Review, status_code=status.HTTP_201_CREATED)
async def create_review(review_in: ReviewCreate):
    """Simulate a newly uploaded review and generate mock translations/drafts."""
    new_review = Review(
        id=get_next_id(),
        guest_name=review_in.guest_name,
        homestay_name=review_in.homestay_name,
        original_review=review_in.original_review,
        original_language=review_in.original_language,
        translated_review_en=f"[MOCK TRANSLATION]: {review_in.original_review}",
        ai_draft_response=f"Dear {review_in.guest_name}, thank you for your feedback! This is a mock AI response.",
        status="pending",
        rating=review_in.rating,
        created_at=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )
    REVIEWS_DATABASE.append(new_review)
    return new_review

@app.put("/api/reviews/{review_id}", response_model=Review, status_code=status.HTTP_200_OK)
async def update_review(review_id: int, review_update: ReviewUpdate):
    """Update review fields (e.g., staff editing the AI response draft)."""
    review_idx = next((i for i, r in enumerate(REVIEWS_DATABASE) if r.id == review_id), None)
    if review_idx is None:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review = REVIEWS_DATABASE[review_idx]
    
    # Update fields if provided
    if review_update.ai_draft_response is not None:
        review.ai_draft_response = review_update.ai_draft_response
    if review_update.status is not None:
        review.status = review_update.status
        
    REVIEWS_DATABASE[review_idx] = review
    return review

@app.delete("/api/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(review_id: int):
    """Delete a review by ID."""
    review_idx = next((i for i, r in enumerate(REVIEWS_DATABASE) if r.id == review_id), None)
    if review_idx is None:
        raise HTTPException(status_code=404, detail="Review not found")
    
    REVIEWS_DATABASE.pop(review_idx)
    return None
