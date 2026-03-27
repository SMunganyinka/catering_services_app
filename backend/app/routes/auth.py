from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.user import User
from app.utils.security import hash_password, verify_password, create_access_token

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(user: dict, db: Session = Depends(get_db)):
    # Check if user exists
    db_user = db.query(User).filter(User.email == user["email"]).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password
    hashed_pw = hash_password(user["password"])
    
    # Create new user
    # We handle the Enum conversion assuming role is passed as string
    from app.models.user import UserRole # Assuming UserRole Enum exists
    
    try:
        user_role = UserRole(user.get("role", "CLIENT"))
    except ValueError:
        user_role = UserRole.CLIENT

    new_user = User(
        name=user["name"],
        email=user["email"],
        password=hashed_pw,
        role=user_role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "User registered successfully", 
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role.value
        }
    }

@router.post("/login")
def login(user: dict, db: Session = Depends(get_db)):
    # 1. Find user
    db_user = db.query(User).filter(User.email == user["email"]).first()
    
    # 2. Verify credentials
    if not db_user or not verify_password(user["password"], db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # 3. Create Token
    token_data = {"sub": db_user.email, "role": db_user.role.value}
    token = create_access_token(db_user.email) 
    
    # 4. Return Token and User Data
    return {
        "access_token": token, 
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
            "role": db_user.role.value # Return string value, not the Enum object
        }
    }