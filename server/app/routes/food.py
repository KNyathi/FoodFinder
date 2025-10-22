from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import httpx
import os
from typing import Dict, Any

router = APIRouter()

# ML service URL (could be environment variable)
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://localhost:8001")

@router.post("/recognize")
async def recognize_food(image: UploadFile = File(...)):
    """
    Upload food image and get recognition results from ML service
    """
    # Validate image
    if not image.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Send image to ML service
        async with httpx.AsyncClient() as client:
            files = {"image": (image.filename, await image.read(), image.content_type)}
            response = await client.post(f"{ML_SERVICE_URL}/predict", files=files)
            
            if response.status_code == 200:
                return JSONResponse(content=response.json())
            else:
                raise HTTPException(status_code=500, detail="ML service error")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recognition failed: {str(e)}")

@router.get("/dishes")
async def get_popular_dishes():
    """
    Get list of popular dishes (could be from database)
    """
    return {
        "dishes": [
            {"id": 1, "name": "Pizza", "category": "Italian"},
            {"id": 2, "name": "Burger", "category": "American"},
            {"id": 3, "name": "Sushi", "category": "Japanese"},
            {"id": 4, "name": "Tacos", "category": "Mexican"},
            {"id": 5, "name": "Pasta", "category": "Italian"},
        ]
    }