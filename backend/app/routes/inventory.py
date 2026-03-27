from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date

from app.database import get_db
from app.models.inventory import InventoryItem, EventStockAllocation, StockPurchase, WasteTracking, ItemCategory, ItemCondition
from app.models.booking import Booking
from app.models.user import User

router = APIRouter()

# Inventory Items
@router.get("/")
def get_inventory(
    category: Optional[ItemCategory] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(InventoryItem)
    
    if category:
        query = query.filter(InventoryItem.category == category)
    if search:
        query = query.filter(InventoryItem.name.ilike(f"%{search}%"))
    
    return query.all()

@router.get("/low-stock")
def get_low_stock_alerts(db: Session = Depends(get_db)):
    return db.query(InventoryItem).filter(
        InventoryItem.quantity <= InventoryItem.min_stock_alert
    ).all()

@router.get("/{item_id}")
def get_inventory_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.post("/")
def create_inventory_item(
    item: dict,
    db: Session = Depends(get_db)
):
    new_item = InventoryItem(**item)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{item_id}")
def update_inventory_item(
    item_id: int,
    item_data: dict,
    db: Session = Depends(get_db)
):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    for key, value in item_data.items():
        setattr(item, key, value)
    
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_inventory_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(InventoryItem).filter(InventoryItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item deleted"}

# Event Stock Allocations
@router.get("/allocations/event/{booking_id}")
def get_event_allocations(booking_id: int, db: Session = Depends(get_db)):
    return db.query(EventStockAllocation).filter(
        EventStockAllocation.booking_id == booking_id
    ).all()

@router.post("/allocations/")
def allocate_stock(
    allocation: dict,
    db: Session = Depends(get_db)
):
    new_allocation = EventStockAllocation(**allocation)
    db.add(new_allocation)
    db.commit()
    db.refresh(new_allocation)
    return new_allocation

@router.put("/allocations/{allocation_id}/return")
def return_allocated_stock(
    allocation_id: int,
    quantity_returned: int,
    db: Session = Depends(get_db)
):
    allocation = db.query(EventStockAllocation).filter(
        EventStockAllocation.id == allocation_id
    ).first()
    
    if not allocation:
        raise HTTPException(status_code=404, detail="Allocation not found")
    
    allocation.quantity_returned = quantity_returned
    if quantity_returned >= allocation.quantity_allocated:
        allocation.status = "RETURNED"
    else:
        allocation.status = "PARTIAL"
    
    db.commit()
    db.refresh(allocation)
    return allocation

# Stock Purchases
@router.get("/purchases/")
def get_purchases(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(StockPurchase)
    
    if start_date:
        query = query.filter(StockPurchase.purchase_date >= start_date)
    if end_date:
        query = query.filter(StockPurchase.purchase_date <= end_date)
    
    return query.order_by(StockPurchase.purchase_date.desc()).all()

@router.post("/purchases/")
def create_purchase(purchase: dict, db: Session = Depends(get_db)):
    new_purchase = StockPurchase(**purchase)
    db.add(new_purchase)
    db.commit()
    db.refresh(new_purchase)
    return new_purchase

# Waste Tracking
@router.get("/waste/")
def get_waste_records(
    booking_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(WasteTracking)
    
    if booking_id:
        query = query.filter(WasteTracking.booking_id == booking_id)
    
    return query.all()

@router.post("/waste/")
def record_waste(waste: dict, db: Session = Depends(get_db)):
    new_waste = WasteTracking(**waste)
    db.add(new_waste)
    db.commit()
    db.refresh(new_waste)
    return new_waste

# Analytics
@router.get("/analytics/summary")
def get_inventory_summary(db: Session = Depends(get_db)):
    total_items = db.query(func.sum(InventoryItem.quantity)).scalar() or 0
    low_stock_count = db.query(func.count(InventoryItem.id)).filter(
        InventoryItem.quantity <= InventoryItem.min_stock_alert
    ).scalar()
    
    category_breakdown = db.query(
        InventoryItem.category,
        func.count(InventoryItem.id),
        func.sum(InventoryItem.quantity)
    ).group_by(InventoryItem.category).all()
    
    return {
        "total_items": total_items,
        "low_stock_count": low_stock_count,
        "by_category": [
            {"category": cat, "count": cnt, "quantity": qty} 
            for cat, cnt, qty in category_breakdown
        ]
    }
