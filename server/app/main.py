from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import food, restaurants

app = FastAPI(
    title="FoodFinder API",
    description="Backend API for food recognition and restaurant discovery",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(food.router, prefix="/api/food", tags=["food"])
app.include_router(restaurants.router, prefix="/api/restaurants", tags=["restaurants"])

@app.get("/")
async def root():
    return {"message": "FoodFinder API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}