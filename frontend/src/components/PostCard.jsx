import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import CommentSection from './CommentSection';

const PostCard = ({ post, onLike, onComment, onDelete, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    if (onLike) await onLike(post.post_id);
  };

  const handleCommentSubmit = async (commentText) => {
    if (onComment) await onComment(post.post_id, commentText);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.post_id);
    }
    setShowMenu(false);
  };

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border mb-4 hover:border-dark-hover transition-all animate-[fadeIn_0.3s_ease]">
      {/* Post Header */}
      <div className="flex justify-between items-center p-4 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-base">
            {post.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-semibold text-slate-50">
              {post.username}
            </h4>
            <span className="text-xs text-slate-500">{post.created_at}</span>
          </div>
        </div>
        
        {currentUser?.user_id === post.user_id && (
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-dark-border transition-colors"
            >
              <MoreHorizontal size={20} className="text-slate-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-dark-bg border border-dark-border rounded-lg p-2 min-w-[150px] z-10 shadow-xl">
                <button 
                  onClick={handleDelete} 
                  className="w-full px-3 py-2.5 text-left text-sm text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="p-4">
        <p className="text-sm text-slate-50 leading-relaxed mb-3 break-words">
          {post.text}
        </p>
        
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.hashtags.map((tag, index) => (
              <span 
                key={index} 
                className="text-[13px] font-medium text-primary hover:text-blue-400 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {post.media && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img src={post.media} alt="Post content" className="w-full h-auto block" />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-dark-border">
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            liked 
              ? 'text-red-500 hover:text-red-600' 
              : 'text-slate-400 hover:bg-dark-border hover:text-slate-50'
          }`}
        >
          <Heart size={20} fill={liked ? '#ef4444' : 'none'} />
          <span>{likesCount}</span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:bg-dark-border hover:text-slate-50 transition-all"
        >
          <MessageCircle size={20} />
          <span>{post.comments_count}</span>
        </button>
        
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-slate-400 hover:bg-dark-border hover:text-slate-50 transition-all">
          <Share2 size={20} />
          <span>Share</span>
        </button>
        
        <button className="ml-auto p-2 rounded-lg text-slate-400 hover:bg-dark-border hover:text-slate-50 transition-all">
          <Bookmark size={20} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection 
          postId={post.post_id}
          currentUser={currentUser}
          onCommentSubmit={handleCommentSubmit}
        />
      )}
    </div>
  );
};

export default PostCard;