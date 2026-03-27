from sqlalchemy import Column, Integer, String, ForeignKey, Float # Import Float for price_per_person
from sqlalchemy.orm import relationship
from app.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    provider_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(100), nullable=False)
    
    # MATCH DATABASE SCHEMA
    # Your DB has 'description', not 'category'
    description = Column(String(255), nullable=True) 
    
    # MATCH DATABASE SCHEMA
    # Your DB has 'price_per_person' (float), not 'price' (int)
    price_per_person = Column(Float, nullable=True) 
    image_url = Column(String(255), nullable=True) 


    provider = relationship("User", back_populates="services")
    bookings = relationship("Booking", back_populates="service")