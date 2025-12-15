import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, Clock, Award } from 'lucide-react';
import PostCard from '../components/PostCard';
import { getPosts, likePost, addComment } from '../services/api';

const Trending = ({ currentUser }) => {
  const [activeFilter, setActiveFilter] = useState('today');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendingPosts();
  }, [activeFilter]);

  const loadTrendingPosts = async () => {
    try {
      setLoading(true);
      const data = await getPosts();
      // Sort by likes (trending posts)
      const sortedPosts = [...data].sort((a, b) => b.likes_count - a.likes_count);
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error loading trending posts:', error);
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

  const trendingTopics = [
    { topic: 'Web Development', posts: 2453, trend: '+25%', icon: '💻' },
    { topic: 'Artificial Intelligence', posts: 1876, trend: '+42%', icon: '🤖' },
    { topic: 'Design Systems', posts: 1234, trend: '+18%', icon: '🎨' },
    { topic: 'React Hooks', posts: 987, trend: '+15%', icon: '⚛️' },
    { topic: 'Tailwind CSS', posts: 856, trend: '+32%', icon: '🎭' }
  ];

  const topCreators = [
    { rank: 1, username: 'jane_smith', posts: 145, likes: '12.5K' },
    { rank: 2, username: 'mike_wilson', posts: 128, likes: '10.2K' },
    { rank: 3, username: 'sarah_jones', posts: 112, likes: '9.8K' }
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading trending...</div>
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
              <Flame size={28} className="text-orange-500" />
              <h1 className="text-[28px] font-bold text-slate-50">Trending</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <TrendingUp size={18} className="text-green-500" />
              <span>Updated 5 minutes ago</span>
            </div>
          </div>

          {/* Time Filters */}
          <div className="flex gap-2">
            {[
              { key: 'today', label: 'Today', icon: Clock },
              { key: 'week', label: 'This Week', icon: TrendingUp },
              { key: 'month', label: 'This Month', icon: Award }
            ].map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === filter.key
                      ? 'bg-primary text-white'
                      : 'text-slate-400 hover:bg-dark-border hover:text-slate-50'
                  }`}
                >
                  <Icon size={18} />
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-4">
          
          {/* Trending Posts */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-50">
                🔥 Hot Posts Right Now
              </h2>
              <span className="text-sm text-slate-400">
                {posts.length} trending posts
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
                <h3 className="text-xl text-slate-50 mb-2">No trending posts</h3>
                <p className="text-slate-400">Check back later for trending content</p>
              </div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.post_id}
                  post={post}
                  currentUser={currentUser}
                  onLike={handleLikePost}
                  onComment={handleAddComment}
                />
              ))
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block space-y-4">
            
            {/* Trending Topics */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-4 sticky top-[84px]">
              <h3 className="text-base font-semibold text-slate-50 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Trending Topics
              </h3>
              <div className="flex flex-col gap-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-dark-bg rounded-lg hover:bg-dark-border transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.icon}</span>
                      <div>
                        <h4 className="text-sm font-medium text-slate-50">
                          {topic.topic}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {topic.posts} posts
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-green-500">
                      {topic.trend}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Creators */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-4">
              <h3 className="text-base font-semibold text-slate-50 mb-4 flex items-center gap-2">
                <Award size={20} className="text-yellow-500" />
                Top Creators
              </h3>
              <div className="flex flex-col gap-3">
                {topCreators.map((creator) => (
                  <div
                    key={creator.rank}
                    className="flex items-center gap-3 p-3 bg-dark-bg rounded-lg hover:bg-dark-border transition-all cursor-pointer"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      creator.rank === 1 ? 'bg-yellow-500 text-white' :
                      creator.rank === 2 ? 'bg-slate-400 text-white' :
                      'bg-orange-600 text-white'
                    }`}>
                      {creator.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                      {creator.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-slate-50">
                        {creator.username}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {creator.posts} posts • {creator.likes} likes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;