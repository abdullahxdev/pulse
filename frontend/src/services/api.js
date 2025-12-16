// Real API Service - Connected to FastAPI Backend
import axios from 'axios';

// Backend API base URL
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================
// AUTH API CALLS
// ============================================

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.access_token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Login failed',
    };
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    
    return {
      success: true,
      user: response.data.user,
      token: response.data.access_token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Registration failed',
    };
  }
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true };
};

// ============================================
// USER API CALLS
// ============================================

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/me');
    
    // Get user stats
    const statsResponse = await api.get(`/users/${response.data.user_id}/stats`);
    
    return {
      ...response.data,
      posts_count: statsResponse.data.posts_count,
      followers_count: statsResponse.data.followers_count,
      following_count: statsResponse.data.following_count,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    
    // Get user stats
    const statsResponse = await api.get(`/users/${userId}/stats`);
    
    return {
      ...response.data,
      posts_count: statsResponse.data.posts_count,
      followers_count: statsResponse.data.followers_count,
      following_count: statsResponse.data.following_count,
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/me', profileData);
    return {
      success: true,
      user: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Update failed',
    };
  }
};

export const getSuggestedUsers = async () => {
  try {
    const response = await api.get('/users/', {
      params: { limit: 5 },
    });
    return response.data;
  } catch (error) {
    console.error('Error getting suggested users:', error);
    return [];
  }
};

export const searchUsers = async (query) => {
  try {
    const response = await api.get('/users/', {
      params: { query, limit: 20 },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// ============================================
// POST API CALLS
// ============================================

export const getPosts = async () => {
  try {
    const response = await api.get('/posts/', {
      params: { limit: 20 },
    });
    return response.data.map(post => ({
      ...post,
      created_at: formatTimeAgo(post.created_at),
    }));
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

export const getUserPosts = async (userId) => {
  try {
    const response = await api.get(`/posts/user/${userId}`, {
      params: { limit: 20 },
    });
    return response.data.map(post => ({
      ...post,
      created_at: formatTimeAgo(post.created_at),
    }));
  } catch (error) {
    console.error('Error getting user posts:', error);
    return [];
  }
};

export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts/', postData);
    return {
      success: true,
      post: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to create post',
    };
  }
};

export const deletePost = async (postId) => {
  try {
    await api.delete(`/posts/${postId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to delete post',
    };
  }
};

// ============================================
// LIKE API CALLS
// ============================================

export const likePost = async (postId) => {
  try {
    // Check if already liked
    const checkResponse = await api.get(`/likes/post/${postId}/check`);
    
    if (checkResponse.data.is_liked) {
      // Unlike
      await api.delete(`/likes/${postId}`);
      return { success: true, is_liked: false };
    } else {
      // Like
      await api.post('/likes/', { post_id: postId });
      return { success: true, is_liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false };
  }
};

// ============================================
// COMMENT API CALLS
// ============================================

export const getComments = async (postId) => {
  try {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data.map(comment => ({
      ...comment,
      created_at: formatTimeAgo(comment.created_at),
    }));
  } catch (error) {
    console.error('Error getting comments:', error);
    return [];
  }
};

export const addComment = async (postId, text) => {
  try {
    const response = await api.post('/comments/', {
      post_id: postId,
      text: text,
    });
    return {
      success: true,
      comment: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to add comment',
    };
  }
};

// ============================================
// FOLLOW API CALLS
// ============================================

export const followUser = async (userId) => {
  try {
    // Check if already following
    const checkResponse = await api.get(`/follows/check/${userId}`);
    
    if (checkResponse.data.is_following) {
      // Unfollow
      await api.delete(`/follows/${userId}`);
      return { success: true, is_following: false };
    } else {
      // Follow
      await api.post('/follows/', { followee_id: userId });
      return { success: true, is_following: true };
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return { success: false };
  }
};

export const getFollowers = async (userId) => {
  try {
    const response = await api.get(`/follows/followers/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting followers:', error);
    return [];
  }
};

export const getFollowing = async (userId) => {
  try {
    const response = await api.get(`/follows/following/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting following:', error);
    return [];
  }
};

// ============================================
// NOTIFICATION API CALLS
// ============================================

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications/', {
      params: { limit: 50 },
    });
    return response.data.map(notification => ({
      ...notification,
      created_at: formatTimeAgo(notification.created_at),
    }));
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await api.put(`/notifications/${notificationId}`, { is_read: 1 });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    await api.put('/notifications/mark-all-read');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

// ============================================
// MESSAGE API CALLS
// ============================================

export const getMessages = async () => {
  try {
    const response = await api.get('/messages/conversations');
    return response.data.map(conversation => ({
      message_id: conversation.user_id,
      sender_id: conversation.user_id,
      sender_username: conversation.username,
      receiver_id: null,
      content: conversation.last_message || 'No messages yet',
      created_at: formatTimeAgo(conversation.last_message_time),
      is_read: conversation.unread_count === 0 ? 1 : 0,
    }));
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
};

export const getConversation = async (userId) => {
  try {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data.map(message => ({
      ...message,
      created_at: formatTimeAgo(message.created_at),
    }));
  } catch (error) {
    console.error('Error getting conversation:', error);
    return [];
  }
};

export const sendMessage = async (receiverId, content) => {
  try {
    const response = await api.post('/messages/', {
      receiver_id: receiverId,
      content: content,
    });
    return {
      success: true,
      message: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to send message',
    };
  }
};

// ============================================
// STORY API CALLS
// ============================================

export const getStories = async () => {
  try {
    const response = await api.get('/stories/');
    return response.data.map(story => ({
      ...story,
      created_at: formatTimeAgo(story.created_at),
    }));
  } catch (error) {
    console.error('Error getting stories:', error);
    return [];
  }
};

export const createStory = async (storyData) => {
  try {
    const response = await api.post('/stories/', storyData);
    return {
      success: true,
      story: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.detail || 'Failed to create story',
    };
  }
};

// ============================================
// SEARCH API CALLS
// ============================================

export const searchPosts = async (hashtag) => {
  try {
    const response = await api.get(`/hashtags/${hashtag}/posts`);
    return response.data.map(post => ({
      ...post,
      created_at: formatTimeAgo(post.created_at),
    }));
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatTimeAgo(dateString) {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  
  return date.toLocaleDateString();
}

export default api;