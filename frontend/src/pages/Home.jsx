import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import UserCard from '../components/UserCard';
import Toast from '../components/Toast';
import { getPosts, createPost, likePost, addComment, getSuggestedUsers, followUser, deletePost, savePost } from '../services/api';

const Home = ({ currentUser, onRefreshStats }) => {
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [postsData, usersData] = await Promise.all([
        getPosts(),
        getSuggestedUsers()
      ]);
      setPosts(postsData);
      setSuggestedUsers(usersData);
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
        showToast('Post created successfully!', 'success');
        // Refresh user stats to update post count in sidebar
        if (onRefreshStats) {
          onRefreshStats();
        }
      } else {
        showToast(response.message || 'Failed to create post', 'error');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('Error creating post', 'error');
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

  const handleDeletePost = async (postId) => {
    try {
      const result = await deletePost(postId);
      if (result.success) {
        setPosts(posts.filter(p => p.post_id !== postId));
        showToast('Post deleted successfully', 'success');
        // Refresh user stats to update post count in sidebar
        if (onRefreshStats) {
          onRefreshStats();
        }
      } else {
        console.error('Failed to delete post:', result.message);
        showToast('Failed to delete post', 'error');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Error deleting post', 'error');
    }
  };

  const handleFollowUser = async (userId) => {
    try {
      const result = await followUser(userId);
      if (result && result.success) {
        // Remove user from suggested users after following
        setSuggestedUsers(suggestedUsers.filter(u => u.user_id !== userId));
        showToast(result.is_following ? 'User followed!' : 'User unfollowed', 'success');
        // Refresh user stats to update sidebar
        if (onRefreshStats) {
          onRefreshStats();
        }
      }
      return result;
    } catch (error) {
      console.error('Error following user:', error);
      showToast('Error following user', 'error');
      return { success: false };
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const result = await savePost(postId);
      if (result && result.success) {
        showToast(result.is_saved ? 'Post saved!' : 'Post unsaved', 'success');
      }
      return result;
    } catch (error) {
      console.error('Error saving post:', error);
      showToast('Error saving post', 'error');
      return { success: false };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading feed...</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
      <div className="grid lg:grid-cols-[1fr_350px] gap-6 max-w-[1200px] mx-auto">

        {/* Main Feed Column */}
        <div className="min-w-0">
          {/* Create Post Trigger */}
          <div
            onClick={() => setShowCreatePost(true)}
            className="flex items-center gap-3 p-4 bg-dark-card border border-dark-border rounded-xl mb-4 cursor-pointer hover:border-dark-hover transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-medium text-sm">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 py-2.5 px-4 bg-dark-bg border border-dark-border rounded-lg text-neutral-500 text-sm">
              What's on your mind?
            </div>
            <button className="p-2.5 bg-neutral-50 text-neutral-900 rounded-lg hover:bg-neutral-200 transition-colors">
              <Plus size={18} />
            </button>
          </div>

          {/* Posts Feed */}
          <div className="flex flex-col">
            {posts.length === 0 ? (
              <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
                <h3 className="text-lg font-medium text-neutral-50 mb-2">No posts yet</h3>
                <p className="text-neutral-500 text-sm mb-5">
                  Be the first to share something.
                </p>
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="px-5 py-2.5 bg-neutral-50 text-neutral-900 font-medium text-sm rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Create Post
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
                  onSave={handleSavePost}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="hidden lg:block sticky top-[84px] h-fit flex-col gap-4">
          {/* Suggested Users */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-4">
            <h3 className="text-sm font-medium text-neutral-50 mb-4">
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
            <h3 className="text-sm font-medium text-neutral-50 mb-4">
              Trending
            </h3>
            <div className="flex flex-col gap-2">
              {[
                { tag: 'webdevelopment', count: '12.5K' },
                { tag: 'react', count: '8.3K' },
                { tag: 'coding', count: '15.7K' },
                { tag: 'design', count: '6.9K' },
                { tag: 'javascript', count: '11.2K' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-dark-border last:border-0 cursor-pointer hover:bg-dark-hover rounded px-2 -mx-2 transition-all"
                >
                  <span className="text-sm text-neutral-300">
                    #{item.tag}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 text-center">
            <p className="text-xs text-neutral-600">Pulse</p>
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

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Home;
