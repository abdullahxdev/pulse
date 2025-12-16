from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from ..database import Base

class PostHashtag(Base):
    __tablename__ = "post_hashtags"
    
    post_hashtag_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey("posts.post_id", ondelete="CASCADE"), nullable=False, index=True)
    tag_id = Column(Integer, ForeignKey("hashtags.tag_id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Relationships
    post = relationship("Post", back_populates="post_hashtags")
    hashtag = relationship("Hashtag", back_populates="post_hashtags")
    
    # Ensure a post can only have a hashtag once
    __table_args__ = (UniqueConstraint('post_id', 'tag_id', name='unique_post_hashtag'),)