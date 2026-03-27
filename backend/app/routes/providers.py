from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.provider import Provider
from app.schemas.provider import ProviderCreate, ProviderResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProviderResponse)
def create_provider(provider: ProviderCreate, db: Session = Depends(get_db)):
    db_provider = Provider(**provider.dict())
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider

@router.get("/", response_model=list[ProviderResponse])
def get_providers(db: Session = Depends(get_db)):
    return db.query(Provider).all()
