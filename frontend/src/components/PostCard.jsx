import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react';
import CommentSection from './CommentSection';

const API_BASE_URL = 'http://localhost:8000';

const PostCard = ({ post, onLike, onComment, onDelete, onSave, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(post.is_liked || false);
  const [saved, setSaved] = useState(post.is_saved || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setLiked(post.is_liked || false);
    setSaved(post.is_saved || false);
    setLikesCount(post.likes_count || 0);
    setCommentsCount(post.comments_count || 0);
  }, [post.is_liked, post.is_saved, post.likes_count, post.comments_count]);

  const handleLike = async () => {
    const prevLiked = liked;
    const prevCount = likesCount;

    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      if (onLike) {
        const result = await onLike(post.post_id);
        if (result && result.success !== undefined) {
          setLiked(result.is_liked);
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleCommentSubmit = async (commentText) => {
    try {
      if (onComment) {
        const result = await onComment(post.post_id, commentText);
        if (result && result.success) {
          setCommentsCount(commentsCount + 1);
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.post_id);
    }
    setShowMenu(false);
  };

  const handleSave = async () => {
    const prevSaved = saved;
    setSaved(!saved);

    try {
      if (onSave) {
        const result = await onSave(post.post_id);
        if (result && result.success !== undefined) {
          setSaved(result.is_saved);
        }
      }
    } catch (error) {
      console.error('Error saving post:', error);
      setSaved(prevSaved);
    }
  };

  return (
    <div className="bg-dark-card rounded-xl border border-dark-border mb-4 hover:border-dark-hover transition-all">
      {/* Post Header */}
      <div className="flex justify-between items-center p-4 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-medium text-sm">
            {post.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-sm font-medium text-neutral-50">
              {post.username}
            </h4>
            <span className="text-xs text-neutral-500">{post.created_at}</span>
          </div>
        </div>

        {currentUser?.user_id === post.user_id && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-dark-hover transition-colors"
            >
              <MoreHorizontal size={20} className="text-neutral-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-dark-bg border border-dark-border rounded-lg p-2 min-w-[150px] z-10 shadow-xl">
                <button
                  onClick={handleDelete}
                  className="w-full px-3 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
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
        <p className="text-sm text-neutral-200 leading-relaxed mb-3 break-words">
          {post.text}
        </p>

        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.hashtags.map((tag, index) => (
              <span
                key={index}
                className="text-[13px] font-medium text-neutral-400 hover:text-neutral-300 cursor-pointer transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {post.media && (
          <div className="mt-3 rounded-lg overflow-hidden">
            <img
              src={post.media.startsWith('http') ? post.media : `${API_BASE_URL}${post.media}`}
              alt="Post content"
              className="w-full h-auto block"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-dark-border">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
            liked
              ? 'text-red-400 hover:text-red-300'
              : 'text-neutral-400 hover:bg-dark-hover hover:text-neutral-50'
          }`}
        >
          <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-neutral-400 hover:bg-dark-hover hover:text-neutral-50 transition-all"
        >
          <MessageCircle size={20} />
          <span>{commentsCount}</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-neutral-400 hover:bg-dark-hover hover:text-neutral-50 transition-all">
          <Share2 size={20} />
          <span>Share</span>
        </button>

        <button
          onClick={handleSave}
          className={`ml-auto p-2 rounded-lg transition-all ${
            saved
              ? 'text-neutral-50'
              : 'text-neutral-400 hover:bg-dark-hover hover:text-neutral-50'
          }`}
          title={saved ? 'Unsave post' : 'Save post'}
        >
          <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
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
