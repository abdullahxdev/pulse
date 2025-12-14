# 💙 Pulse - Social Media Platform (Frontend)

A modern, responsive social media frontend built with **React**, **Vite**, and **Tailwind CSS**. Features a sleek dark theme interface with posts, comments, messaging, stories, and user profiles.

## 📝 Short Description

**Pulse** is a contemporary social media platform frontend that enables users to connect, share posts with hashtags, interact through likes and comments, follow other users, send direct messages, and share temporary stories. Built with React and Tailwind CSS, it offers a responsive dark-themed interface optimized for seamless user experience across all devices.

## 🔖 GitHub Short Description (2 lines)

```
A modern social media platform frontend built with React, Vite & Tailwind CSS. 
Features dark theme UI, posts, comments, messaging, stories, and user profiles with full responsive design.
```

---

## 🌟 Features

### ✅ Implemented (Frontend)
- **User Authentication UI** - Beautiful login and signup pages
- **Dynamic Feed** - Scrollable feed with post cards
- **Post Management** - Create, view, and delete posts with text and hashtags
- **Engagement System** - Like and comment on posts with live updates
- **User Profiles** - Profile pages with user info, stats, and posts
- **Follow System** - Follow/unfollow users interface
- **Direct Messaging** - One-on-one messaging interface
- **Notifications** - Notification center with read/unread filters
- **Stories** - Story viewer carousel component
- **Hashtag Display** - Hashtag tags on posts and trending section
- **Suggested Users** - User recommendation cards
- **Dark Theme** - Modern dark UI with smooth animations
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Mock Data** - Built-in mock API for testing frontend

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - Modern UI library with hooks
- **Vite** 5.0+ - Lightning-fast build tool and dev server
- **Tailwind CSS** 3.4+ - Utility-first CSS framework for styling
- **React Router DOM** 6.20+ - Client-side routing and navigation
- **Axios** 1.6+ - HTTP client for future API integration
- **Lucide React** 0.263+ - Beautiful modern icon library

---

## 📁 Project Structure

```
pulse-frontend/
├── public/
│   └── index.html            # HTML entry point
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Navbar.jsx        # Top navigation bar
│   │   ├── Sidebar.jsx       # Left sidebar navigation
│   │   ├── PostCard.jsx      # Individual post component
│   │   ├── CommentSection.jsx # Comments display & input
│   │   ├── CreatePost.jsx    # Create post modal
│   │   ├── UserCard.jsx      # User profile card
│   │   ├── StoryViewer.jsx   # Stories carousel
│   │   └── NotificationItem.jsx # Single notification
│   ├── pages/                # Main page components
│   │   ├── Login.jsx         # Login & signup page
│   │   ├── Home.jsx          # Main feed page
│   │   ├── Profile.jsx       # User profile page
│   │   ├── Notifications.jsx # Notifications page
│   │   └── Messages.jsx      # Direct messages page
│   ├── services/
│   │   └── api.js            # API calls & mock data
│   ├── App.jsx               # Main app with routing
│   ├── index.js              # React entry point
│   └── index.css             # Tailwind & global styles
├── tailwind.config.js        # Tailwind configuration
├── vite.config.js            # Vite configuration
├── package.json              # Dependencies
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pulse-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## 📦 Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0",
  "lucide-react": "^0.263.1"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```

### Install All at Once
```bash
npm install react react-dom react-router-dom axios lucide-react
npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

---

## 🎨 Design System

### Custom Tailwind Colors
```javascript
colors: {
  primary: {
    DEFAULT: '#3b82f6',  // Bright blue
    hover: '#2563eb',    // Darker blue
  },
  dark: {
    bg: '#0f172a',       // Dark navy background
    card: '#1e293b',     // Card background
    border: '#334155',   // Border color
    hover: '#475569',    // Hover state
  },
}
```

### Typography
- **Font Family:** Poppins (Google Fonts)
- **Font Weights:** 300, 400, 500, 600, 700

### Key Tailwind Classes Used
- **Layout:** `flex`, `grid`, `gap-*`, `max-w-*`
- **Colors:** `bg-dark-bg`, `bg-primary`, `text-slate-50`
- **Spacing:** `p-*`, `m-*`, `px-*`, `py-*`
- **Borders:** `rounded-xl`, `border-dark-border`
- **Effects:** `hover:*`, `transition-all`, `animate-*`
- **Responsive:** `lg:*`, `md:*`, `sm:*`

---

## 🔌 Current API Setup

The app currently uses **mock data** from `src/services/api.js` for demonstration purposes.

### Mock Features Working:
- User login/signup (any credentials work)
- Viewing posts feed
- Creating posts
- Liking posts
- Adding comments
- Following users
- Sending messages
- Viewing notifications

### When Backend is Ready:
1. Update `API_BASE_URL` in `src/services/api.js`
2. Replace mock functions with real API calls
3. Handle authentication tokens properly

---

## 📱 Pages & Components

### Pages
1. **Login** (`/login`) - Authentication page with toggle between login/signup
2. **Home** (`/home`) - Main feed with posts, stories, and suggested users
3. **Profile** (`/profile/:userId`) - User profile with posts and stats
4. **Notifications** (`/notifications`) - Notification center with filters
5. **Messages** (`/messages`) - Direct messaging interface

### Key Components
1. **Navbar** - Fixed top navigation with search and icons
2. **Sidebar** - Left navigation with user profile and menu
3. **PostCard** - Displays individual posts with like/comment
4. **CreatePost** - Modal for creating new posts
5. **CommentSection** - Shows and adds comments
6. **StoryViewer** - Horizontal scrolling stories
7. **UserCard** - User suggestion card with follow button
8. **NotificationItem** - Single notification display

---

## 🎯 Features Breakdown

### Authentication Flow
- Login/Signup with form validation
- JWT token stored in localStorage
- Protected routes (redirect to login if not authenticated)
- Logout functionality

### Post Features
- Create posts with text and hashtags
- View posts in chronological feed
- Like/unlike posts with count
- Comment on posts
- Delete own posts
- Hashtag tagging and display

### User Interactions
- View user profiles
- Follow/unfollow users
- See follower/following counts
- Send direct messages
- View message conversations

### Notifications
- Like notifications
- Comment notifications  
- Follow notifications
- Filter by all/unread/read
- Mark as read functionality

---

## 🧪 Available Scripts

```bash
# Start development server (runs on port 5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🎓 Code Structure Highlights

### Simple & Clean Code
- Each component is self-contained
- Clear prop definitions
- Easy-to-read JSX with Tailwind classes
- Well-commented for understanding
- No complex state management

### Best Practices
- Component reusability
- Proper file organization
- Consistent naming conventions
- Responsive design patterns
- Modern React hooks usage

---

## 📸 Screenshots

> Add screenshots of your app here after running it!

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
npx kill-port 5173
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tailwind styles not working
- Verify `tailwind.config.js` exists
- Check `index.css` has `@tailwind` directives
- Restart dev server

### Page not loading
- Check browser console for errors
- Ensure all files are in correct locations
- Verify all imports are correct

---

## 🔜 Future Enhancements

- [ ] Backend API integration with FastAPI
- [ ] Real-time updates with WebSockets
- [ ] Image/video upload functionality
- [ ] Search users and posts
- [ ] Hashtag pages with filtered posts
- [ ] User settings page
- [ ] Dark/Light theme toggle
- [ ] Email notifications
- [ ] Post bookmarking
- [ ] Share posts functionality

---

## 👥 Team

- **Muhammad Abdullah** - Frontend Development

---

## 📄 License

This project is created for educational purposes as part of **CSC336 - Web Technologies** course.

---

## 🙏 Acknowledgments

- **Font:** [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
- **Icons:** [Lucide React](https://lucide.dev/)
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Inspiration:** Modern social media platforms (Twitter, Instagram, Facebook)

---

## 📞 Contact

For any queries or suggestions, feel free to reach out!

---

**Built with ❤️ using React, Vite & Tailwind CSS**

**Course:** CSC336 - Web Technologies  
**Semester:** Fall 2025  
**Institution:** COMSATS University Islamabad