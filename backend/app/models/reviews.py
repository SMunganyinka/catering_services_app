from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, nullable=False) # 1 to 5 stars
    comment = Column(String(1000), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True) # One review per booking
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    # We use strings ("User", "Service") here to avoid importing them directly.
    # This prevents circular dependency errors.
    user = relationship("User", backref="reviews")
    service = relationship("Service", backref="reviews")
    booking = relationship("Booking", backref="review")