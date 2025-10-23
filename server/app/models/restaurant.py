from sqlalchemy import Column, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Restaurant(Base):
    __tablename__ = "restaurants"
    
    # Match the manual table structure exactly
    id = Column(String, primary_key=True)  # UUID as string
    external_id = Column(String, unique=True, nullable=True)
    name = Column(String(255), nullable=False)
    address = Column(Text, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    cuisine_type = Column(String(100), default="Various")
    phone_number = Column(String(50), default="")
    opening_hours = Column(Text, default="")
    rating = Column(Float, default=4.0)
    price_range = Column(String(10), default="$$")
    source = Column(String(50), default="yandex")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    dishes = relationship("RestaurantDish", back_populates="restaurant")

class RestaurantDish(Base):
    __tablename__ = "restaurant_dishes"
    
    id = Column(String, primary_key=True)  # UUID as string
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False)
    dish_name = Column(String(255), nullable=False)
    confidence_score = Column(Float, default=0.8)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    restaurant = relationship("Restaurant", back_populates="dishes")