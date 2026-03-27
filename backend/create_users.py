# backend/create_users.py
from app.database import SessionLocal
from app.models import User, UserRole
from app.utils.security import hash_password

def create_demo_users():
    db = SessionLocal()
    try:
        # 1. Create Admin
        if not db.query(User).filter(User.email == "admin@catering.com").first():
            admin = User(
                name="System Admin",
                email="admin@catering.com",
                password=hash_password("admin123"),
                role=UserRole.ADMIN
            )
            db.add(admin)
            print("✅ Admin created (admin@catering.com / admin123)")
        
        # 2. Create Demo Provider (Optional, so you have one to test immediately)
        if not db.query(User).filter(User.email == "provider@catering.com").first():
            provider = User(
                name="Sarah Provider",
                email="provider@catering.com",
                password=hash_password("provider123"),
                role=UserRole.PROVIDER
            )
            db.add(provider)
            print("✅ Demo Provider created (provider@catering.com / provider123)")

        db.commit()
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_demo_users()