from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class UserRole(str, enum.Enum):
    CLIENT = "CLIENT"
    PROVIDER = "PROVIDER"
    ADMIN = "ADMIN"
    TEAM_LEAD = "TEAM_LEAD"
    STOCK_MANAGER = "STOCK_MANAGER"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    business_name = Column(String(100), nullable=True)
    phone = Column(String(20), nullable=True)
    avatar_url = Column(String(255), nullable=True)
    is_active = Column(Integer, default=1)
    
    bookings = relationship("Booking", back_populates="user")
    services = relationship("Service", back_populates="provider")
