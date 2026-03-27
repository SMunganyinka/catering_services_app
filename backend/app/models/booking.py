from sqlalchemy import Column, Integer, ForeignKey, Date, String, Text, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

# 1. Define the Enum
class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    guests = Column(Integer)
    event_date = Column(Date)
    
    # 2. Payment Fields (Existing)
    payment_method = Column(String(50))
    transaction_id = Column(String(255))
    
    # 3. Status: Use the Enum type instead of String for better type safety
    status = Column(Enum(BookingStatus), default=BookingStatus.pending)
    
    # 4. MISSING FIELDS: Add these to support the Client Dashboard form
    location = Column(String(255))   # For the event venue
    notes = Column(Text)              # For special requests
    
    # 5. Relationships
    user = relationship("User", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")