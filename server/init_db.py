from app.database import engine, Base
from app.models.restaurant import Restaurant, RestaurantDish
import asyncio

def init_database():
    """Initialize PostgreSQL database with tables"""
    print("🗄️ Creating database tables...")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Test the connection
        from sqlalchemy.orm import Session
        from app.database import SessionLocal
        
        db = SessionLocal()
        restaurant_count = db.query(Restaurant).count()
        print(f"📊 Current restaurants in database: {restaurant_count}")
        db.close()
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise

if __name__ == "__main__":
    init_database()