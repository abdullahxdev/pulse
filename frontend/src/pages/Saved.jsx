import React, { useState, useEffect } from 'react';
import { Bookmark, Grid, List, Filter } from 'lucide-react';
import PostCard from '../components/PostCard';
import { getSavedPosts, savePost, likePost, addComment } from '../services/api';

const Saved = ({ currentUser }) => {
  const [viewMode, setViewMode] = useState('list');
  const [filterBy, setFilterBy] = useState('all');
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      setLoading(true);
      const data = await getSavedPosts();
      setSavedPosts(data);
    } catch (error) {
      console.error('Error loading saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const result = await likePost(postId);
      return result;
    } catch (error) {
      console.error('Error liking post:', error);
      return { success: false };
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      const result = await addComment(postId, commentText);
      return result;
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false };
    }
  };

  const handleUnsave = async (postId) => {
    try {
      const result = await savePost(postId);
      if (result.success && !result.is_saved) {
        // Remove from local state
        setSavedPosts(savedPosts.filter(post => post.post_id !== postId));
      }
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const result = await savePost(postId);
      if (result.success && !result.is_saved) {
        // If unsaved, remove from list
        setSavedPosts(savedPosts.filter(post => post.post_id !== postId));
      }
      return result;
    } catch (error) {
      console.error('Error toggling save:', error);
      return { success: false };
    }
  };

  // Filter posts based on selected filter
  const filteredPosts = savedPosts.filter(post => {
    if (filterBy === 'all') return true;
    if (filterBy === 'posts') return !post.media;
    if (filterBy === 'images') return post.media && post.media.includes('image');
    if (filterBy === 'videos') return post.media && post.media.includes('video');
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading saved posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bookmark size={28} className="text-neutral-400" />
              <div>
                <h1 className="text-[28px] font-bold text-neutral-50">Saved Posts</h1>
                <p className="text-sm text-neutral-400">
                  {savedPosts.length} saved items
                </p>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-neutral-50 text-neutral-900'
                    : 'text-neutral-400 hover:bg-dark-border hover:text-neutral-50'
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-neutral-50 text-neutral-900'
                    : 'text-neutral-400 hover:bg-dark-border hover:text-neutral-50'
                }`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-neutral-400" />
            {['all', 'posts', 'images', 'videos'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterBy(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filterBy === filter
                    ? 'bg-neutral-50 text-neutral-900'
                    : 'text-neutral-400 hover:bg-dark-border hover:text-neutral-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-4">

          {/* Saved Posts */}
          <div>
            {filteredPosts.length === 0 ? (
              <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
                <Bookmark size={64} className="text-neutral-600 mx-auto mb-4" />
                <h3 className="text-xl text-neutral-50 mb-2">No saved posts yet</h3>
                <p className="text-neutral-400 mb-4">
                  Save posts to read them later by clicking the bookmark icon on any post
                </p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'flex flex-col'}>
                {filteredPosts.map(post => (
                  <div key={post.post_id} className="relative group">
                    <PostCard
                      post={{ ...post, is_saved: true }}
                      currentUser={currentUser}
                      onLike={handleLikePost}
                      onComment={handleAddComment}
                      onSave={handleSavePost}
                    />
                    {/* Unsave Button Overlay */}
                    <button
                      onClick={() => handleUnsave(post.post_id)}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      title="Remove from saved"
                    >
                      <Bookmark size={18} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Stats */}
          <div className="hidden lg:block">
            <div className="bg-dark-card border border-dark-border rounded-xl p-4 sticky top-[84px]">
              <h3 className="text-base font-semibold text-neutral-50 mb-4">
                Your Saved Posts
              </h3>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm p-3 bg-dark-bg rounded-lg">
                  <span className="text-neutral-400">Total Saved</span>
                  <span className="text-neutral-50 font-medium">
                    {savedPosts.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-dark-bg rounded-lg">
                  <span className="text-neutral-400">Text Posts</span>
                  <span className="text-neutral-50 font-medium">
                    {savedPosts.filter(p => !p.media).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-dark-bg rounded-lg">
                  <span className="text-neutral-400">With Media</span>
                  <span className="text-neutral-50 font-medium">
                    {savedPosts.filter(p => p.media).length}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-neutral-800/50 rounded-lg">
                <p className="text-xs text-neutral-400">
                  Your saved posts are stored in the database and will persist across sessions and devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saved;
