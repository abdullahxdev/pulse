import React, { useState, useEffect } from 'react';
import { CheckCheck } from 'lucide-react';
import NotificationItem from '../components/NotificationItem';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n =>
        n.notification_id === notificationId
          ? { ...n, is_read: 1 }
          : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: 1 })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return n.is_read === 0;
    if (filter === 'read') return n.is_read === 1;
    return true;
  });

  const unreadCount = notifications.filter(n => n.is_read === 0).length;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
      <div className="max-w-[700px] mx-auto">

        {/* Header */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-4">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-[28px] font-bold text-neutral-50">Notifications</h1>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-border text-neutral-50 text-xs font-medium rounded-lg hover:bg-dark-hover transition-colors"
              >
                <CheckCheck size={16} />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 pt-4 border-t border-dark-border">
            {[
              { key: 'all', label: `All (${notifications.length})` },
              { key: 'unread', label: `Unread (${unreadCount})` },
              { key: 'read', label: `Read (${notifications.length - unreadCount})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
                  filter === tab.key
                    ? 'bg-neutral-50 text-neutral-900 border border-neutral-50'
                    : 'border border-dark-border text-neutral-400 hover:bg-dark-border hover:text-neutral-50 hover:border-dark-hover'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col">
          {filteredNotifications.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
              <h3 className="text-xl text-neutral-50 mb-2">No notifications</h3>
              <p className="text-neutral-400">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : filter === 'read'
                  ? 'No read notifications'
                  : 'You have no notifications yet'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <NotificationItem
                key={notification.notification_id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
