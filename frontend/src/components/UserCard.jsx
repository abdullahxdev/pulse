import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserCard = ({ user, onFollow }) => {
  const [isFollowing, setIsFollowing] = useState(user.is_following || user.isFollowing || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFollowing(user.is_following || user.isFollowing || false);
  }, [user.is_following, user.isFollowing, user.user_id]);

  const handleFollow = async () => {
    const prevFollowing = isFollowing;
    try {
      setLoading(true);
      setIsFollowing(!isFollowing);

      if (onFollow) {
        const result = await onFollow(user.user_id);
        if (result && result.success !== undefined) {
          setIsFollowing(result.is_following);
        }
      }
    } catch (error) {
      console.error('Error following user:', error);
      setIsFollowing(prevFollowing);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-dark-border last:border-0">
      <Link to={`/profile/${user.user_id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-medium text-sm flex-shrink-0">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-neutral-50 mb-0.5">
            {user.username}
          </h4>
          <p className="text-xs text-neutral-500 truncate">
            {user.profile_info || 'No bio yet'}
          </p>
        </div>
      </Link>

      <button
        onClick={handleFollow}
        disabled={loading}
        className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
          isFollowing
            ? 'bg-dark-hover text-neutral-300 hover:bg-dark-border'
            : 'bg-neutral-50 text-neutral-900 hover:bg-neutral-200'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default UserCard;
