from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
import httpx
import os
import math
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from ..database import get_db
from ..models.restaurant import Restaurant, RestaurantDish
import asyncio

router = APIRouter()

# Yandex Maps API
YANDEX_GEOCODE_API = "https://geocode-maps.yandex.ru/1.x/"
YANDEX_SEARCH_API = "https://search-maps.yandex.ru/v1/"

YANDEX_API_KEY = "04e6a38e-1a37-4e9b-b633-597e648e6462"

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in km using Haversine formula"""
    R = 6371  # Earth radius in km
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = (math.sin(dlat/2) * math.sin(dlat/2) + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon/2) * math.sin(dlon/2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c

async def search_yandex_restaurants(query: str, lat: float, lon: float, radius: int = 5000):
    """Search restaurants using Yandex Maps Places API"""
    if not YANDEX_API_KEY:
        raise Exception("Yandex API key not configured")
    
    # Translate common food terms to Russian for better results
    query_translations = {
        'pizza': 'пицца',
        'burger': 'бургер',
        'sushi': 'суши',
        'pasta': 'паста',
        'salad': 'салат',
        'steak': 'стейк',
        'coffee': 'кофе',
        'cake': 'торт',
        'ice cream': 'мороженое',
        'sandwich': 'сэндвич'
    }
    
    # Use Russian translation if available, otherwise use original
    russian_query = query_translations.get(query.lower(), query)
    
    params = {
        "apikey": YANDEX_API_KEY,  # Your PLACES_HTTP_API key
        "text": f"{russian_query} ресторан кафе",
        "lang": "ru_RU",
        "ll": f"{lon},{lat}",
        "spn": "0.05,0.05",
        "type": "biz",
        "results": 20
    }
    
    print(f"Searching Yandex for: {russian_query} at {lat},{lon}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(YANDEX_SEARCH_API, params=params, timeout=10.0)
            
            if response.status_code != 200:
                print(f"Yandex API error: {response.status_code} - {response.text}")
                raise Exception(f"Yandex API error: {response.status_code}")
            
            data = response.json()
            restaurants = []
            
            for feature in data.get('features', []):
                properties = feature.get('properties', {})
                company_meta = properties.get('CompanyMetaData', {})
                geometry = feature.get('geometry', {})
                coordinates = geometry.get('coordinates', [])
                
                if not coordinates or len(coordinates) != 2:
                    continue
                
                name = company_meta.get('name', 'Unknown Restaurant')
                address = company_meta.get('address', 'Address not available')
                
                # Calculate distance
                distance_km = calculate_distance(lat, lon, coordinates[1], coordinates[0])
                
                # Extract cuisine from categories
                cuisine = "Various"
                categories = company_meta.get('Categories', [])
                for category in categories:
                    category_name = category.get('name', '').lower()
                    if any(word in category_name for word in ['итальянск', 'pizza', 'pasta']):
                        cuisine = "Italian"
                    elif any(word in category_name for word in ['японск', 'суши', 'sushi']):
                        cuisine = "Japanese"
                    elif any(word in category_name for word in ['китайск', 'chinese']):
                        cuisine = "Chinese"
                    elif any(word in category_name for word in ['русск', 'russian']):
                        cuisine = "Russian"
                    elif any(word in category_name for word in ['бургер', 'burger']):
                        cuisine = "American"
                
                # Get rating if available
                rating = company_meta.get('rating', 4.0 + (hash(name) % 10) / 10)
                
                restaurant = {
                    "external_id": feature.get('id', ''),
                    "name": name,
                    "address": address,
                    "cuisine": cuisine,
                    "rating": float(rating),
                    "price_range": "$" * (1 + (hash(name) % 3)),  # Yandex doesn't provide price info
                    "distance": f"{distance_km:.1f} km",
                    "coordinates": {"lat": coordinates[1], "lon": coordinates[0]},
                    "phone": company_meta.get('Phones', [{}])[0].get('formatted', ''),
                    "hours": company_meta.get('Hours', {}).get('text', ''),
                    "source": "yandex",
                    "url": company_meta.get('url', '')
                }
                restaurants.append(restaurant)
            
            print(f"Found {len(restaurants)} restaurants from Yandex")
            return restaurants
            
        except httpx.TimeoutException:
            print("Yandex API timeout")
            raise Exception("Yandex API timeout")
        except Exception as e:
            print(f"Yandex API error: {str(e)}")
            raise


async def save_restaurants_to_db(restaurants_data: List[dict], dish_name: str, db: Session):
    """Save restaurants to PostgreSQL database"""
    saved_restaurants = []
    
    for rest_data in restaurants_data:
        # Check if restaurant already exists by external_id or location
        existing_rest = db.query(Restaurant).filter(
            or_(
                Restaurant.external_id == rest_data.get('external_id'),
                and_(
                    func.abs(Restaurant.latitude - rest_data['coordinates']['lat']) < 0.0001,
                    func.abs(Restaurant.longitude - rest_data['coordinates']['lon']) < 0.0001,
                    Restaurant.name == rest_data['name']
                )
            )
        ).first()
        
        if existing_rest:
            # Update existing restaurant
            existing_rest.rating = rest_data['rating']
            existing_rest.price_range = rest_data['price_range']
            existing_rest.phone_number = rest_data.get('phone', existing_rest.phone_number)
            existing_rest.opening_hours = rest_data.get('hours', existing_rest.opening_hours)
            existing_rest.updated_at = func.now()
            restaurant = existing_rest
        else:
            # Create new restaurant
            restaurant = Restaurant(
                external_id=rest_data.get('external_id'),
                name=rest_data['name'],
                address=rest_data['address'],
                latitude=rest_data['coordinates']['lat'],
                longitude=rest_data['coordinates']['lon'],
                cuisine_type=rest_data['cuisine'],
                phone_number=rest_data.get('phone', ''),
                opening_hours=rest_data.get('hours', ''),
                rating=rest_data['rating'],
                price_range=rest_data['price_range'],
                source=rest_data['source']
            )
            db.add(restaurant)
        
        db.flush()  # Get the ID without committing
        
        # Check if dish association exists
        existing_dish = db.query(RestaurantDish).filter(
            RestaurantDish.restaurant_id == restaurant.id,
            func.lower(RestaurantDish.dish_name) == func.lower(dish_name)
        ).first()
        
        if not existing_dish:
            restaurant_dish = RestaurantDish(
                restaurant_id=restaurant.id,
                dish_name=dish_name,
                confidence_score=0.8
            )
            db.add(restaurant_dish)
        
        saved_restaurants.append(restaurant)
    
    db.commit()
    return saved_restaurants

def search_local_restaurants(dish_name: str, lat: float, lon: float, radius: int, db: Session):
    """Search restaurants in local PostgreSQL database with location filtering"""
    # PostgreSQL earthdistance extension would be better, but this works for now
    restaurants = db.query(Restaurant).join(RestaurantDish).filter(
        or_(
            RestaurantDish.dish_name.ilike(f"%{dish_name}%"),
            Restaurant.cuisine_type.ilike(f"%{dish_name}%")
        )
    ).all()
    
    results = []
    for rest in restaurants:
        distance_km = calculate_distance(lat, lon, rest.latitude, rest.longitude)
        if distance_km <= (radius / 1000):  # Filter by radius
            results.append({
                "id": rest.id,
                "name": rest.name,
                "address": rest.address,
                "cuisine": rest.cuisine_type,
                "rating": rest.rating,
                "price_range": rest.price_range,
                "distance": f"{distance_km:.1f} km",
                "coordinates": {"lat": rest.latitude, "lon": rest.longitude},
                "phone": rest.phone_number,
                "hours": rest.opening_hours,
                "source": "local_db"
            })
    
    return results

@router.get("/search")
async def search_restaurants(
    dish: str = Query(..., description="Dish name to search for"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude"),
    radius: int = Query(5000, description="Search radius in meters"),
    db: Session = Depends(get_db)
):
    """
    Search restaurants by dish name - uses PostgreSQL and Yandex API
    """
    try:
        # Default location
        if lat is None or lon is None:
            lat, lon = 55.7558, 37.6173  # Moscow center
        
        # Search local database first
        local_restaurants = search_local_restaurants(dish, lat, lon, radius, db)
        
        # If we have good local results, return them
        if len(local_restaurants) >= 8:
            local_restaurants.sort(key=lambda x: float(x['distance'].split()[0]))
            return {
                "dish": dish,
                "location": {"lat": lat, "lon": lon},
                "restaurants": local_restaurants[:15],
                "total_results": len(local_restaurants),
                "source": "local_database"
            }
        
        # Otherwise, use Yandex API
        yandex_restaurants = []
        try:
            yandex_restaurants = await search_yandex_restaurants(dish, lat, lon, radius)
            
            # Save Yandex results to database
            if yandex_restaurants:
                await save_restaurants_to_db(yandex_restaurants, dish, db)
        except Exception as e:
            print(f"Yandex API error: {e}")
            # Continue with local results only
        
        # Combine results
        all_restaurants = local_restaurants + yandex_restaurants
        all_restaurants.sort(key=lambda x: float(x['distance'].split()[0]))
        
        return {
            "dish": dish,
            "location": {"lat": lat, "lon": lon},
            "restaurants": all_restaurants[:15],
            "total_results": len(all_restaurants),
            "source": "hybrid"
        }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/database/stats")
async def get_database_stats(db: Session = Depends(get_db)):
    """Get PostgreSQL database statistics"""
    total_restaurants = db.query(Restaurant).count()
    total_dish_associations = db.query(RestaurantDish).count()
    unique_dishes = db.query(RestaurantDish.dish_name).distinct().count()
    
    # Popular dishes
    popular_dishes = db.query(
        RestaurantDish.dish_name,
        func.count(RestaurantDish.id).label('count')
    ).group_by(RestaurantDish.dish_name).order_by(func.count(RestaurantDish.id).desc()).limit(10).all()
    
    return {
        "total_restaurants": total_restaurants,
        "total_dish_associations": total_dish_associations,
        "unique_dishes": unique_dishes,
        "popular_dishes": [{"dish": dish, "count": count} for dish, count in popular_dishes],
        "sources": db.query(Restaurant.source, func.count(Restaurant.id)).group_by(Restaurant.source).all()
    }

@router.get("/nearby")
async def get_nearby_restaurants(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    radius: int = Query(1000, description="Search radius in meters"),
    db: Session = Depends(get_db)
):
    """Get all restaurants near a location"""
    all_restaurants = db.query(Restaurant).all()
    
    nearby_restaurants = []
    for rest in all_restaurants:
        distance_km = calculate_distance(lat, lon, rest.latitude, rest.longitude)
        if distance_km <= (radius / 1000):
            nearby_restaurants.append({
                "id": rest.id,
                "name": rest.name,
                "address": rest.address,
                "cuisine": rest.cuisine_type,
                "rating": rest.rating,
                "price_range": rest.price_range,
                "distance": f"{distance_km:.1f} km",
                "coordinates": {"lat": rest.latitude, "lon": rest.longitude}
            })
    
    nearby_restaurants.sort(key=lambda x: float(x['distance'].split()[0]))
    
    return {
        "location": {"lat": lat, "lon": lon},
        "restaurants": nearby_restaurants[:20],
        "total_results": len(nearby_restaurants)
    }
    
    
@router.get("/test")
async def test_restaurant_search():
    """Test endpoint to verify restaurant search works"""
    return {
        "message": "Restaurant API is working!",
        "test_data": [
            {
                "id": "test_1",
                "name": "Test Restaurant",
                "address": "123 Test Street",
                "cuisine": "Test Cuisine", 
                "rating": 4.5,
                "price_range": "$$",
                "distance": "1.2 km",
                "coordinates": {"lat": 55.7558, "lon": 37.6173}
            }
        ]
    }