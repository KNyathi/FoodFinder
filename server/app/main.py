from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models.restaurant import Restaurant, RestaurantDish
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print(" Starting FoodFinder API...")

# Try to create tables, but don't crash if they already exist
try:
    print("🗄️ Checking database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables are ready!")
except Exception as e:
    print(f" Table creation note: {e}")

app = FastAPI(
    title="FoodFinder API",
    description="Backend API for food recognition and restaurant discovery",
    version="1.0.0"
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from app.routes import food, restaurants

app.include_router(food.router, prefix="/api/food", tags=["food"])
app.include_router(restaurants.router, prefix="/api/restaurants", tags=["restaurants"])

@app.get("/")
async def root():
    return {"message": "FoodFinder API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/debug/db-check")
async def debug_db_check():
    """Check database status"""
    from sqlalchemy import text
    from app.database import SessionLocal
    
    try:
        db = SessionLocal()
        
        # Check tables
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """))
        tables = [row[0] for row in result]
        
        # Count records
        restaurant_count = db.execute(text("SELECT COUNT(*) FROM restaurants")).scalar() if 'restaurants' in tables else 0
        dish_count = db.execute(text("SELECT COUNT(*) FROM restaurant_dishes")).scalar() if 'restaurant_dishes' in tables else 0
        
        db.close()
        
        return {
            "status": "connected",
            "tables": tables,
            "restaurant_count": restaurant_count,
            "dish_count": dish_count,
            "expected_tables": ["restaurants", "restaurant_dishes"],
            "all_tables_present": all(table in tables for table in ["restaurants", "restaurant_dishes"])
        }
    except Exception as e:
        return {"status": "error", "error": str(e)}