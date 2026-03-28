from fastapi import FastAPI, Depends, HTTPException, Header, UploadFile, File, Form, status, BackgroundTasks # ADDED BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import date, timedelta

import shutil
import os
import stripe

# --- Imports ---
from app.database import Base, engine, get_db
# backend/app/main.py
from app.models import Review
from app.models import User, Service, Booking, UserRole, BookingStatus, Review # Add Review here
# We are using local endpoints now
from app.routes.inventory import router as inventory_router
from app.utils.security import hash_password, decode_access_token, verify_password, create_access_token
from app.schemas.booking import BookingResponse
# ADDED: Import Email Service Functions
from app.utils.email_service import send_booking_confirmation_email, send_new_booking_notification

# --- App Setup ---
app = FastAPI(title="Catering Services Booking App")

# --- DATABASE TABLE CREATION ---
@app.on_event("startup")
def on_startup():
    # This creates tables automatically if they don't exist
    # It runs after the app starts, ensuring the DB connection is ready
    Base.metadata.create_all(bind=engine)

# -------------------------
# 1. STRIPE CONFIGURATION
# -------------------------
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# -------------------------
# 2. SERVE STATIC FILES
# -------------------------
os.makedirs("static", exist_ok=True)
os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/avatars", exist_ok=True) 
app.mount("/static", StaticFiles(directory="static"), name="static")

# -------------------------
# 3. CORS Setup
# -------------------------
app.add_middleware(
    CORSMiddleware,
    # CHANGED: Replaced ["*"] with your specific frontend URL.
    # Browsers block "*" when allow_credentials=True.
    allow_origins=["http://localhost:5173", "https://catering-services-booking.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# INCLUDE ROUTERS
# -------------------------
app.include_router(inventory_router, prefix="/inventory", tags=["Inventory"])

# -------------------------
# 4. Pydantic Schemas
# -------------------------

class ServiceCreate(BaseModel):
    name: str
    description: str
    price_per_person: float

class BookingCreate(BaseModel):
    service_id: int
    event_date: date
    guests: int
    payment_method: str
    transaction_id: str
    location: str = ""       
    notes: str = ""         

class AdminCreateProvider(BaseModel):
    name: str
    email: str
    password: str
    business_name: str = ""

# --- NEW SCHEMA FOR STRIPE ---
class StripeCheckoutRequest(BaseModel):
    amount: float
    service_name: str
    booking_id: Optional[int] = None 
    success_url: Optional[str] = None 
    cancel_url: Optional[str] = None

class ReviewCreate(BaseModel):
    booking_id: int
    rating: int # Should be 1-5
    comment: str = ""

class ReviewResponse(BaseModel):
    id: int
    rating: int
    comment: str
    user_name: str
    created_at: str

    class Config:
        from_attributes = True

# ... imports

# --- NEW PROFILE SCHEMAS ---
class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    business_name: Optional[str] = None

class PasswordUpdate(BaseModel):
    old_password: str
    new_password: str
# -------------------------
# 5. AUTH UTILITIES (Dependency)
# -------------------------

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not authorization:
        raise credentials_exception

    try:
        scheme, token = authorization.split(" ")
        if scheme.lower() != "bearer":
            raise credentials_exception
    except ValueError:
        raise credentials_exception

    email = decode_access_token(token)

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# -------------------------
# 6. AUTH ENDPOINTS
# -------------------------

@app.post("/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm uses 'username' field, we map it to email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create Access Token
    # FIXED: Passing 'subject' as a positional argument to match your security.py
    access_token = create_access_token(user.email)
    
    # RETURN TOKEN AND USER DATA
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role.value
    }

@app.post("/auth/register")
def register(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    role: str = Form("CLIENT"), # Default to Client
    db: Session = Depends(get_db)
):
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(password)
    
    # Convert string role to Enum if necessary
    try:
        user_role = UserRole[role.upper()]
    except KeyError:
        user_role = UserRole.CLIENT

    new_user = User(
        name=name,
        email=email,
        password=hashed_pw,
        role=user_role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "email": new_user.email}

# -------------------------
# 7. STRIPE ENDPOINT
# -------------------------

@app.post("/create-checkout-session")
async def create_checkout_session(
    request: StripeCheckoutRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        success_url = request.success_url or "http://localhost:5173/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}"
        cancel_url = request.cancel_url or "http://localhost:5173/dashboard?payment=cancelled"

        metadata = {"user_id": str(current_user.id)}
        if request.booking_id:
            metadata["booking_id"] = str(request.booking_id)

        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": "rwf",
                        "product_data": {
                            "name": request.service_name,
                        },
                        "unit_amount": int(request.amount * 1),
                    },
                    "quantity": 1,
                }
            ],
            mode="payment",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata=metadata 
        )
        
        return {"url": checkout_session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -------------------------
# 8. Admin Endpoints
# -------------------------

@app.post("/admin/create-provider")
def create_provider(
    provider_data: AdminCreateProvider,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create providers")

    existing = db.query(User).filter(User.email == provider_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = hash_password(provider_data.password)
    new_user = User(
        name=provider_data.name,
        email=provider_data.email,
        password=hashed_pw,
        role=UserRole.PROVIDER
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "Provider created successfully", "email": new_user.email}

@app.get("/admin/users")
def list_all_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admins only")

    users = db.query(User).all()
    return [{"id": u.id, "name": u.name, "email": u.email, "role": u.role.value} for u in users]

# -------------------------
# 9. Other Endpoints
# -------------------------

@app.get("/auth/me", response_model=dict)
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role.value
    }

@app.post("/services/")
def create_service(
    name: str = Form(...),
    description: str = Form(...),
    price_per_person: float = Form(...),
    image: UploadFile = File(None), 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.PROVIDER:
        raise HTTPException(status_code=403, detail="Only providers can add services")

    image_url = None
    if image:
        file_location = f"static/uploads/{image.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(image.file, file_object)
        image_url = file_location

    service = Service(
        provider_id=current_user.id,
        name=name,
        description=description,
        price_per_person=price_per_person,
        image_url=image_url 
    )

    db.add(service)
    db.commit()
    db.refresh(service)

    return {
        "id": service.id,
        "name": service.name,
        "description": service.description,
        "price_per_person": service.price_per_person,
        "image_url": service.image_url
    }

@app.get("/services/", response_model=List[dict])
def list_services(
    db: Session = Depends(get_db),
    name: Optional[str] = None,
    description: Optional[str] = None
):
    query = db.query(Service)

    if name:
        query = query.filter(Service.name.ilike(f"%{name}%"))
    if description:
        query = query.filter(Service.description.ilike(f"%{description}%"))

    services = query.all()

    return [
        {
            "id": s.id,
            "name": s.name,
            "description": s.description,
            "price_per_person": s.price_per_person,
            "provider_id": s.provider_id,
            "image_url": s.image_url
        }
        for s in services
    ]

@app.delete("/services/{service_id}")
def delete_service(
    service_id: int,
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.PROVIDER:
        raise HTTPException(status_code=403, detail="Only providers can delete services")

    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    if service.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own services")

    db.delete(service)
    db.commit()
    
    return {"message": "Service deleted successfully"}

@app.put("/services/{service_id}")
def update_service(
    service_id: int,
    name: str = Form(...),
    description: str = Form(...),
    price_per_person: float = Form(...),
    image: UploadFile = File(None), 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.PROVIDER:
        raise HTTPException(status_code=403, detail="Only providers can update services")

    service = db.query(Service).filter(Service.id == service_id).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    if service.provider_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only update your own services")

    service.name = name
    service.description = description
    service.price_per_person = price_per_person

    if image:
        file_location = f"static/uploads/{image.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(image.file, file_object)
        service.image_url = file_location
    
    db.commit()
    db.refresh(service)

    return {
        "id": service.id,
        "name": service.name,
        "description": service.description,
        "price_per_person": service.price_per_person,
        "image_url": service.image_url
    }

# -------------------------
# UPDATED: CREATE BOOKING (Sends Email to Provider)
# -------------------------
@app.post("/bookings/", response_model=dict)
def create_booking(
    booking_data: BookingCreate,
    background_tasks: BackgroundTasks, # ADDED
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(status_code=403, detail="Only clients can book services")

    service = db.query(Service).filter(Service.id == booking_data.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    new_booking = Booking(
        user_id=current_user.id,
        service_id=booking_data.service_id,
        event_date=booking_data.event_date,
        guests=booking_data.guests,
        payment_method=booking_data.payment_method,
        transaction_id=booking_data.transaction_id,
        status=BookingStatus.pending,
        location=booking_data.location,
        notes=booking_data.notes
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # --- EMAIL LOGIC: Notify Provider ---
    provider = db.query(User).filter(User.id == service.provider_id).first()
    
    if provider and provider.email:
        send_new_booking_notification(
            background_tasks,
            provider_email=provider.email,
            client_name=current_user.name,
            service_name=service.name,
            event_date=str(booking_data.event_date),
            guests=booking_data.guests
        )

    return {
        "id": new_booking.id,
        "message": "Booking request submitted."
    }

@app.get("/bookings/", response_model=List[BookingResponse])
def list_bookings(
    status: Optional[BookingStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Booking)
    if status:
        query = query.filter(Booking.status == status)

    if current_user.role == UserRole.PROVIDER:
        my_service_ids = db.query(Service.id).filter(Service.provider_id == current_user.id).all()
        service_ids = [s_id[0] for s_id in my_service_ids]
        bookings = query.filter(Booking.service_id.in_(service_ids)).all()
    else:
        bookings = query.filter(Booking.user_id == current_user.id).all()

    return bookings

# -------------------------
# UPDATED: CONFIRM BOOKING (Sends Email to Client)
# -------------------------
@app.put("/bookings/{booking_id}/confirm", response_model=dict)
def confirm_booking(
    booking_id: int,
    background_tasks: BackgroundTasks, # ADDED
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != UserRole.PROVIDER:
        raise HTTPException(status_code=403, detail="Only providers can confirm bookings")

    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status == BookingStatus.confirmed:
         raise HTTPException(status_code=400, detail="Booking already confirmed")

    booking.status = BookingStatus.confirmed
    db.commit()

    # --- EMAIL LOGIC: Notify Client ---
    client = db.query(User).filter(User.id == booking.user_id).first()
    service = db.query(Service).filter(Service.id == booking.service_id).first()

    if client and service:
        send_booking_confirmation_email(
            background_tasks,
            to_email=client.email,
            client_name=client.name,
            service_name=service.name,
            event_date=str(booking.event_date)
        )

    return {"message": "Booking confirmed and email sent to user."}

# -------------------------
# 10. REVIEWS ENDPOINTS
# -------------------------

@app.post("/reviews/", response_model=dict)
def create_review(
    review_data: ReviewCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. User must be a client
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(status_code=403, detail="Only clients can leave reviews")

    # 2. Verify the booking exists and belongs to the user
    booking = db.query(Booking).filter(Booking.id == review_data.booking_id).first()
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # 3. Verify booking is confirmed (don't review pending/cancelled bookings)
    if booking.status != BookingStatus.confirmed:
        raise HTTPException(status_code=400, detail="You can only review confirmed bookings")

    # 4. Check if review already exists for this booking
    existing = db.query(Review).filter(Review.booking_id == review_data.booking_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="You have already reviewed this booking")

    # 5. Validate Rating
    if not 1 <= review_data.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # 6. Create Review
    new_review = Review(
        user_id=current_user.id,
        service_id=booking.service_id,
        booking_id=review_data.booking_id,
        rating=review_data.rating,
        comment=review_data.comment
    )

    db.add(new_review)
    db.commit()

    return {"message": "Review submitted successfully!"}

@app.get("/services/{service_id}/reviews", response_model=List[ReviewResponse])
def get_service_reviews(
    service_id: int,
    db: Session = Depends(get_db)
):
    reviews = db.query(Review).filter(Review.service_id == service_id).all()
    
    # Format the response to include user name
    response_data = []
    for r in reviews:
        response_data.append({
            "id": r.id,
            "rating": r.rating,
            "comment": r.comment,
            "user_name": r.user.name,
            "created_at": r.created_at.isoformat() if r.created_at else ""
        })
    
    return response_data
# -------------------------
# PROFILE & SETTINGS ENDPOINTS
# -------------------------

@app.get("/users/me", response_model=dict)
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "avatar_url": current_user.avatar_url,
        "role": current_user.role.value,
        "business_name": current_user.business_name
    }

@app.put("/users/me")
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.name:
        current_user.name = user_update.name
    if user_update.phone:
        current_user.phone = user_update.phone
    if user_update.business_name:
        current_user.business_name = user_update.business_name
    if user_update.avatar_url:
        current_user.avatar_url = user_update.avatar_url
    
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Profile updated successfully!",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "phone": current_user.phone,
            "avatar_url": current_user.avatar_url,
            "role": current_user.role.value
        }
    }

@app.put("/users/me/change-password")
def change_password(
    password_data: PasswordUpdate,
    current_user: User = Depends(get_current_user),
    db:   Session = Depends(get_db)
):
    # Verify old password
    if not verify_password(password_data.old_password, current_user.password):
            raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )

    # Update password
    current_user.password = hash_password(password_data.new_password)
    db.commit()

    return {"message": "Password changed successfully!"}

@app.post("/users/me/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Validate file type (images only)
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg", "image/gif"]:
        raise HTTPException(status_code=400, detail="File type not allowed")

    # 2. Delete old avatar if it exists
    if current_user.avatar_url:
        old_file_path = current_user.avatar_url
        if os.path.exists(old_file_path):
            os.remove(old_file_path)

    # 3. Save new file
    file_location = f"static/avatars/{file.filename}"
    with open(file_location, "wb+") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 4. Update user in DB
    current_user.avatar_url = file_location
    db.commit()

    return {"message": "Avatar uploaded successfully", "avatar_url": file_location}