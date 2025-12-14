import React from 'react';
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    const iconClass = "text-slate-400";
    switch (notification.type) {
      case 'like':
        return <Heart size={20} className="text-red-500" />;
      case 'comment':
        return <MessageCircle size={20} className="text-primary" />;
      case 'follow':
        return <UserPlus size={20} className="text-green-500" />;
      case 'mention':
        return <AtSign size={20} className="text-purple-500" />;
      default:
        return <Heart size={20} className={iconClass} />;
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
        notification.is_read === 0 ? 'border-l-[3px] border-l-primary' : 'border-dark-border'
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-dark-border flex items-center justify-center flex-shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-50 leading-relaxed mb-1">
          {notification.content}
        </p>
        <span className="text-xs text-slate-500">{notification.created_at}</span>
      </div>

      {notification.is_read === 0 && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
      )}
    </div>
  );
};

export default NotificationItem;