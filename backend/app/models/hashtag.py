from sqlalchemy import Column, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from ..database import Base

class Hashtag(Base):
    __tablename__ = "hashtags"
    
    tag_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tag_name = Column(String(50), unique=True, nullable=False, index=True)
    
    # Relationships
    post_hashtags = relationship("PostHashtag", back_populates="hashtag", cascade="all, delete-orphan")
    
    __table_args__ = (UniqueConstraint('tag_name', name='unique_hashtag_name'),)