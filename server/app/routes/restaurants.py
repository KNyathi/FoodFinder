from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import httpx
import os

router = APIRouter()

# Yandex Maps API integration (example)
YANDEX_MAPS_API_KEY = os.getenv("YANDEX_MAPS_API_KEY")

@router.get("/search")
async def search_restaurants(
    dish: str = Query(..., description="Dish name to search for"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude"),
    radius: int = Query(5000, description="Search radius in meters")
):
    """
    Search restaurants by dish name and location
    """
    try:
        # This would integrate with Yandex Maps API or your restaurant database
        # For now, return mock data
        return {
            "dish": dish,
            "location": {"lat": lat, "lon": lon},
            "restaurants": [
                {
                    "id": 1,
                    "name": "Italian Bistro",
                    "address": "123 Main St",
                    "rating": 4.5,
                    "price_range": "$$",
                    "distance": "0.5 km",
                    "menu_link": "#"
                },
                {
                    "id": 2,
                    "name": "Pizza Palace",
                    "address": "456 Oak Ave",
                    "rating": 4.2,
                    "price_range": "$",
                    "distance": "0.8 km",
                    "menu_link": "#"
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")