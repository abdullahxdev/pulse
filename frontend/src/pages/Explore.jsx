import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Hash } from 'lucide-react';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import { getPosts, getSuggestedUsers, followUser, likePost, addComment } from '../services/api';

const Explore = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExploreData();
  }, []);

  const loadExploreData = async () => {
    try {
      setLoading(true);
      const [postsData, usersData] = await Promise.all([
        getPosts(),
        getSuggestedUsers()
      ]);
      setPosts(postsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading explore data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // Filter posts and users based on search query
      const filteredPosts = posts.filter(post => 
        post.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPosts(filteredPosts);
      setUsers(filteredUsers);
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

  const handleFollowUser = async (userId) => {
    try {
      await followUser(userId);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const trendingHashtags = [
    { tag: 'webdevelopment', posts: '12.5K', growth: '+15%' },
    { tag: 'react', posts: '8.3K', growth: '+22%' },
    { tag: 'coding', posts: '15.7K', growth: '+8%' },
    { tag: 'design', posts: '6.9K', growth: '+18%' },
    { tag: 'javascript', posts: '11.2K', growth: '+12%' },
    { tag: 'ai', posts: '9.8K', growth: '+35%' },
    { tag: 'machinelearning', posts: '7.1K', growth: '+28%' },
    { tag: 'python', posts: '10.4K', growth: '+10%' }
  ];

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading explore...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Search size={28} className="text-primary" />
            <h1 className="text-[28px] font-bold text-slate-50">Explore</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search posts, users, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-12 pr-4 bg-dark-bg border border-dark-border rounded-lg text-slate-50 placeholder:text-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </form>

          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { key: 'posts', label: 'Posts', icon: TrendingUp },
              { key: 'users', label: 'Users', icon: Users },
              { key: 'hashtags', label: 'Hashtags', icon: Hash }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-primary text-white'
                      : 'text-slate-400 hover:bg-dark-border hover:text-slate-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-[1fr_350px] gap-4">
          <div>
            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="flex flex-col">
                {posts.length === 0 ? (
                  <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
                    <h3 className="text-xl text-slate-50 mb-2">No posts found</h3>
                    <p className="text-slate-400">Try a different search term</p>
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
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-dark-card border border-dark-border rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Discover Users</h3>
                <div className="flex flex-col gap-3">
                  {users.length === 0 ? (
                    <p className="text-center text-slate-400 py-10">No users found</p>
                  ) : (
                    users.map(user => (
                      <UserCard
                        key={user.user_id}
                        user={user}
                        onFollow={handleFollowUser}
                      />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Hashtags Tab */}
            {activeTab === 'hashtags' && (
              <div className="bg-dark-card border border-dark-border rounded-xl p-4">
                <h3 className="text-lg font-semibold text-slate-50 mb-4">Trending Hashtags</h3>
                <div className="grid gap-3">
                  {trendingHashtags.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-dark-bg rounded-lg border border-dark-border hover:border-primary transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Hash size={24} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-slate-50">
                            #{item.tag}
                          </h4>
                          <p className="text-sm text-slate-400">{item.posts} posts</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-green-500">
                          {item.growth}
                        </span>
                        <p className="text-xs text-slate-500">growth</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-dark-card border border-dark-border rounded-xl p-4 sticky top-[84px]">
              <h3 className="text-base font-semibold text-slate-50 mb-4">
                What's Trending
              </h3>
              <div className="flex flex-col gap-3">
                {trendingHashtags.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-dark-border last:border-0 cursor-pointer hover:pl-2 transition-all"
                  >
                    <div>
                      <span className="text-sm font-medium text-primary">
                        #{item.tag}
                      </span>
                      <p className="text-xs text-slate-500">{item.posts} posts</p>
                    </div>
                    <span className="text-xs text-green-500 font-medium">
                      {item.growth}
                    </span>
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

export default Explore;