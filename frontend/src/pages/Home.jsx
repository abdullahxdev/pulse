import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import UserCard from '../components/UserCard';
import StoryViewer from '../components/StoryViewer';
import { getPosts, createPost, likePost, addComment, getSuggestedUsers, getStories, followUser } from '../services/api';

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [postsData, usersData, storiesData] = await Promise.all([
        getPosts(),
        getSuggestedUsers(),
        getStories()
      ]);
      setPosts(postsData);
      setSuggestedUsers(usersData);
      setStories(storiesData);
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await createPost(postData);
      if (response.success) {
        const newPosts = await getPosts();
        setPosts(newPosts);
      }
    } catch (error) {
      console.error('Error creating post:', error);
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

  const handleDeletePost = async (postId) => {
    try {
      setPosts(posts.filter(p => p.post_id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      await followUser(userId);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleAddStory = () => {
    alert('Story creation coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading your feed...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
      <div className="grid lg:grid-cols-[1fr_350px] gap-6 max-w-[1200px] mx-auto">
        
        {/* Main Feed Column */}
        <div className="min-w-0">
          {/* Stories Section */}
          <StoryViewer 
            stories={stories}
            currentUser={currentUser}
            onAddStory={handleAddStory}
          />

          {/* Create Post Trigger */}
          <div 
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-3 p-4 bg-dark-card border border-dark-border rounded-xl mb-4 cursor-pointer hover:border-primary hover:-translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold text-base">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 py-3 px-4 bg-dark-bg border border-dark-border rounded-full text-slate-500 text-sm cursor-pointer hover:border-dark-hover transition-colors">
              What's on your mind, {currentUser?.username}?
            </div>
            <button className="p-2.5 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors">
              <Plus size={20} />
            </button>
          </div>

          {/* Posts Feed */}
          <div className="flex flex-col">
            {posts.length === 0 ? (
              <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
                <h3 className="text-xl text-slate-50 mb-2">No posts yet!</h3>
                <p className="text-slate-400 mb-5">
                  Be the first to share something with your network.
                </p>
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post.post_id}
                  post={post}
                  currentUser={currentUser}
                  onLike={handleLikePost}
                  onComment={handleAddComment}
                  onDelete={handleDeletePost}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="hidden lg:block sticky top-[84px] h-fit flex-col gap-4">
          {/* Suggested Users */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-4">
            <h3 className="text-base font-semibold text-slate-50 mb-4">
              Suggested For You
            </h3>
            <div className="flex flex-col">
              {suggestedUsers.map(user => (
                <UserCard
                  key={user.user_id}
                  user={user}
                  onFollow={handleFollowUser}
                />
              ))}
            </div>
          </div>

          {/* Trending Hashtags */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-4">
            <h3 className="text-base font-semibold text-slate-50 mb-4">
              Trending Hashtags
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { tag: 'webdevelopment', count: '12.5K' },
                { tag: 'react', count: '8.3K' },
                { tag: 'coding', count: '15.7K' },
                { tag: 'design', count: '6.9K' },
                { tag: 'javascript', count: '11.2K' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-dark-border last:border-0 cursor-pointer hover:pl-2 transition-all"
                >
                  <span className="text-sm font-medium text-primary">
                    #{item.tag}
                  </span>
                  <span className="text-xs text-slate-500">
                    {item.count} posts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 text-center">
            <p className="text-xs text-slate-500 mb-2">© 2025 Pulse • Made with 💙</p>
            <div className="flex justify-center gap-4 flex-wrap">
              {['About', 'Help', 'Privacy', 'Terms'].map((link, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="text-[11px] text-slate-400 hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePost
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onSubmit={handleCreatePost}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Home;