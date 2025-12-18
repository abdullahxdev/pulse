import React, { useState, useRef } from 'react';
import { X, Image, Hash, Loader2 } from 'lucide-react';
import { uploadImage } from '../services/api';

const CreatePost = ({ isOpen, onClose, onSubmit, currentUser }) => {
  const [postText, setPostText] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!postText.trim() && !selectedImage) {
      alert('Please write something or add an image before posting!');
      return;
    }

    try {
      setIsSubmitting(true);

      let mediaUrl = null;

      if (selectedImage) {
        setIsUploading(true);
        const uploadResult = await uploadImage(selectedImage);
        setIsUploading(false);

        if (!uploadResult.success) {
          alert(uploadResult.message || 'Failed to upload image');
          setIsSubmitting(false);
          return;
        }

        mediaUrl = uploadResult.url;
      }

      const hashtagsArray = hashtags
        .split(',')
        .map(tag => tag.trim().replace('#', ''))
        .filter(tag => tag.length > 0);

      const postData = {
        text: postText || ' ',
        hashtags: hashtagsArray,
        media: mediaUrl
      };

      if (onSubmit) await onSubmit(postData);

      setPostText('');
      setHashtags('');
      setSelectedImage(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4"
      onClick={onClose}
    >
      <div
        className="bg-dark-card rounded-xl p-6 max-w-[500px] w-full max-h-[90vh] overflow-y-auto border border-dark-border scrollbar-custom"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-medium text-neutral-50">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-hover transition-colors"
          >
            <X size={20} className="text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* User Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-medium text-sm">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium text-neutral-50">{currentUser?.username}</span>
          </div>

          {/* Post Text Input */}
          <textarea
            placeholder="What's on your mind?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            rows={5}
            autoFocus
            className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 text-sm resize-y min-h-[100px] mb-4 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
          />

          {/* Hashtags Input */}
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-400 mb-2">
              <Hash size={14} />
              <span>Hashtags (comma separated)</span>
            </label>
            <input
              type="text"
              placeholder="react, webdev, coding"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full py-2.5 px-3 bg-dark-bg border border-dark-border rounded-lg text-neutral-50 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mb-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-[250px] object-contain rounded-lg border border-dark-border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-dark-bg/90 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <X size={16} className="text-neutral-50" />
              </button>
            </div>
          )}

          {/* Media Upload */}
          <div className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-3 py-2 border border-dark-border rounded-lg text-neutral-400 text-sm hover:bg-dark-hover hover:text-neutral-50 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Image size={18} />
              )}
              <span>{isUploading ? 'Uploading...' : 'Photo'}</span>
            </button>
            <span className="text-neutral-600 text-xs">
              {selectedImage ? selectedImage.name : 'Max 5MB'}
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || (!postText.trim() && !selectedImage)}
            className="w-full py-3 bg-neutral-50 text-neutral-900 font-medium text-sm rounded-lg hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed transition-all"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
