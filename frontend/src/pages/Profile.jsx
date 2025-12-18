import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Edit } from 'lucide-react';
import PostCard from '../components/PostCard';
import { getUserProfile, getUserPosts, followUser, likePost, addComment, checkFollowStatus, savePost } from '../services/api';

const Profile = ({ currentUser, onRefreshStats }) => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser?.user_id === parseInt(userId);

  useEffect(() => {
    loadProfileData();
  }, [userId]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [userData, postsData] = await Promise.all([
        getUserProfile(parseInt(userId)),
        getUserPosts(parseInt(userId))
      ]);
      setUser(userData);
      setPosts(postsData);
      // Use is_following from API (with underscore)
      setIsFollowing(userData?.is_following || userData?.isFollowing || false);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    const prevFollowing = isFollowing;
    try {
      // Optimistic update
      setIsFollowing(!isFollowing);

      const result = await followUser(parseInt(userId));

      if (result && result.success) {
        // Refresh user data to get updated follower counts
        const updatedUser = await getUserProfile(parseInt(userId));
        if (updatedUser) {
          setUser(updatedUser);
        }
        setIsFollowing(result.is_following);
        // Refresh sidebar stats
        if (onRefreshStats) {
          onRefreshStats();
        }
      } else {
        // Rollback on failure
        setIsFollowing(prevFollowing);
      }
    } catch (error) {
      console.error('Error following user:', error);
      // Rollback on error
      setIsFollowing(prevFollowing);
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

  const handleSavePost = async (postId) => {
    try {
      const result = await savePost(postId);
      return result;
    } catch (error) {
      console.error('Error saving post:', error);
      return { success: false };
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
            <h2 className="text-lg font-medium text-neutral-50 mb-2">User not found</h2>
            <p className="text-neutral-500 text-sm">The profile you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
      <div className="max-w-[900px] mx-auto">
        
        {/* Profile Header */}
        <div className="bg-dark-card rounded-xl border border-dark-border mb-4 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-[140px] bg-neutral-800"></div>

          {/* Profile Info */}
          <div className="p-6 relative">
            <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-50 font-medium text-3xl border-4 border-dark-card -mt-16 mb-4">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-50 mb-1">
                    {user.username}
                  </h1>
                  <p className="text-sm text-neutral-500">{user.email}</p>
                </div>

                {isOwnProfile ? (
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 bg-dark-hover text-neutral-50 font-medium text-sm rounded-lg hover:bg-dark-border transition-colors"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </Link>
                ) : (
                  <button
                    onClick={handleFollow}
                    className={`px-5 py-2 font-medium text-sm rounded-lg transition-colors ${
                      isFollowing
                        ? 'bg-dark-hover text-neutral-300 hover:bg-dark-border'
                        : 'bg-neutral-50 text-neutral-900 hover:bg-neutral-200'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {user.profile_info || 'No bio yet'}
              </p>

              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                  <Calendar size={14} />
                  <span>Joined December 2024</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4 border-t border-dark-border">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-semibold text-neutral-50">
                    {user.posts_count || posts.length}
                  </span>
                  <span className="text-xs text-neutral-500">Posts</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-semibold text-neutral-50">
                    {user.followers_count || 0}
                  </span>
                  <span className="text-xs text-neutral-500">Followers</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-semibold text-neutral-50">
                    {user.following_count || 0}
                  </span>
                  <span className="text-xs text-neutral-500">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex gap-1 p-1 bg-dark-card border border-dark-border rounded-xl mb-4">
          {['posts', 'media', 'liked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-5 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-neutral-50 text-neutral-900'
                  : 'text-neutral-400 hover:bg-dark-hover hover:text-neutral-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Content */}
        <div className="mb-6">
          {activeTab === 'posts' && (
            <div className="flex flex-col">
              {posts.length === 0 ? (
                <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
                  <h3 className="text-lg font-medium text-neutral-50 mb-2">No posts yet</h3>
                  <p className="text-neutral-500 text-sm">
                    {isOwnProfile ? 'Share your first post!' : "This user hasn't posted anything yet."}
                  </p>
                </div>
              ) : (
                posts.map(post => (
                  <PostCard
                    key={post.post_id}
                    post={post}
                    currentUser={currentUser}
                    onLike={handleLikePost}
                    onComment={handleAddComment}
                    onSave={handleSavePost}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
              <h3 className="text-xl text-slate-50 mb-2">Media</h3>
              <p className="text-slate-400">Media posts will appear here</p>
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
              <h3 className="text-xl text-slate-50 mb-2">Liked Posts</h3>
              <p className="text-slate-400">Liked posts will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;