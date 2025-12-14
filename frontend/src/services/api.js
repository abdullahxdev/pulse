// API Service - All API calls in one place
// Currently using MOCK DATA - Replace with real API calls when backend is ready

const API_BASE_URL = 'http://localhost:8000/api';

// Mock current user (logged in user)
let currentUser = {
  user_id: 1,
  username: 'john_doe',
  email: 'john@example.com',
  profile_info: 'Software developer | Tech enthusiast | Coffee lover ☕',
  profile_picture: null,
  followers_count: 1250,
  following_count: 890,
  posts_count: 145
};

// Mock users data
const mockUsers = [
  {
    user_id: 2,
    username: 'jane_smith',
    email: 'jane@example.com',
    profile_info: 'Designer & Artist 🎨',
    profile_picture: null,
    isFollowing: true
  },
  {
    user_id: 3,
    username: 'mike_wilson',
    email: 'mike@example.com',
    profile_info: 'Photographer | Travel enthusiast 📸',
    profile_picture: null,
    isFollowing: false
  },
  {
    user_id: 4,
    username: 'sarah_jones',
    email: 'sarah@example.com',
    profile_info: 'Content creator | Blogger ✍️',
    profile_picture: null,
    isFollowing: true
  }
];

// Mock posts data
let mockPosts = [
  {
    post_id: 1,
    user_id: 2,
    username: 'jane_smith',
    text: 'Just finished working on this amazing UI design! What do you think? 🎨✨',
    media: null,
    likes_count: 234,
    comments_count: 45,
    is_liked: false,
    created_at: '2 hours ago',
    hashtags: ['design', 'ui', 'webdesign']
  },
  {
    post_id: 2,
    user_id: 3,
    username: 'mike_wilson',
    text: 'Sunset photography from my last trip to the mountains 🌄',
    media: null,
    likes_count: 567,
    comments_count: 89,
    is_liked: true,
    created_at: '5 hours ago',
    hashtags: ['photography', 'sunset', 'travel']
  },
  {
    post_id: 3,
    user_id: 1,
    username: 'john_doe',
    text: 'Working on a new React project! The component architecture is coming together nicely 💻',
    media: null,
    likes_count: 189,
    comments_count: 23,
    is_liked: false,
    created_at: '8 hours ago',
    hashtags: ['react', 'coding', 'webdev']
  },
  {
    post_id: 4,
    user_id: 4,
    username: 'sarah_jones',
    text: '10 tips for productive mornings! Check out my latest blog post 📝',
    media: null,
    likes_count: 423,
    comments_count: 67,
    is_liked: true,
    created_at: '1 day ago',
    hashtags: ['productivity', 'lifestyle', 'blogging']
  }
];

// Mock comments data
const mockComments = {
  1: [
    {
      comment_id: 1,
      user_id: 3,
      username: 'mike_wilson',
      text: 'This looks absolutely stunning! Love the color palette 🎨',
      created_at: '1 hour ago'
    },
    {
      comment_id: 2,
      user_id: 1,
      username: 'john_doe',
      text: 'Great work! The layout is very clean and modern.',
      created_at: '30 minutes ago'
    }
  ],
  2: [
    {
      comment_id: 3,
      user_id: 2,
      username: 'jane_smith',
      text: 'Breathtaking! Where was this taken?',
      created_at: '4 hours ago'
    }
  ]
};

// Mock notifications data
let mockNotifications = [
  {
    notification_id: 1,
    type: 'like',
    content: 'jane_smith liked your post',
    created_at: '5 minutes ago',
    is_read: 0
  },
  {
    notification_id: 2,
    type: 'comment',
    content: 'mike_wilson commented on your post',
    created_at: '30 minutes ago',
    is_read: 0
  },
  {
    notification_id: 3,
    type: 'follow',
    content: 'sarah_jones started following you',
    created_at: '2 hours ago',
    is_read: 1
  },
  {
    notification_id: 4,
    type: 'like',
    content: 'john_smith liked your post',
    created_at: '1 day ago',
    is_read: 1
  }
];

// Mock messages data
let mockMessages = [
  {
    message_id: 1,
    sender_id: 2,
    sender_username: 'jane_smith',
    receiver_id: 1,
    content: 'Hey! Did you see my latest design?',
    created_at: '10 minutes ago',
    is_read: 0
  },
  {
    message_id: 2,
    sender_id: 3,
    sender_username: 'mike_wilson',
    receiver_id: 1,
    content: 'Thanks for the feedback on my photos!',
    created_at: '1 hour ago',
    is_read: 1
  },
  {
    message_id: 3,
    sender_id: 4,
    sender_username: 'sarah_jones',
    receiver_id: 1,
    content: 'Would love to collaborate on a project!',
    created_at: '3 hours ago',
    is_read: 1
  }
];

// Mock stories data
const mockStories = [
  {
    story_id: 1,
    user_id: 2,
    username: 'jane_smith',
    media: null,
    created_at: '2 hours ago'
  },
  {
    story_id: 2,
    user_id: 3,
    username: 'mike_wilson',
    media: null,
    created_at: '5 hours ago'
  },
  {
    story_id: 3,
    user_id: 4,
    username: 'sarah_jones',
    media: null,
    created_at: '8 hours ago'
  }
];

// ============================================
// AUTH API CALLS
// ============================================

export const login = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock validation
  if (email && password) {
    return {
      success: true,
      user: currentUser,
      token: 'mock_jwt_token_12345'
    };
  }
  
  return {
    success: false,
    message: 'Invalid credentials'
  };
};

export const register = async (username, email, password) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    user: { ...currentUser, username, email },
    token: 'mock_jwt_token_12345'
  };
};

export const logout = async () => {
  await new Promise(resolve => setTimeout(resolve, 200));
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true };
};

// ============================================
// USER API CALLS
// ============================================

export const getCurrentUser = () => {
  return currentUser;
};

export const getUserProfile = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (userId === currentUser.user_id) {
    return currentUser;
  }
  
  return mockUsers.find(u => u.user_id === userId) || mockUsers[0];
};

export const updateProfile = async (profileData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  currentUser = { ...currentUser, ...profileData };
  return {
    success: true,
    user: currentUser
  };
};

export const getSuggestedUsers = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUsers.slice(0, 3);
};

// ============================================
// POST API CALLS
// ============================================

export const getPosts = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockPosts;
};

export const getUserPosts = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPosts.filter(p => p.user_id === userId);
};

export const createPost = async (postData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newPost = {
    post_id: mockPosts.length + 1,
    user_id: currentUser.user_id,
    username: currentUser.username,
    text: postData.text,
    media: postData.media || null,
    likes_count: 0,
    comments_count: 0,
    is_liked: false,
    created_at: 'Just now',
    hashtags: postData.hashtags || []
  };
  
  mockPosts = [newPost, ...mockPosts];
  return {
    success: true,
    post: newPost
  };
};

export const deletePost = async (postId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockPosts = mockPosts.filter(p => p.post_id !== postId);
  return { success: true };
};

// ============================================
// LIKE API CALLS
// ============================================

export const likePost = async (postId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const post = mockPosts.find(p => p.post_id === postId);
  if (post) {
    post.is_liked = !post.is_liked;
    post.likes_count += post.is_liked ? 1 : -1;
  }
  
  return {
    success: true,
    is_liked: post.is_liked,
    likes_count: post.likes_count
  };
};

// ============================================
// COMMENT API CALLS
// ============================================

export const getComments = async (postId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockComments[postId] || [];
};

export const addComment = async (postId, text) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newComment = {
    comment_id: Date.now(),
    user_id: currentUser.user_id,
    username: currentUser.username,
    text: text,
    created_at: 'Just now'
  };
  
  if (!mockComments[postId]) {
    mockComments[postId] = [];
  }
  mockComments[postId].push(newComment);
  
  // Update comment count
  const post = mockPosts.find(p => p.post_id === postId);
  if (post) {
    post.comments_count += 1;
  }
  
  return {
    success: true,
    comment: newComment
  };
};

// ============================================
// FOLLOW API CALLS
// ============================================

export const followUser = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const user = mockUsers.find(u => u.user_id === userId);
  if (user) {
    user.isFollowing = !user.isFollowing;
  }
  
  return {
    success: true,
    is_following: user.isFollowing
  };
};

export const getFollowers = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUsers.slice(0, 2);
};

export const getFollowing = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUsers.slice(1, 3);
};

// ============================================
// NOTIFICATION API CALLS
// ============================================

export const getNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockNotifications;
};

export const markNotificationAsRead = async (notificationId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const notification = mockNotifications.find(n => n.notification_id === notificationId);
  if (notification) {
    notification.is_read = 1;
  }
  
  return { success: true };
};

export const markAllNotificationsAsRead = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  mockNotifications = mockNotifications.map(n => ({ ...n, is_read: 1 }));
  return { success: true };
};

// ============================================
// MESSAGE API CALLS
// ============================================

export const getMessages = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMessages;
};

export const getConversation = async (userId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMessages.filter(m => 
    (m.sender_id === userId && m.receiver_id === currentUser.user_id) ||
    (m.sender_id === currentUser.user_id && m.receiver_id === userId)
  );
};

export const sendMessage = async (receiverId, content) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const newMessage = {
    message_id: mockMessages.length + 1,
    sender_id: currentUser.user_id,
    sender_username: currentUser.username,
    receiver_id: receiverId,
    content: content,
    created_at: 'Just now',
    is_read: 0
  };
  
  mockMessages = [newMessage, ...mockMessages];
  return {
    success: true,
    message: newMessage
  };
};

// ============================================
// STORY API CALLS
// ============================================

export const getStories = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockStories;
};

export const createStory = async (storyData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newStory = {
    story_id: mockStories.length + 1,
    user_id: currentUser.user_id,
    username: currentUser.username,
    media: storyData.media,
    created_at: 'Just now'
  };
  
  return {
    success: true,
    story: newStory
  };
};

// ============================================
// SEARCH API CALLS
// ============================================

export const searchUsers = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUsers.filter(u => 
    u.username.toLowerCase().includes(query.toLowerCase())
  );
};

export const searchPosts = async (hashtag) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockPosts.filter(p => 
    p.hashtags && p.hashtags.includes(hashtag)
  );
};