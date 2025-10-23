from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import urllib.parse

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")


# Fix common URL issues
def fix_database_url(url):
    # Ensure it starts with postgresql:// not postgres://
    if url.startswith('postgres://'):
        url = url.replace('postgres://', 'postgresql://', 1)
    
    # If it doesn't have the proper scheme, add it
    if not url.startswith('postgresql://'):
        # Try to parse and reconstruct
        try:
            # If it's in format user:pass@host:port/db
            if '@' in url and ':' in url.split('@')[0]:
                url = f"postgresql://{url}"
        except:
            pass
    
    return url

DATABASE_URL = fix_database_url(DATABASE_URL)

try:
    engine = create_engine(DATABASE_URL)

    # Test the connection
    with engine.connect() as conn:
        print("Database connection test successful!")
        
except Exception as e:
    print(f" Database connection failed: {e}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
