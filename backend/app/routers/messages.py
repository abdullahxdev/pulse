from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from ..database import get_db
from ..models import Message, User
from ..schemas.message import MessageCreate, MessageResponse
from ..utils.dependencies import get_current_user

router = APIRouter()

def build_message_response(message: Message, db: Session) -> dict:
    """
    Helper function to build complete message response with user info.
    """
    sender = db.query(User).filter(User.user_id == message.sender_id).first()
    receiver = db.query(User).filter(User.user_id == message.receiver_id).first()
    
    return {
        "message_id": message.message_id,
        "sender_id": message.sender_id,
        "receiver_id": message.receiver_id,
        "content": message.content,
        "created_at": message.created_at,
        "is_read": message.is_read,
        "sender_username": sender.username if sender else None,
        "sender_profile_picture": sender.profile_picture if sender else None,
        "receiver_username": receiver.username if receiver else None,
        "receiver_profile_picture": receiver.profile_picture if receiver else None
    }

@router.post("/", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to another user.
    """
    # Check if receiver exists
    receiver = db.query(User).filter(User.user_id == message_data.receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver not found"
        )
    
    # Can't send message to self
    if message_data.receiver_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send message to yourself"
        )
    
    # Create message
    new_message = Message(
        sender_id=current_user.user_id,
        receiver_id=message_data.receiver_id,
        content=message_data.content,
        is_read=0
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return build_message_response(new_message, db)

@router.get("/conversations")
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get list of conversations (unique users the current user has messaged with).
    """
    # Get all users current user has sent or received messages from
    sent_to = db.query(Message.receiver_id).filter(
        Message.sender_id == current_user.user_id
    ).distinct().all()
    
    received_from = db.query(Message.sender_id).filter(
        Message.receiver_id == current_user.user_id
    ).distinct().all()
    
    # Combine and get unique user IDs
    user_ids = set([u[0] for u in sent_to] + [u[0] for u in received_from])
    
    # Get user details
    users = db.query(User).filter(User.user_id.in_(user_ids)).all()
    
    conversations = []
    for user in users:
        # Get last message with this user
        last_message = db.query(Message).filter(
            or_(
                and_(Message.sender_id == current_user.user_id, Message.receiver_id == user.user_id),
                and_(Message.sender_id == user.user_id, Message.receiver_id == current_user.user_id)
            )
        ).order_by(Message.created_at.desc()).first()
        
        # Count unread messages from this user
        unread_count = db.query(Message).filter(
            Message.sender_id == user.user_id,
            Message.receiver_id == current_user.user_id,
            Message.is_read == 0
        ).count()
        
        conversations.append({
            "user_id": user.user_id,
            "username": user.username,
            "profile_picture": user.profile_picture,
            "last_message": last_message.content if last_message else None,
            "last_message_time": last_message.created_at if last_message else None,
            "unread_count": unread_count
        })
    
    # Sort by last message time
    conversations.sort(key=lambda x: x["last_message_time"] or "", reverse=True)
    return conversations

@router.get("/conversation/{user_id}", response_model=List[MessageResponse])
def get_conversation_with_user(
    user_id: int,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all messages between current user and another user.
    """
    # Check if other user exists
    other_user = db.query(User).filter(User.user_id == user_id).first()
    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get messages
    messages = db.query(Message).filter(
        or_(
            and_(Message.sender_id == current_user.user_id, Message.receiver_id == user_id),
            and_(Message.sender_id == user_id, Message.receiver_id == current_user.user_id)
        )
    ).order_by(Message.created_at.asc()).offset(skip).limit(limit).all()
    
    # Mark received messages as read
    db.query(Message).filter(
        Message.sender_id == user_id,
        Message.receiver_id == current_user.user_id,
        Message.is_read == 0
    ).update({"is_read": 1})
    db.commit()
    
    return [build_message_response(msg, db) for msg in messages]

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(
    message_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a message (only by sender).
    """
    message = db.query(Message).filter(Message.message_id == message_id).first()
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    # Only sender can delete
    if message.sender_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this message"
        )
    
    db.delete(message)
    db.commit()
    return None

@router.get("/unread/count")
def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get count of unread messages for current user.
    """
    count = db.query(Message).filter(
        Message.receiver_id == current_user.user_id,
        Message.is_read == 0
    ).count()
    
    return {"unread_count": count}