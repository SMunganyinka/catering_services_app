from pydantic import BaseModel, ConfigDict  # 1. Import ConfigDict
from datetime import date
from typing import Literal, Optional, List # Added List/Optional for clarity

class BookingBase(BaseModel):
    event_date: date
    guests: int
    payment_method: Literal['momo', 'bank', 'stripe']
    transaction_id: str

class BookingCreate(BookingBase):
    user_id: int
    service_id: int

class BookingResponse(BookingBase):
    id: int
    user_id: int
    service_id: int
    status: str
    location: Optional[str] = None
    notes: Optional[str] = None
    
    # 2. Update configuration for Pydantic V2
    model_config = ConfigDict(from_attributes=True)