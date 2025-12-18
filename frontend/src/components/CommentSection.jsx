import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { getComments } from '../services/api';

const CommentSection = ({ postId, currentUser, onCommentSubmit }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      if (onCommentSubmit) await onCommentSubmit(newComment);
      await loadComments();
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="border-t border-dark-border bg-dark-bg">
      {/* Comments List */}
      <div className="max-h-[400px] overflow-y-auto p-4 scrollbar-custom">
        {loading ? (
          <div className="text-center text-neutral-500 text-[13px] py-5">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <p className="text-center text-neutral-500 text-[13px] py-5">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.comment_id} className="flex gap-3 mb-4 animate-[fadeIn_0.3s_ease]">
              <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-semibold text-sm flex-shrink-0">
                {comment.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-semibold text-neutral-50">
                    {comment.username}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {comment.created_at}
                  </span>
                </div>
                <p className="text-[13px] text-neutral-300 leading-relaxed break-words">
                  {comment.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3 p-3 border-t border-dark-border bg-dark-card">
        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-semibold text-sm flex-shrink-0">
          {currentUser?.username?.charAt(0).toUpperCase()}
        </div>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 py-2.5 px-3 bg-dark-bg border border-dark-border rounded-full text-neutral-50 text-[13px] placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="p-2 bg-neutral-50 rounded-full text-neutral-900 hover:bg-neutral-200 disabled:bg-dark-border disabled:text-neutral-500 disabled:cursor-not-allowed transition-all hover:scale-105"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
