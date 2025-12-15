import React, { useState, useEffect } from 'react';
import { Bookmark, Grid, List, Filter } from 'lucide-react';
import PostCard from '../components/PostCard';
import { getPosts, likePost, addComment } from '../services/api';

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
      // For now, get all posts (in real app, filter only saved posts)
      const data = await getPosts();
      // Mock saved posts (first 3 posts)
      setSavedPosts(data.slice(0, 3));
    } catch (error) {
      console.error('Error loading saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      await addComment(postId, commentText);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUnsave = (postId) => {
    setSavedPosts(savedPosts.filter(post => post.post_id !== postId));
  };

  const collections = [
    { name: 'Inspiration', count: 24, color: 'from-purple-500 to-pink-500' },
    { name: 'Tutorials', count: 12, color: 'from-blue-500 to-cyan-500' },
    { name: 'Resources', count: 8, color: 'from-green-500 to-teal-500' },
    { name: 'Ideas', count: 15, color: 'from-orange-500 to-red-500' }
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading saved posts...</div>
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
              <Bookmark size={28} className="text-primary" />
              <div>
                <h1 className="text-[28px] font-bold text-slate-50">Saved Posts</h1>
                <p className="text-sm text-slate-400">
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
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-dark-border hover:text-slate-50'
                }`}
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-dark-border hover:text-slate-50'
                }`}
              >
                <Grid size={20} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            {['all', 'posts', 'images', 'videos'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterBy(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  filterBy === filter
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-dark-border hover:text-slate-50'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-4">
          
          {/* Saved Posts */}
          <div>
            {savedPosts.length === 0 ? (
              <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
                <Bookmark size={64} className="text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl text-slate-50 mb-2">No saved posts yet</h3>
                <p className="text-slate-400 mb-4">
                  Save posts to read them later or organize them into collections
                </p>
                <button className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors">
                  Explore Posts
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'flex flex-col'}>
                {savedPosts.map(post => (
                  <div key={post.post_id} className="relative group">
                    <PostCard
                      post={post}
                      currentUser={currentUser}
                      onLike={handleLikePost}
                      onComment={handleAddComment}
                    />
                    {/* Unsave Button */}
                    <button
                      onClick={() => handleUnsave(post.post_id)}
                      className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from saved"
                    >
                      <Bookmark size={18} fill="currentColor" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Collections */}
          <div className="hidden lg:block">
            <div className="bg-dark-card border border-dark-border rounded-xl p-4 sticky top-[84px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-50">
                  Collections
                </h3>
                <button className="text-sm text-primary hover:text-blue-400 transition-colors">
                  + New
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {collections.map((collection, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-dark-border hover:border-primary transition-all cursor-pointer bg-dark-bg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${collection.color} flex items-center justify-center`}>
                        <Bookmark size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-slate-50">
                          {collection.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {collection.count} items
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-4 border-t border-dark-border">
                <h4 className="text-sm font-medium text-slate-50 mb-3">Stats</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Saved</span>
                    <span className="text-slate-50 font-medium">
                      {savedPosts.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Collections</span>
                    <span className="text-slate-50 font-medium">
                      {collections.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">This Week</span>
                    <span className="text-green-500 font-medium">+5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Saved;