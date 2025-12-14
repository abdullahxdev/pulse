# 💙 Pulse - Social Media Platform

A modern, minimalistic social media web application built with **React**, **Tailwind CSS**, **FastAPI**, and **PostgreSQL**.

## 🌟 Features

- **User Authentication** - Login/Signup with JWT tokens
- **Posts Feed** - Create, view, like, and comment on posts
- **User Profiles** - View and edit user profiles
- **Follow System** - Follow/unfollow users
- **Real-time Notifications** - Get notified about likes, comments, follows
- **Direct Messaging** - Send private messages to other users
- **Stories** - Share temporary 24-hour stories
- **Hashtags** - Tag posts with hashtags
- **Dark Theme** - Modern, eye-friendly dark interface with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React** 18.x - UI framework
- **Tailwind CSS** 3.4+ - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP requests
- **Lucide React** - Modern icons

### Backend (Coming Soon)
- **FastAPI** - REST API framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **JWT** - Authentication

## 📁 Project Structure

```
pulse-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Top navigation bar
│   │   ├── Sidebar.jsx             # Left sidebar navigation
│   │   ├── PostCard.jsx            # Individual post component
│   │   ├── CreatePost.jsx          # Create post modal
│   │   ├── UserCard.jsx            # User profile card component
│   │   ├── CommentSection.jsx      # Comments display and input
│   │   ├── StoryViewer.jsx         # Stories carousel
│   │   └── NotificationItem.jsx    # Single notification component
│   ├── pages/
│   │   ├── Login.jsx               # Login and signup page
│   │   ├── Home.jsx                # Main feed page
│   │   ├── Profile.jsx             # User profile page
│   │   ├── Notifications.jsx       # Notifications page
│   │   └── Messages.jsx            # Direct messages page
│   ├── services/
│   │   └── api.js                  # API calls and mock data
│   ├── App.jsx                     # Main app component with routing
│   ├── index.js                    # React entry point
│   └── index.css                   # Tailwind directives and global styles
├── tailwind.config.js              # Tailwind configuration
├── package.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:8000` (optional for now)

### Installation

npm create vite@latest frontend -- --template react
cd frontend

# Install dependencies
npm install
npm install react-router-dom axios lucide-react
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind
npx tailwindcss init -p

# Copy all your files from artifacts (use updated index.css and tailwind.config.js above)

# Run with Vite
npm run dev

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0",
  "lucide-react": "^0.263.1",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.16",
  "postcss": "^8.4.32"
}
```

### Install all at once:
```bash
npm install react-router-dom axios lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## 🎨 Design System

### Colors (Tailwind Custom Theme)
```javascript
colors: {
  primary: {
    DEFAULT: '#3b82f6',  // bg-primary
    hover: '#2563eb',    // bg-primary-hover
  },
  dark: {
    bg: '#0f172a',       // bg-dark-bg
    card: '#1e293b',     // bg-dark-card
    border: '#334155',   // border-dark-border
    hover: '#475569',    // bg-dark-hover
  },
}
```

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Tailwind Utilities Used
- Layout: `flex`, `grid`, `max-w-*`, `gap-*`
- Spacing: `p-*`, `m-*`, `space-*`
- Colors: `bg-*`, `text-*`, `border-*`
- Typography: `text-*`, `font-*`, `leading-*`
- Effects: `rounded-*`, `shadow-*`, `hover:*`, `transition-*`
- Responsive: `md:*`, `lg:*`

## 🔌 API Integration

Currently using **mock data** for development. To connect to the real backend:

1. Update `src/services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost:8000/api';
   ```

2. Replace mock functions with real API calls

3. Ensure backend is running on port 8000

### API Endpoints (Backend Required)

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /posts` - Get all posts
- `POST /posts` - Create new post
- `GET /users/{id}` - Get user profile
- `POST /posts/{id}/like` - Like a post
- `POST /posts/{id}/comments` - Add comment
- `GET /notifications` - Get notifications
- `GET /messages` - Get messages

## 🧪 Current Features (Mock Data)

✅ Login/Signup UI  
✅ Home feed with posts  
✅ Like and comment on posts  
✅ User profile view  
✅ Notifications list  
✅ Messages interface  
✅ Create post modal  
✅ Stories viewer  
✅ Follow/unfollow users  
✅ Responsive design  
✅ Dark theme with Tailwind  

## 🔜 Coming Soon

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Image/video uploads
- [ ] Search functionality
- [ ] User settings page
- [ ] Hashtag pages
- [ ] Explore page
- [ ] Message read receipts

## 📝 Code Structure

### Components
Each component is **simple and self-contained**:
- Clear prop definitions
- Easy-to-read JSX with Tailwind classes
- Inline comments for understanding
- Reusable across pages

### Styling with Tailwind
- **Utility-first approach** - Direct styling in JSX
- **Custom theme** - Configured in `tailwind.config.js`
- **No separate CSS files** - Everything in component files
- **Responsive design** - Using Tailwind breakpoints

### State Management
- Using React `useState` and `useEffect`
- Simple context for user authentication
- No complex state libraries (easy for viva!)

## 🎓 For Viva/Demo

### Key Points to Explain:

1. **Component Architecture**
   - Reusable components (PostCard, UserCard)
   - Props passing
   - State management with useState

2. **Routing**
   - React Router for navigation
   - Protected routes (needs authentication)
   - Dynamic routes (user profiles)

3. **Tailwind CSS**
   - Utility-first approach
   - Custom theme configuration
   - Responsive design with breakpoints
   - No separate CSS files needed

4. **API Integration**
   - Mock data structure
   - How to replace with real API
   - Error handling

5. **Best Practices**
   - Component separation
   - Code organization
   - Clean code principles
   - Modern React patterns

## 🐛 Troubleshooting

### Common Issues:

**Port already in use:**
```bash
npx kill-port 3000
```

**Tailwind styles not working:**
- Check `index.css` has `@tailwind` directives
- Verify `tailwind.config.js` is configured correctly
- Restart development server

**Dependencies not installing:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Page not loading:**
- Check if development server is running
- Check browser console for errors
- Ensure all imports are correct

## 👥 Team Members

- [Your Name] - Frontend Development
- [Team Member 2] - Backend Development
- [Team Member 3] - Database Design

## 📄 License

This project is created for educational purposes as part of CSC336 - Web Technologies course.

## 🙏 Acknowledgments

- Font: [Google Fonts - Poppins](https://fonts.google.com/specimen/Poppins)
- Icons: [Lucide React](https://lucide.dev/)
- CSS Framework: [Tailwind CSS](https://tailwindcss.com/)
- Inspiration: Modern social media platforms

---

**Built with ❤️ using React + Tailwind CSS**

**Project Name:** Pulse Social Media Platform  
**Course:** CSC336 - Web Technologies  
**Semester:** Fall 2025