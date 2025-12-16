from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Notification, User
from ..schemas.notification import NotificationResponse, NotificationUpdate
from ..utils.dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
def get_notifications(
    skip: int = 0,
    limit: int = 50,
    unread_only: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get notifications for current user.
    """
    query = db.query(Notification).filter(Notification.user_id == current_user.user_id)
    
    if unread_only:
        query = query.filter(Notification.is_read == 0)
    
    notifications = query.order_by(
        Notification.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return notifications

@router.get("/unread/count")
def get_unread_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get count of unread notifications for current user.
    """
    count = db.query(Notification).filter(
        Notification.user_id == current_user.user_id,
        Notification.is_read == 0
    ).count()
    
    return {"unread_count": count}

@router.put("/{notification_id}", response_model=NotificationResponse)
def mark_notification_read(
    notification_id: int,
    notification_data: NotificationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark a notification as read or unread.
    """
    notification = db.query(Notification).filter(
        Notification.notification_id == notification_id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    # Check ownership
    if notification.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this notification"
        )
    
    notification.is_read = notification_data.is_read
    db.commit()
    db.refresh(notification)
    return notification

@router.put("/mark-all-read", status_code=status.HTTP_200_OK)
def mark_all_read(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark all notifications as read for current user.
    """
    db.query(Notification).filter(
        Notification.user_id == current_user.user_id,
        Notification.is_read == 0
    ).update({"is_read": 1})
    db.commit()
    
    return {"message": "All notifications marked as read"}

@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a notification.
    """
    notification = db.query(Notification).filter(
        Notification.notification_id == notification_id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    # Check ownership
    if notification.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this notification"
        )
    
    db.delete(notification)
    db.commit()
    return None

@router.delete("/clear-all", status_code=status.HTTP_204_NO_CONTENT)
def clear_all_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete all notifications for current user.
    """
    db.query(Notification).filter(
        Notification.user_id == current_user.user_id
    ).delete()
    db.commit()
    return None