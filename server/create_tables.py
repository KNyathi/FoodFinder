import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def create_tables_manual():
    DATABASE_URL = os.getenv("DATABASE_URL")
    print(f"Using DATABASE_URL: {DATABASE_URL}")
    
    if not DATABASE_URL:
        print("DATABASE_URL not found in .env file")
        return
    
    try:
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            print("Connected to database")
            
            # Enable UUID extension if not exists
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\""))
            print(" UUID extension enabled")
            
            # Create restaurants table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS restaurants (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    external_id VARCHAR(255),
                    name VARCHAR(255) NOT NULL,
                    address TEXT NOT NULL,
                    latitude FLOAT NOT NULL,
                    longitude FLOAT NOT NULL,
                    cuisine_type VARCHAR(100) DEFAULT 'Various',
                    phone_number VARCHAR(50) DEFAULT '',
                    opening_hours TEXT DEFAULT '',
                    rating FLOAT DEFAULT 4.0,
                    price_range VARCHAR(10) DEFAULT '$$',
                    source VARCHAR(50) DEFAULT 'yandex',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print(" Created 'restaurants' table")
            
            # Create restaurant_dishes table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS restaurant_dishes (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
                    dish_name VARCHAR(255) NOT NULL,
                    confidence_score FLOAT DEFAULT 0.8,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """))
            print(" Created 'restaurant_dishes' table")
            
            # Create indexes
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_restaurants_location ON restaurants(latitude, longitude)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine_type)"))
            conn.execute(text("CREATE INDEX IF NOT EXISTS idx_restaurant_dishes_name ON restaurant_dishes(dish_name)"))
            print("Created indexes")
            
            # Add some test data
            conn.execute(text("""
                INSERT INTO restaurants (name, address, latitude, longitude, cuisine_type, rating, price_range) 
                VALUES 
                ('Test Pizza Place', '123 Pizza Street, Moscow', 55.7558, 37.6173, 'Italian', 4.5, '$$'),
                ('Sushi Garden', '456 Sushi Avenue, Moscow', 55.7600, 37.6200, 'Japanese', 4.2, '$$$')
                ON CONFLICT DO NOTHING
            """))
            
            conn.execute(text("""
                INSERT INTO restaurant_dishes (restaurant_id, dish_name, confidence_score) 
                SELECT id, 'pizza', 0.9 FROM restaurants WHERE name = 'Test Pizza Place'
                ON CONFLICT DO NOTHING
            """))
            
            conn.execute(text("""
                INSERT INTO restaurant_dishes (restaurant_id, dish_name, confidence_score) 
                SELECT id, 'sushi', 0.95 FROM restaurants WHERE name = 'Sushi Garden'
                ON CONFLICT DO NOTHING
            """))
            
            conn.commit()
            print(" Added test data")
            
            # Verify tables were created
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                AND table_name IN ('restaurants', 'restaurant_dishes')
            """))
            
            tables = [row[0] for row in result]
            print(f" Tables in database: {tables}")
            
            if 'restaurants' in tables and 'restaurant_dishes' in tables:
                print(" SUCCESS: All tables created successfully!")
            else:
                print(" FAILED: Tables were not created")
                
    except Exception as e:
        print(f" Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    create_tables_manual()