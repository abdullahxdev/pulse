import React from 'react';
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'like':
        return <Heart size={20} className="text-red-500" />;
      case 'comment':
        return <MessageCircle size={20} className="text-neutral-400" />;
      case 'follow':
        return <UserPlus size={20} className="text-green-500" />;
      case 'mention':
        return <AtSign size={20} className="text-neutral-400" />;
      default:
        return <Heart size={20} className="text-neutral-400" />;
    }
  };

  const handleClick = () => {
    if (notification.is_read === 0 && onMarkAsRead) {
      onMarkAsRead(notification.notification_id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-4 bg-dark-card border rounded-lg mb-3 cursor-pointer hover:border-dark-hover hover:translate-x-1 transition-all relative ${
        notification.is_read === 0 ? 'border-l-[3px] border-l-neutral-50' : 'border-dark-border'
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-dark-border flex items-center justify-center flex-shrink-0">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-neutral-50 leading-relaxed mb-1">
          {notification.content}
        </p>
        <span className="text-xs text-neutral-500">{notification.created_at}</span>
      </div>

      {notification.is_read === 0 && (
        <div className="w-2 h-2 rounded-full bg-neutral-50 flex-shrink-0 mt-1"></div>
      )}
    </div>
  );
};

export default NotificationItem;
