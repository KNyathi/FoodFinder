from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import httpx
import os
from typing import Dict, Any
import logging

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()

# ML service URL (could be environment variable)
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://localhost:8001")

@router.post("/recognize")
async def recognize_food(image: UploadFile = File(...)):
    """
    Upload food image and get recognition results from ML service
    """
    logger.info(f"Received recognition request for file: {image.filename}")
    
    # Validate image
    if not image.content_type.startswith('image/'):
        logger.error(f"Invalid file type: {image.content_type}")
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read the image data first
        image_data = await image.read()
        logger.info(f"Image size: {len(image_data)} bytes")
        
        if len(image_data) == 0:
            raise HTTPException(status_code=400, detail="Empty image file")
        
        # Reset file pointer for sending
        files = {"image": (image.filename, image_data, image.content_type)}
        
        # Send image to ML service
        async with httpx.AsyncClient(timeout=30.0) as client:
            logger.info(f"Sending request to ML service: {ML_SERVICE_URL}/predict")
            
            response = await client.post(
                f"{ML_SERVICE_URL}/predict", 
                files=files,
                params={"top_k": 5}  
            )
            
            logger.info(f"ML service response status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"Recognition successful: {result.get('message', 'No message')}")
                return JSONResponse(content=result)
            else:
                error_detail = f"ML service error: {response.status_code} - {response.text}"
                logger.error(error_detail)
                raise HTTPException(status_code=500, detail=error_detail)
                
    except httpx.ConnectError:
        error_msg = f"Cannot connect to ML service at {ML_SERVICE_URL}. Make sure it's running."
        logger.error(error_msg)
        raise HTTPException(status_code=503, detail=error_msg)
    except httpx.TimeoutException:
        error_msg = "ML service timeout. The request took too long."
        logger.error(error_msg)
        raise HTTPException(status_code=504, detail=error_msg)
    except Exception as e:
        error_msg = f"Recognition failed: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@router.get("/dishes")
async def get_popular_dishes():
    """
    Get list of popular dishes (could be from database)
    """
    logger.info("Fetching popular dishes")
    return {
        "dishes": [
            {"id": 1, "name": "Pizza", "category": "Italian"},
            {"id": 2, "name": "Burger", "category": "American"},
            {"id": 3, "name": "Sushi", "category": "Japanese"},
            {"id": 4, "name": "Tacos", "category": "Mexican"},
            {"id": 5, "name": "Pasta", "category": "Italian"},
        ]
    }

@router.get("/health")
async def health_check():
    """Health check endpoint that also checks ML service"""
    try:
        async with httpx.AsyncClient() as client:
            ml_health = await client.get(f"{ML_SERVICE_URL}/health")
            ml_status = ml_health.json() if ml_health.status_code == 200 else {"status": "unreachable"}
        
        return {
            "api_status": "healthy",
            "ml_service_status": ml_status,
            "ml_service_url": ML_SERVICE_URL
        }
    except Exception as e:
        return {
            "api_status": "healthy", 
            "ml_service_status": {"status": "unreachable", "error": str(e)},
            "ml_service_url": ML_SERVICE_URL
        }