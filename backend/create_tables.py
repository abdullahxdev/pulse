from app.database import Base, engine
from app.models import *  # Import all models

try:
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")
    
    # Show created tables
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\n📋 Created {len(tables)} tables:")
    for table in tables:
        print(f"  - {table}")
        
except Exception as e:
    print(f"❌ Error creating tables: {e}")