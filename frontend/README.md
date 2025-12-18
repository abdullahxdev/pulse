# Pulse Frontend - Technical Documentation

A comprehensive technical breakdown of the Pulse social media frontend application built with React 18, Vite, and Tailwind CSS.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Folder Breakdown](#folder-breakdown)
- [Core Components](#core-components)
- [Page Components](#page-components)
- [Services Layer](#services-layer)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Data Flow Patterns](#data-flow-patterns)
- [Styling System](#styling-system)
- [API Integration](#api-integration)
- [Known Challenges and Solutions](#known-challenges-and-solutions)
- [Development Setup](#development-setup)

---

## Architecture Overview

The Pulse frontend follows a component-based architecture with clear separation of concerns:

```
+---------------------------------------------------------------------+
|                        App.jsx (Root)                               |
|  +---------------------------------------------------------------+  |
|  |                    Authentication Layer                        |  |
|  |         (Token validation, user state management)             |  |
|  +---------------------------------------------------------------+  |
|                              |                                      |
|              +---------------+---------------+                      |
|              v               v               v                      |
|  +-----------------+ +-------------+ +-----------------+            |
|  |     Navbar      | |   Sidebar   | |  Main Content   |            |
|  |  (Navigation)   | |  (User Card)| |    (Routes)     |            |
|  +-----------------+ +-------------+ +-----------------+            |
|                                              |                      |
|              +---------------+---------------+---------------+      |
|              v               v               v               v      |
|  +---------+ +---------+ +---------+ +---------+ +---------+       |
|  |  Home   | | Profile | |Messages | | Explore | |Settings |       |
|  +---------+ +---------+ +---------+ +---------+ +---------+       |
|                              |                                      |
|              +---------------+---------------+                      |
|              v               v               v                      |
|  +-----------------+ +-----------------+ +-----------------+        |
|  |    PostCard     | |   UserCard      | | CommentSection  |        |
|  |   (Reusable)    | |   (Reusable)    | |   (Reusable)    |        |
|  +-----------------+ +-----------------+ +-----------------+        |
+---------------------------------------------------------------------+
                              |
                              v
+---------------------------------------------------------------------+
|                     Services Layer (api.js)                         |
|  +---------------------------------------------------------------+  |
|  |  Axios Instance -> Request Interceptor -> Response Handler    |  |
|  +---------------------------------------------------------------+  |
|                              |                                      |
|                              v                                      |
|  +---------------------------------------------------------------+  |
|  |            FastAPI Backend (localhost:8000)                   |  |
|  +---------------------------------------------------------------+  |
+---------------------------------------------------------------------+
```

### Design Principles

1. **Component Composition**: Small, reusable components composed into larger page components
2. **Prop Drilling with Callbacks**: Parent components pass callbacks to children for state updates
3. **Optimistic Updates**: UI updates immediately, then syncs with server
4. **Service Layer Abstraction**: All API calls abstracted into a single service file
5. **Token-based Authentication**: JWT tokens stored in localStorage, attached via interceptors

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI component library |
| Vite | 5.0.0 | Build tool and dev server |
| React Router DOM | 6.30.2 | Client-side routing |
| Axios | 1.13.2 | HTTP client |
| Tailwind CSS | 3.4.19 | Utility-first styling |
| Lucide React | 0.263.1 | Icon library |
| PostCSS | 8.5.4 | CSS processing |
| Autoprefixer | 10.4.21 | CSS vendor prefixing |

---

## Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── CommentSection.jsx # Comment display and input
│   │   ├── CreatePost.jsx     # Post creation modal
│   │   ├── Navbar.jsx         # Top navigation bar
│   │   ├── PostCard.jsx       # Individual post display
│   │   ├── Sidebar.jsx        # Left sidebar with user info
│   │   ├── Toast.jsx          # Toast notification component
│   │   └── UserCard.jsx       # User profile card (compact)
│   │
│   ├── pages/                 # Page-level components
│   │   ├── Explore.jsx        # User/content discovery
│   │   ├── Home.jsx           # Main feed page
│   │   ├── Login.jsx          # Authentication page
│   │   ├── Messages.jsx       # Direct messaging
│   │   ├── Notifications.jsx  # Activity notifications
│   │   ├── Profile.jsx        # User profile page
│   │   ├── Saved.jsx          # Saved posts collection
│   │   ├── Settings.jsx       # User settings
│   │   └── Trending.jsx       # Trending hashtags
│   │
│   ├── services/
│   │   └── api.js             # API service layer (all HTTP calls)
│   │
│   ├── App.jsx                # Root component with routing
│   ├── index.css              # Global styles and Tailwind directives
│   └── main.jsx               # Application entry point
│
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
└── vite.config.js             # Vite build configuration
```

---

## Folder Breakdown

### `/src/components/` - Reusable Components

This folder contains UI components that are used across multiple pages. Each component is self-contained with its own state management and event handlers.

### `/src/pages/` - Page Components

Page components represent full routes in the application. They typically:
- Fetch data on mount using `useEffect`
- Manage page-level state
- Compose multiple child components
- Handle user interactions and API calls

### `/src/services/` - Service Layer

Contains the API service module that abstracts all HTTP communication with the backend. This provides a clean interface for components to interact with the server.

---

## Core Components

### 1. App.jsx - Root Component

**Purpose**: Application root that handles authentication state and routing logic.

**Location**: `src/App.jsx`

**Major Imports**:
```javascript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './services/api';
```

**Key State**:
```javascript
const [currentUser, setCurrentUser] = useState(null);  // Authenticated user data
const [loading, setLoading] = useState(true);          // Auth check loading state
```

**Important Functions**:

| Function | Purpose |
|----------|---------|
| `checkAuth()` | Validates token on app load, fetches fresh user data |
| `handleLogin(user)` | Sets user state after successful login |
| `refreshUserStats()` | Re-fetches user data to update sidebar stats |
| `handleLogout()` | Clears auth data and resets state |
| `handleUserUpdate(user)` | Updates user state after profile changes |

**Data Flow**:
1. On mount, `checkAuth()` checks for token in localStorage
2. If token exists, fetches fresh user data from `/users/me`
3. User data includes stats (posts_count, followers_count, following_count)
4. `currentUser` is passed down to all child components as prop
5. `refreshUserStats` callback is passed to pages that modify follow relationships

**Routing Structure**:
```javascript
// Authenticated routes
<Route path="/home" element={<Home currentUser={currentUser} onRefreshStats={refreshUserStats} />} />
<Route path="/profile/:userId" element={<Profile currentUser={currentUser} onRefreshStats={refreshUserStats} />} />
<Route path="/notifications" element={<Notifications />} />
<Route path="/messages" element={<Messages currentUser={currentUser} />} />
<Route path="/explore" element={<Explore currentUser={currentUser} onRefreshStats={refreshUserStats} />} />
<Route path="/trending" element={<Trending currentUser={currentUser} />} />
<Route path="/saved" element={<Saved currentUser={currentUser} />} />
<Route path="/settings" element={<Settings currentUser={currentUser} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />} />

// Unauthenticated route
<Route path="/login" element={<Login onLogin={handleLogin} />} />
```

---

### 2. Navbar.jsx - Navigation Bar

**Purpose**: Fixed top navigation with search, notifications, messages, and user actions.

**Location**: `src/components/Navbar.jsx`

**Props**:
```javascript
{ user, notificationCount, messageCount, onLogout }
```

**Key State**:
```javascript
const [searchQuery, setSearchQuery] = useState('');
```

**Features**:
- Brand logo linking to home
- Search input (form submission ready)
- Notification bell with badge count
- Message icon with badge count
- User avatar linking to profile
- Logout button

**Data Flow**:
- Receives `user` prop from App.jsx
- Receives badge counts as props (currently hardcoded in App.jsx)
- Calls `onLogout` callback when logout clicked

---

### 3. Sidebar.jsx - Left Sidebar

**Purpose**: Displays user profile card and navigation links.

**Location**: `src/components/Sidebar.jsx`

**Props**:
```javascript
{ user }
```

**Navigation Items**:
```javascript
const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: `/profile/${user?.user_id}`, icon: User, label: 'Profile' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/trending', icon: Hash, label: 'Trending' },
  { path: '/saved', icon: Bookmark, label: 'Saved' },
  { path: '/settings', icon: Settings, label: 'Settings' }
];
```

**User Stats Displayed**:
- Posts count (`user.posts_count`)
- Followers count (`user.followers_count`)
- Following count (`user.following_count`)

**Styling Notes**:
- Fixed position, 250px width
- Uses `useLocation()` for active link highlighting
- Custom scrollbar via Tailwind class

---

### 4. PostCard.jsx - Post Display Component

**Purpose**: Renders individual posts with like, comment, save, and delete functionality.

**Location**: `src/components/PostCard.jsx`

**Props**:
```javascript
{ post, onLike, onComment, onDelete, onSave, currentUser }
```

**Key State**:
```javascript
const [showComments, setShowComments] = useState(false);   // Toggle comments visibility
const [liked, setLiked] = useState(post.is_liked || false); // Like state
const [saved, setSaved] = useState(post.is_saved || false); // Save state
const [likesCount, setLikesCount] = useState(post.likes_count || 0);
const [commentsCount, setCommentsCount] = useState(post.comments_count || 0);
const [showMenu, setShowMenu] = useState(false);           // Delete menu visibility
```

**Important Functions**:

| Function | Purpose |
|----------|---------|
| `handleLike()` | Optimistic update, calls `onLike` callback |
| `handleCommentSubmit(text)` | Calls `onComment`, increments count |
| `handleDelete()` | Confirmation dialog, calls `onDelete` |
| `handleSave()` | Optimistic update, calls `onSave` callback |

**Optimistic Update Pattern**:
```javascript
const handleLike = async () => {
  const prevLiked = liked;
  const prevCount = likesCount;

  // Optimistic update
  setLiked(!liked);
  setLikesCount(liked ? likesCount - 1 : likesCount + 1);

  try {
    const result = await onLike(post.post_id);
    if (result && result.success !== undefined) {
      setLiked(result.is_liked);
    }
  } catch (error) {
    // Rollback on error
    setLiked(prevLiked);
    setLikesCount(prevCount);
  }
};
```

**Media Handling**:
```javascript
// Handles both absolute URLs and relative paths
src={post.media.startsWith('http') ? post.media : `${API_BASE_URL}${post.media}`}
```

---

### 5. CreatePost.jsx - Post Creation Modal

**Purpose**: Modal dialog for creating new posts with text, hashtags, and image upload.

**Location**: `src/components/CreatePost.jsx`

**Props**:
```javascript
{ isOpen, onClose, onSubmit, currentUser }
```

**Key State**:
```javascript
const [postText, setPostText] = useState('');
const [hashtags, setHashtags] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
const [imagePreview, setImagePreview] = useState(null);
const [isUploading, setIsUploading] = useState(false);
const fileInputRef = useRef(null);
```

**Image Upload Flow**:
1. User clicks "Photo" button, triggering hidden file input
2. `handleImageSelect` validates file type and size (max 5MB)
3. FileReader creates preview via `readAsDataURL`
4. On submit, `uploadImage` API is called first
5. If upload succeeds, post is created with media URL

**Supported Image Types**:
- JPEG/JPG
- PNG
- GIF
- WebP

**Hashtag Parsing**:
```javascript
const hashtagsArray = hashtags
  .split(',')
  .map(tag => tag.trim().replace('#', ''))
  .filter(tag => tag.length > 0);
```

---

### 6. CommentSection.jsx - Comments Display

**Purpose**: Displays comments for a post and provides comment input.

**Location**: `src/components/CommentSection.jsx`

**Props**:
```javascript
{ postId, currentUser, onCommentSubmit }
```

**Key State**:
```javascript
const [comments, setComments] = useState([]);
const [newComment, setNewComment] = useState('');
const [loading, setLoading] = useState(true);
```

**API Calls**:
- `getComments(postId)` - Fetches comments on mount and after submission

**Data Flow**:
1. On mount, fetches comments via `loadComments()`
2. User types comment, stored in `newComment` state
3. On submit, calls `onCommentSubmit` callback
4. Refreshes comment list via `loadComments()`
5. Clears input field

---

### 7. UserCard.jsx - Compact User Display

**Purpose**: Displays user info with follow/unfollow button for suggested users.

**Location**: `src/components/UserCard.jsx`

**Props**:
```javascript
{ user, onFollow }
```

**Key State**:
```javascript
const [isFollowing, setIsFollowing] = useState(user.is_following || false);
const [isLoading, setIsLoading] = useState(false);
```

**Follow Toggle Pattern**:
```javascript
const handleFollow = async () => {
  setIsLoading(true);
  try {
    if (onFollow) {
      const result = await onFollow(user.user_id);
      if (result && result.success) {
        setIsFollowing(result.is_following);
      }
    }
  } catch (error) {
    console.error('Error following user:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

### 8. Toast.jsx - Notification Component

**Purpose**: Displays temporary notification messages.

**Location**: `src/components/Toast.jsx`

**Props**:
```javascript
{ message, type, onClose }
```

**Types**: `'success'` | `'error'`

**Behavior**:
- Auto-dismisses after 3 seconds
- Manual close via X button
- Different styling based on type

---

## Page Components

### 1. Login.jsx - Authentication Page

**Purpose**: Handles user login and registration.

**Location**: `src/pages/Login.jsx`

**Key State**:
```javascript
const [isLogin, setIsLogin] = useState(true);      // Toggle login/signup mode
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: ''
});
```

**Authentication Flow**:
1. On page load, clears old tokens from localStorage
2. User submits form
3. Calls `login()` or `register()` API
4. On success:
   - Stores token in localStorage
   - Stores user data in localStorage
   - Calls `debugToken()` to verify token
   - Calls `onLogin` callback
   - Navigates to `/home`
5. On failure, displays error message

**Props**:
```javascript
{ onLogin }  // Callback to App.jsx to set authenticated state
```

**API Calls**:
- `login(username, password)`
- `register(username, email, password)`
- `debugToken()` - Verification utility

---

### 2. Home.jsx - Main Feed

**Purpose**: Displays post feed, suggested users, and trending hashtags.

**Location**: `src/pages/Home.jsx`

**Props**:
```javascript
{ currentUser, onRefreshStats }
```

**Key State**:
```javascript
const [posts, setPosts] = useState([]);
const [suggestedUsers, setSuggestedUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [showCreatePost, setShowCreatePost] = useState(false);
const [toast, setToast] = useState(null);
```

**Data Loading**:
```javascript
const loadHomeData = async () => {
  const [postsData, usersData] = await Promise.all([
    getPosts(),
    getSuggestedUsers()
  ]);
  setPosts(postsData);
  setSuggestedUsers(usersData);
};
```

**Handler Functions**:

| Function | Purpose | API Call |
|----------|---------|----------|
| `handleCreatePost(data)` | Creates new post, refreshes feed | `createPost()`, `getPosts()` |
| `handleLikePost(postId)` | Toggles like on post | `likePost()` |
| `handleAddComment(postId, text)` | Adds comment to post | `addComment()` |
| `handleDeletePost(postId)` | Removes post from feed | `deletePost()` |
| `handleFollowUser(userId)` | Follows user, removes from suggested | `followUser()` |
| `handleSavePost(postId)` | Toggles save status | `savePost()` |

**Layout Structure**:
- Left: Main feed column with create post trigger and posts
- Right: Sidebar with suggested users and trending hashtags (desktop only)

---

### 3. Profile.jsx - User Profile

**Purpose**: Displays user profile with posts, stats, and follow functionality.

**Location**: `src/pages/Profile.jsx`

**Props**:
```javascript
{ currentUser, onRefreshStats }
```

**URL Params**:
```javascript
const { userId } = useParams();
```

**Key State**:
```javascript
const [user, setUser] = useState(null);
const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState('posts');  // posts | media | liked
const [isFollowing, setIsFollowing] = useState(false);
```

**Own Profile Detection**:
```javascript
const isOwnProfile = currentUser?.user_id === parseInt(userId);
```

**Data Loading**:
```javascript
const loadProfileData = async () => {
  const [userData, postsData] = await Promise.all([
    getUserProfile(parseInt(userId)),
    getUserPosts(parseInt(userId))
  ]);
  setUser(userData);
  setPosts(postsData);
  setIsFollowing(userData?.is_following || userData?.isFollowing || false);
};
```

**Follow Handler with Optimistic Update**:
```javascript
const handleFollow = async () => {
  const prevFollowing = isFollowing;
  setIsFollowing(!isFollowing);  // Optimistic

  const result = await followUser(parseInt(userId));
  if (result && result.success) {
    const updatedUser = await getUserProfile(parseInt(userId));
    setUser(updatedUser);
    setIsFollowing(result.is_following);
    onRefreshStats?.();  // Update sidebar
  } else {
    setIsFollowing(prevFollowing);  // Rollback
  }
};
```

**Tabs**:
- Posts: User's posts
- Media: Posts with images (placeholder)
- Liked: Liked posts (placeholder)

---

### 4. Messages.jsx - Direct Messaging

**Purpose**: Conversation list and chat interface.

**Location**: `src/pages/Messages.jsx`

**Key State**:
```javascript
const [conversations, setConversations] = useState([]);
const [selectedConversation, setSelectedConversation] = useState(null);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState('');
```

**API Calls**:
- `getMessages()` - Fetches conversation list
- `getConversation(userId)` - Fetches messages with specific user
- `sendMessage(receiverId, content)` - Sends new message

---

### 5. Settings.jsx - User Settings

**Purpose**: Account settings with profile editing.

**Location**: `src/pages/Settings.jsx`

**Props**:
```javascript
{ currentUser, onLogout, onUserUpdate }
```

**Sections**:
- Account (username, email, bio editing)
- Notifications (toggle settings)
- Help & Support (info)

**Profile Update Flow**:
1. User modifies form fields
2. On save, calls `updateProfile()`
3. Updates localStorage with new user data
4. Calls `onUserUpdate` callback to update App state

---

## Services Layer

### api.js - Complete API Service

**Purpose**: Centralizes all HTTP communication with the backend.

**Location**: `src/services/api.js`

**Base Configuration**:
```javascript
const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor** (Token Attachment):
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Response Interceptor** (Error Handling):
```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Logs error but does NOT redirect
    // Allows components to handle errors gracefully
    return Promise.reject(error);
  }
);
```

### API Function Categories

#### Authentication
| Function | Endpoint | Method | Returns |
|----------|----------|--------|---------|
| `login(username, password)` | `/auth/login` | POST | `{ success, user, token }` |
| `register(username, email, password)` | `/auth/register` | POST | `{ success, user, token }` |
| `logout()` | - | - | Clears localStorage, redirects |
| `debugToken()` | `/auth/debug-token` | POST | Token validation result |

#### Users
| Function | Endpoint | Method | Returns |
|----------|----------|--------|---------|
| `getCurrentUser()` | `/users/me` + `/users/{id}/stats` | GET | User with stats |
| `getUserProfile(userId)` | `/users/{id}` + `/users/{id}/stats` | GET | User with stats |
| `updateProfile(data)` | `/users/me` | PUT | `{ success, user }` |
| `getSuggestedUsers()` | `/users/?limit=5` | GET | User array |
| `searchUsers(query)` | `/users/?query={q}&limit=20` | GET | User array |

#### Posts
| Function | Endpoint | Method | Returns |
|----------|----------|--------|---------|
| `getPosts()` | `/posts/?limit=20` | GET | Post array (formatted) |
| `getUserPosts(userId)` | `/posts/user/{id}?limit=20` | GET | Post array (formatted) |
| `createPost(data)` | `/posts/` | POST | `{ success, post }` |
| `deletePost(postId)` | `/posts/{id}` | DELETE | `{ success }` |

#### Likes
| Function | Endpoint | Method | Returns |
|----------|----------|--------|---------|
| `likePost(postId)` | `/likes/post/{id}/check`, `/likes/`, `/likes/{id}` | GET/POST/DELETE | `{ success, is_liked }` |

#### Comments
| Function | Endpoint | Method | Returns |
|----------|----------|--------|---------|
| `getComments(postId)` | `/comments/post/{id}` | GET | Comment array (formatted) |
| `addComment(postId, text)` | `/comments/` | POST | `{ success, comment }` |

#### Follows
| Function | Endpoint | Method | Returns |
|----------|----------|--------|---------|
| `followUser(userId)` | `/follows/check/{id}`, `/follows/`, `/follows/{id}` | GET/POST/DELETE | `{ success, is_following }` |
| `checkFollowStatus(userId)` | `/follows/check/{id}` | GET | Boolean |
| `getFollowers(userId)` | `/follows/followers/{id}` | GET | User array |
| `getFollowing(userId)` | `/follows/following/{id}` | GET | User array |

#### Messages
| Function | Endpoint | Method | Returns |
|----------|----------|--------|---------|
| `getMessages()` | `/messages/conversations` | GET | Conversation array |
| `getConversation(userId)` | `/messages/conversation/{id}` | GET | Message array |
| `sendMessage(receiverId, content)` | `/messages/` | POST | `{ success, message }` |

#### Saved Posts
| Function | Endpoint | Method | Returns |
|----------|----------|--------|---------|
| `getSavedPosts()` | `/saved/` | GET | Post array |
| `savePost(postId)` | `/saved/toggle/{id}` | POST | `{ success, is_saved }` |
| `checkSavedStatus(postId)` | `/saved/check/{id}` | GET | Boolean |

#### File Upload
| Function | Endpoint | Method | Returns |
|----------|----------|--------|---------|
| `uploadImage(file)` | `/upload/image` | POST | `{ success, url, filename }` |

### Utility Functions

**Time Formatting**:
```javascript
function formatTimeAgo(dateString) {
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return date.toLocaleDateString();
}
```

---

## State Management

Pulse uses React's built-in state management without external libraries:

### State Categories

1. **Global State** (App.jsx)
   - `currentUser` - Authenticated user data
   - Passed down via props to all pages

2. **Page State** (Page components)
   - Data fetched on mount
   - Loading states
   - UI state (modals, tabs)

3. **Component State** (Reusable components)
   - Local UI state
   - Optimistic update states

### State Refresh Patterns

**Pattern 1: Callback Prop**
```javascript
// Parent passes callback
<Home currentUser={currentUser} onRefreshStats={refreshUserStats} />

// Child calls after action
const handleFollowUser = async (userId) => {
  const result = await followUser(userId);
  if (result.success && onRefreshStats) {
    onRefreshStats();  // Triggers parent state refresh
  }
};
```

**Pattern 2: Re-fetch on Action**
```javascript
const handleCreatePost = async (postData) => {
  await createPost(postData);
  const newPosts = await getPosts();  // Re-fetch all posts
  setPosts(newPosts);
};
```

**Pattern 3: Optimistic Update**
```javascript
const handleLike = async () => {
  const prev = liked;
  setLiked(!liked);  // Optimistic

  try {
    const result = await likePost(postId);
    setLiked(result.is_liked);  // Server truth
  } catch {
    setLiked(prev);  // Rollback
  }
};
```

---

## Authentication Flow

### Login Sequence

```
+-------------+     +-------------+     +-------------+     +-------------+
|   Login.jsx |---->|   api.js    |---->|   Backend   |---->| localStorage|
|             |     |   login()   |     | /auth/login |     |             |
+-------------+     +-------------+     +-------------+     +-------------+
       |                                        |                   |
       |                                        |                   |
       |<------------ { token, user } ----------|                   |
       |                                                           |
       |-------------- store token -------------------------------->|
       |                                                           |
       |-------------- store user --------------------------------->|
       |                                                           |
       v                                                           |
+-------------+                                                    |
|   App.jsx   |<------------- onLogin(user) -----------------------|
| setCurrentUser                                                   |
+-------------+
       |
       v
+-------------+
|   /home     |
|   Navigate  |
+-------------+
```

### Token Persistence

```javascript
// On login success
localStorage.setItem('token', response.token);
localStorage.setItem('user', JSON.stringify(response.user));

// On app load (App.jsx)
const token = localStorage.getItem('token');
const userData = localStorage.getItem('user');

if (token && userData) {
  const freshUserData = await getCurrentUser();  // Verify token still valid
  setCurrentUser(freshUserData);
}

// On logout
localStorage.removeItem('token');
localStorage.removeItem('user');
```

### Interceptor Token Attachment

Every API request automatically includes the token:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Data Flow Patterns

### Post Creation Flow

```
User Action          Component              API                  Backend
    |                   |                    |                      |
    |   Click Create    |                    |                      |
    |------------------>|                    |                      |
    |                   |                    |                      |
    |                   |  [If has image]    |                      |
    |                   |--uploadImage()---->|--/upload/image------>|
    |                   |<---------------------{ url }--------------|
    |                   |                    |                      |
    |                   |--createPost()----->|--/posts/------------>|
    |                   |<---------------------{ post }-------------|
    |                   |                    |                      |
    |                   |--getPosts()------->|--/posts/------------>|
    |                   |<---------------------[posts]--------------|
    |                   |                    |                      |
    |                   | setPosts(posts)    |                      |
    |                   | onRefreshStats()   |                      |
    |<--UI Updated------|                    |                      |
```

### Follow/Unfollow Flow

```
User Action          Component              API                  Backend
    |                   |                    |                      |
    |   Click Follow    |                    |                      |
    |------------------>|                    |                      |
    |                   |                    |                      |
    |                   | setIsFollowing     |                      |
    |                   | (optimistic)       |                      |
    |                   |                    |                      |
    |                   |--checkFollowStatus>|--/follows/check/{id}>|
    |                   |<----------------------{ is_following }----|
    |                   |                    |                      |
    |                   |  [If following]    |                      |
    |                   |--DELETE /follows/-->|---------------------->|
    |                   |  [If not following]|                      |
    |                   |--POST /follows/--->|---------------------->|
    |                   |                    |                      |
    |                   | setIsFollowing     |                      |
    |                   | (server value)     |                      |
    |                   |                    |                      |
    |                   | onRefreshStats()   |  (Update sidebar)    |
    |<--UI Updated------|                    |                      |
```

---

## Styling System

### Tailwind Configuration

**Custom Colors** (tailwind.config.js):
```javascript
colors: {
  dark: {
    bg: '#0a0a0a',       // Main background
    card: '#141414',     // Card backgrounds
    border: '#262626',   // Border color
    hover: '#1a1a1a',    // Hover states
  }
}
```

**Font Family**:
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
}
```

### Color Palette Usage

| Use Case | Color Class |
|----------|-------------|
| Page background | `bg-dark-bg` |
| Card background | `bg-dark-card` |
| Borders | `border-dark-border` |
| Hover states | `hover:bg-dark-hover` |
| Primary text | `text-neutral-50` |
| Secondary text | `text-neutral-400` |
| Muted text | `text-neutral-500` |
| Disabled text | `text-neutral-600` |
| Active button | `bg-neutral-50 text-neutral-900` |

### Custom Scrollbar

```css
.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-custom::-webkit-scrollbar-track {
  background: #1a1a1a;
}
.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 3px;
}
```

---

## API Integration

### Error Handling Strategy

The frontend uses a "graceful degradation" approach:

1. **API calls never force redirects** - The response interceptor logs errors but doesn't redirect
2. **Components handle their own errors** - Each component decides how to respond to failures
3. **Fallback data** - Components often fall back to cached/default data on failure

```javascript
// Example: User data with fallback
const freshUserData = await getCurrentUser();
if (freshUserData) {
  setCurrentUser(freshUserData);
} else {
  // Fallback to localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  setCurrentUser(user);
}
```

### Response Format Handling

The API service normalizes backend responses:

```javascript
// Login response normalization
return {
  success: true,
  user: response.data.user,
  token: response.data.access_token,  // Backend uses 'access_token'
};

// Follow status handling (supports both formats)
setIsFollowing(userData?.is_following || userData?.isFollowing || false);
```

---

## Known Challenges and Solutions

### Challenge 1: Stats Not Updating After Follow/Unfollow

**Problem**: Sidebar follower/following counts didn't update after follow actions.

**Root Cause**: App.jsx user state wasn't refreshed after follow actions in child components.

**Solution**:
1. Created `refreshUserStats()` function in App.jsx
2. Passed as `onRefreshStats` prop to relevant pages
3. Child components call `onRefreshStats()` after successful follow actions

```javascript
// App.jsx
const refreshUserStats = async () => {
  const freshUserData = await getCurrentUser();
  if (freshUserData) {
    setCurrentUser(freshUserData);
    localStorage.setItem('user', JSON.stringify(freshUserData));
  }
};

// Profile.jsx
const handleFollow = async () => {
  const result = await followUser(userId);
  if (result.success && onRefreshStats) {
    onRefreshStats();  // Refresh sidebar
  }
};
```

### Challenge 2: 401 Errors on Page Refresh

**Problem**: API calls failed with 401 after page refresh despite having a token.

**Root Cause**: Token wasn't being attached to requests properly.

**Solution**:
1. Added request interceptor to automatically attach tokens
2. Added console logging for debugging token flow
3. Ensured token is read fresh from localStorage on each request

```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Challenge 3: API Response Format Inconsistency

**Problem**: Frontend crashes when backend uses different field names.

**Root Cause**: Backend uses snake_case (`is_following`), some code expected camelCase.

**Solution**: Added fallback handling for both formats:
```javascript
setIsFollowing(userData?.is_following || userData?.isFollowing || false);
```

### Challenge 4: Image Upload Not Working

**Problem**: Post images couldn't be uploaded.

**Solution**:
1. Created dedicated `uploadImage()` function using FormData
2. Set proper `Content-Type: multipart/form-data` header
3. Backend created `/upload/image` endpoint with static file serving

```javascript
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });

  return { success: true, url: response.data.url };
};
```

### Challenge 5: Optimistic Updates Causing State Mismatch

**Problem**: UI showed incorrect state when API call failed after optimistic update.

**Solution**: Implemented rollback pattern:
```javascript
const handleLike = async () => {
  const prevLiked = liked;
  const prevCount = likesCount;

  setLiked(!liked);
  setLikesCount(liked ? likesCount - 1 : likesCount + 1);

  try {
    const result = await likePost(postId);
    setLiked(result.is_liked);
  } catch (error) {
    setLiked(prevLiked);
    setLikesCount(prevCount);
  }
};
```

---

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

### Environment Configuration

The API base URL is hardcoded in `api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

For production, this should be configured via environment variables.

### Available Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| dev | `vite` | Start development server |
| build | `vite build` | Create production build |
| preview | `vite preview` | Preview production build |
| lint | `eslint .` | Run ESLint |

---

## Component Dependency Graph

```
App.jsx
├── Navbar.jsx
├── Sidebar.jsx
└── Routes
    ├── Login.jsx
    ├── Home.jsx
    │   ├── PostCard.jsx
    │   │   └── CommentSection.jsx
    │   ├── CreatePost.jsx
    │   ├── UserCard.jsx
    │   └── Toast.jsx
    ├── Profile.jsx
    │   └── PostCard.jsx
    │       └── CommentSection.jsx
    ├── Messages.jsx
    ├── Notifications.jsx
    ├── Explore.jsx
    │   └── UserCard.jsx
    ├── Trending.jsx
    ├── Saved.jsx
    │   └── PostCard.jsx
    └── Settings.jsx
```

---

## File Size Reference

| File | Lines | Purpose |
|------|-------|---------|
| api.js | ~615 | Complete API service layer |
| App.jsx | ~150 | Root component with routing |
| Home.jsx | ~265 | Main feed page |
| Profile.jsx | ~260 | User profile page |
| PostCard.jsx | ~200 | Post display component |
| CreatePost.jsx | ~215 | Post creation modal |
| Login.jsx | ~250 | Authentication page |
| Settings.jsx | ~400 | User settings page |
| Sidebar.jsx | ~95 | Navigation sidebar |
| Navbar.jsx | ~95 | Top navigation |

---

## License

This frontend is part of the Pulse social media platform project.
