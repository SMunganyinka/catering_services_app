from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class ItemCategory(str, enum.Enum):
    KITCHEN_EQUIPMENT = "KITCHEN_EQUIPMENT"
    DINNERWARE = "DINNERWARE"
    LINENS = "LINENS"
    DECORATIONS = "DECORATIONS"
    FOOD_STOCK = "FOOD_STOCK"
    BEVERAGES = "BEVERAGES"
    CONSUMABLES = "CONSUMABLES"
    AUDIO_VISUAL = "AUDIO_VISUAL"

class ItemCondition(str, enum.Enum):
    EXCELLENT = "EXCELLENT"
    GOOD = "GOOD"
    FAIR = "FAIR"
    NEEDS_REPAIR = "NEEDS_REPAIR"
    DISCARDED = "DISCARDED"

class InventoryItem(Base):
    __tablename__ = "inventory_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(Enum(ItemCategory), nullable=False)
    quantity = Column(Integer, default=0)
    unit = Column(String(20), nullable=True)  # e.g., "pieces", "sets", "kg"
    condition = Column(Enum(ItemCondition), default=ItemCondition.GOOD)
    location = Column(String(100), nullable=True)  # Storage location
    purchase_date = Column(Date, nullable=True)
    purchase_price = Column(Float, nullable=True)
    maintenance_notes = Column(Text, nullable=True)
    min_stock_alert = Column(Integer, default=0)  # Alert when below this
    is_available = Column(Integer, default=1)
    created_at = Column(Date, nullable=True)
    updated_at = Column(Date, nullable=True)

class EventStockAllocation(Base):
    __tablename__ = "event_stock_allocations"
    
    id = Column(Integer, primary_key=True, index=True)
    inventory_item_id = Column(Integer, ForeignKey("inventory_items.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    quantity_allocated = Column(Integer, nullable=False)
    quantity_returned = Column(Integer, default=0)
    status = Column(String(50), default="ALLOCATED")  # ALLOCATED, RETURNED, PARTIAL
    notes = Column(Text, nullable=True)
    allocated_at = Column(Date, nullable=True)
    returned_at = Column(Date, nullable=True)
    
    inventory_item = relationship("InventoryItem")
    booking = relationship("Booking")

class StockPurchase(Base):
    __tablename__ = "stock_purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(100), nullable=False)
    category = Column(Enum(ItemCategory), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    supplier_name = Column(String(100), nullable=True)
    supplier_contact = Column(String(100), nullable=True)
    purchase_date = Column(Date, nullable=True)
    receipt_url = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)

class WasteTracking(Base):
    __tablename__ = "waste_tracking"
    
    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    item_name = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), nullable=True)
    reason = Column(String(200), nullable=True)  # e.g., "Spoilage", "Damaged", "Leftover"
    recorded_by = Column(Integer, ForeignKey("users.id"))
    recorded_at = Column(Date, nullable=True)
    
    booking = relationship("Booking")
