import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Edit } from 'lucide-react';
import PostCard from '../components/PostCard';
import { getUserProfile, getUserPosts, followUser, likePost, addComment } from '../services/api';

const Profile = ({ currentUser }) => {
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
      setIsFollowing(userData.isFollowing || false);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await followUser(parseInt(userId));
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following user:', error);
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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg flex items-center justify-center">
        <div className="text-slate-500 text-sm">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-60px)] bg-dark-bg">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
            <h2 className="text-xl font-semibold text-slate-50 mb-2">User not found</h2>
            <p className="text-slate-400">The profile you're looking for doesn't exist.</p>
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
          <div className="h-[200px] bg-gradient-to-r from-primary to-purple-500"></div>

          {/* Profile Info */}
          <div className="p-6 relative">
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold text-5xl border-[5px] border-dark-card -mt-[60px] mb-4">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <h1 className="text-[28px] font-bold text-slate-50 mb-1">
                    {user.username}
                  </h1>
                  <p className="text-sm text-slate-400">{user.email}</p>
                </div>

                {isOwnProfile ? (
                  <button className="flex items-center gap-2 px-4 py-2 bg-dark-border text-slate-50 font-medium rounded-lg hover:bg-dark-hover transition-colors">
                    <Edit size={18} />
                    Edit Profile
                  </button>
                ) : (
                  <button 
                    onClick={handleFollow}
                    className={`px-5 py-2 font-medium rounded-lg transition-colors ${
                      isFollowing 
                        ? 'bg-dark-border text-slate-50 hover:bg-dark-hover' 
                        : 'bg-primary text-white hover:bg-primary-hover'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                )}
              </div>

              <p className="text-[15px] text-slate-300 leading-relaxed">
                {user.profile_info || 'No bio yet'}
              </p>

              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-1.5 text-sm text-slate-400">
                  <Calendar size={16} />
                  <span>Joined December 2024</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4 border-t border-dark-border">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl font-bold text-primary">
                    {user.posts_count || posts.length}
                  </span>
                  <span className="text-[13px] text-slate-400">Posts</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl font-bold text-primary">
                    {user.followers_count || 0}
                  </span>
                  <span className="text-[13px] text-slate-400">Followers</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xl font-bold text-primary">
                    {user.following_count || 0}
                  </span>
                  <span className="text-[13px] text-slate-400">Following</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex gap-2 p-2 bg-dark-card border border-dark-border rounded-xl mb-4">
          {['posts', 'media', 'liked'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-5 rounded-lg text-sm font-medium transition-all capitalize ${
                activeTab === tab 
                  ? 'bg-primary text-white' 
                  : 'text-slate-400 hover:bg-dark-border hover:text-slate-50'
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
                <div className="bg-dark-card border border-dark-border rounded-xl p-[60px_24px] text-center">
                  <h3 className="text-xl text-slate-50 mb-2">No posts yet</h3>
                  <p className="text-slate-400">
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