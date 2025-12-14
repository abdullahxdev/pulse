import React, { useState } from 'react';
import { X, Image, Hash } from 'lucide-react';

const CreatePost = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [postText, setPostText] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postText.trim()) {
      alert('Please write something before posting!');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const hashtagsArray = hashtags
        .split(',')
        .map(tag => tag.trim().replace('#', ''))
        .filter(tag => tag.length > 0);

      const postData = {
        text: postText,
        hashtags: hashtagsArray
      };

      if (onSubmit) await onSubmit(postData);

      setPostText('');
      setHashtags('');
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-dark-card rounded-2xl p-6 max-w-[600px] w-full max-h-[90vh] overflow-y-auto border border-dark-border scrollbar-custom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-slate-50">Create Post</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-dark-border transition-colors"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-base">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-slate-50">{currentUser?.username}</span>
          </div>

          {/* Post Text Input */}
          <textarea
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={6}
            autoFocus
            className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-[15px] resize-y min-h-[120px] mb-4 placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors font-poppins"
          />

          {/* Hashtags Input */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-50 mb-2">
              <Hash size={16} />
              <span>Hashtags (comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="react, webdev, coding"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full py-3 px-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Media Upload Placeholder */}
          <div className="flex items-center gap-4 p-3 bg-dark-bg rounded-lg mb-4">
            <button 
              type="button" 
              className="flex items-center gap-2 px-3 py-2 border border-dark-border rounded-md text-slate-400 text-[13px] hover:bg-dark-border hover:text-slate-50 hover:border-dark-hover transition-all"
              title="Add Image"
            >
              <Image size={20} />
              <span>Photo</span>
            </button>
            <span className="text-slate-500 text-xs">Media upload coming soon</span>
          </div>

          <div className="h-px bg-dark-border mb-4"></div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting || !postText.trim()}
            className="w-full py-3 bg-primary text-white font-semibold text-[15px] rounded-lg hover:bg-primary-hover disabled:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;