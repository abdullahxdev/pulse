import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';

const UserCard = ({ user, onFollow }) => {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setLoading(true);
      setIsFollowing(!isFollowing);
      if (onFollow) await onFollow(user.user_id);
    } catch (error) {
      console.error('Error following user:', error);
      setIsFollowing(isFollowing);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-dark-card border border-dark-border rounded-lg hover:border-dark-hover hover:-translate-y-0.5 transition-all mb-3">
      <Link to={`/profile/${user.user_id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-base flex-shrink-0">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-50 mb-1">
            {user.username}
          </h4>
          <p className="text-xs text-slate-400 truncate">
            {user.profile_info || 'No bio yet'}
          </p>
        </div>
      </Link>
      
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
          isFollowing 
            ? 'bg-dark-border text-slate-50 hover:bg-dark-hover' 
            : 'bg-primary text-white hover:bg-primary-hover'
        }`}
      >
        {isFollowing ? (
          <>
            <UserCheck size={16} />
            Following
          </>
        ) : (
          <>
            <UserPlus size={16} />
            Follow
          </>
        )}
      </button>
    </div>
  );
};

export default UserCard;