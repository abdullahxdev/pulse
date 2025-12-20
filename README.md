# Pulse - Social Media Platform

A modern, full-stack social media web application built with React and FastAPI. Pulse enables users to connect, share posts, follow other users, exchange messages, and explore trending content in a clean, minimalistic interface.

<img width="1919" height="991" alt="Screenshot 2025-12-19 003323" src="https://github.com/user-attachments/assets/7a5cb6e8-6752-49b9-bca5-762997a00c91" />


<img width="1907" height="991" alt="Screenshot 2025-12-19 011251" src="https://github.com/user-attachments/assets/0fd83137-a47f-45d6-8175-a8749894e5c4" />


<img width="1900" height="991" alt="image" src="https://github.com/user-attachments/assets/f5e91f40-e0f2-4874-87f1-64963e532b6d" />


<img width="1903" height="991" alt="Screenshot 2025-12-19 011205" src="https://github.com/user-attachments/assets/bb8e3998-c313-4ec9-93eb-e3c44e13b0c7" />


<img width="1900" height="992" alt="Screenshot 2025-12-19 011227" src="https://github.com/user-attachments/assets/aba76f7e-efea-45c9-9969-b628b36be3a2" />



## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Key Functional Workflows](#key-functional-workflows)
- [API Documentation](#api-documentation)
- [Known Challenges and Solutions](#known-challenges-and-solutions)
- [Contributing](#contributing)

---

## Project Overview

Pulse is a social media platform designed to provide users with a streamlined experience for sharing content and connecting with others. The application prioritizes simplicity, performance, and a clean user interface while delivering all essential social networking features.

### Core Purpose

The platform solves the need for a lightweight, modern social networking application that:

- Provides real-time social interactions without unnecessary complexity
- Offers a distraction-free, minimalistic user interface
- Maintains data persistence and synchronization across sessions
- Delivers responsive performance on modern web browsers

---

## Key Features

### Authentication System
- User registration with email validation
- Secure login with JWT-based authentication
- Session persistence across browser refreshes
- Automatic token management and renewal

### Post Management
- Create text posts with optional media attachments
- Image upload support (JPG, PNG, GIF, WebP)
- Hashtag support for content categorization
- Like, comment, and save functionality
- Post deletion for content owners

### Follow System
- Follow and unfollow other users
- Real-time follower and following counts
- Suggested users based on network activity
- Profile-level follow status indicators

### Messaging
- Direct messaging between users
- Conversation history persistence
- Real-time message synchronization
- Unread message indicators

### User Profiles
- Customizable user profiles
- Bio and profile information editing
- Post history on profile pages
- Follower and following statistics

### Explore and Discovery
- Search functionality for users and content
- Trending hashtags section
- Explore page for content discovery
- User suggestions based on activity

### Saved Posts
- Bookmark posts for later viewing
- Persistent saved posts collection
- Easy access to saved content

### Notifications
- Activity notifications for interactions
- Mark as read functionality
- Notification filtering options

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI component framework |
| Vite | 5.0.0 | Build tool and dev server |
| React Router DOM | 6.30.2 | Client-side routing |
| Axios | 1.13.2 | HTTP client for API calls |
| Tailwind CSS | 3.4.19 | Utility-first CSS framework |
| Lucide React | 0.263.1 | Icon library |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| FastAPI | 0.115.5 | Web framework for API |
| SQLAlchemy | 2.0.36 | ORM for database operations |
| PostgreSQL | - | Primary database |
| Pydantic | 2.10.3 | Data validation |
| Python-Jose | 3.3.0 | JWT token handling |
| Passlib | 1.7.4 | Password hashing |
| Uvicorn | 0.32.1 | ASGI server |

### Database

- **PostgreSQL**: Primary relational database for all persistent data
- **SQLAlchemy ORM**: Object-relational mapping for database interactions

### Authentication

- **JWT (JSON Web Tokens)**: Stateless authentication mechanism
- **BCrypt**: Password hashing algorithm
- **Bearer Token**: Authorization header format

---

## Architecture Overview

Pulse follows a client-server architecture with clear separation between frontend and backend responsibilities.

```
+------------------+         +------------------+         +------------------+
|                  |  HTTP   |                  |   SQL   |                  |
|  React Frontend  | <-----> |  FastAPI Backend | <-----> |   PostgreSQL     |
|  (Vite Dev)      |  REST   |  (Uvicorn)       |         |   Database       |
|                  |         |                  |         |                  |
+------------------+         +------------------+         +------------------+
      |                             |
      |                             |
      v                             v
+------------------+         +------------------+
| Local Storage    |         | Static Files     |
| (Token, User)    |         | (Uploads)        |
+------------------+         +------------------+
```

### Communication Flow

1. **Frontend to Backend**: All API communication uses REST endpoints over HTTP
2. **Authentication Flow**:
   - User submits credentials
   - Backend validates and returns JWT token
   - Frontend stores token in localStorage
   - Subsequent requests include token in Authorization header
3. **Data Persistence**:
   - Database serves as the single source of truth
   - Frontend fetches fresh data on component mount
   - State updates are synchronized through API calls

### Request Flow

```
User Action -> React Component -> API Service (axios) -> FastAPI Router ->
SQLAlchemy ORM -> PostgreSQL -> Response -> Component State Update -> UI Re-render
```

---

## Project Structure

```
pulse/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page-level components
│   │   ├── services/         # API service layer
│   │   ├── App.jsx           # Root component
│   │   ├── main.jsx          # Application entry point
│   │   └── index.css         # Global styles
│   ├── package.json          # Frontend dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   └── vite.config.js        # Vite configuration
│
├── backend/                  # FastAPI backend application
│   ├── app/
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── routers/          # API route handlers
│   │   ├── schemas/          # Pydantic validation schemas
│   │   ├── utils/            # Utility functions
│   │   ├── config.py         # Application configuration
│   │   ├── database.py       # Database connection setup
│   │   └── main.py           # FastAPI application entry
│   ├── uploads/              # Uploaded media files
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
│
└── README.md                 # This file
```

### Frontend Responsibility

The frontend handles:
- User interface rendering and interactions
- Client-side routing and navigation
- Form validation and user feedback
- API communication and response handling
- Local state management
- Authentication token storage

### Backend Responsibility

The backend handles:
- API endpoint definitions and routing
- Business logic implementation
- Database operations and queries
- Authentication and authorization
- File upload handling
- Data validation and sanitization

---

## Setup and Installation

### Prerequisites

- Node.js 18.x or higher
- Python 3.11 or higher
- PostgreSQL 14.x or higher
- Git

### Clone the Repository

```bash
git clone https://github.com/yourusername/pulse.git
cd pulse
```

### Backend Setup

1. Create and activate a virtual environment:

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

2. Install Python dependencies:

```bash
pip install -r requirements.txt
```

3. Create the `.env` file with required environment variables (see below)

4. Initialize the database:

```bash
python create_tables.py
```

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install Node.js dependencies:

```bash
npm install
```

---

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/pulse_db

# JWT Configuration
SECRET_KEY=your-secret-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS Configuration
CORS_ORIGINS=http://localhost:5173

# Application Settings
APP_NAME=Pulse Social Media API
APP_VERSION=1.0.0
DEBUG=True
```

### Environment Variable Descriptions

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Secret key for JWT token signing |
| `ALGORITHM` | JWT signing algorithm (default: HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time in minutes |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated) |
| `DEBUG` | Enable debug mode for development |

---

## Running the Application

### Start the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

API documentation is auto-generated at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend application will be available at `http://localhost:5173`

### Production Build

```bash
cd frontend
npm run build
npm run preview
```

---

## Key Functional Workflows

### User Signup/Login Flow

1. User navigates to login page
2. User enters credentials (username/password) or registration details
3. Frontend sends POST request to `/auth/login` or `/auth/register`
4. Backend validates credentials and returns JWT token with user data
5. Frontend stores token in localStorage
6. Frontend redirects user to home page
7. All subsequent API requests include the token in Authorization header

### Creating a Post

1. User clicks "Create Post" button
2. Modal opens with text input and media upload option
3. If media is attached, image is uploaded via `/upload/image` endpoint
4. Post data (text, hashtags, media URL) is sent to `/posts/` endpoint
5. Backend creates post record and returns post data
6. Frontend refreshes post feed to show new content

### Following a User

1. User views another user's profile or user card
2. User clicks "Follow" button
3. Frontend checks current follow status via `/follows/check/{userId}`
4. Frontend sends POST to `/follows/` (follow) or DELETE to `/follows/{userId}` (unfollow)
5. Backend creates/removes follow record in database
6. Frontend updates UI and refreshes user statistics

### Messaging Flow

1. User navigates to Messages page
2. Frontend fetches conversations via `/messages/conversations`
3. User selects a conversation
4. Frontend fetches message history via `/messages/conversation/{userId}`
5. User types and sends message
6. Frontend sends POST to `/messages/` with receiver_id and content
7. Message appears in conversation view

### Profile Update Flow

1. User navigates to Settings page
2. User modifies profile fields (username, email, bio)
3. User clicks "Save Changes"
4. Frontend sends PUT request to `/users/me`
5. Backend validates and updates user record
6. Frontend updates local state and localStorage with new user data

---

## API Documentation

The backend provides a comprehensive REST API. Full documentation is available at `/docs` when running the server.

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Authenticate user |
| GET | `/users/me` | Get current user |
| GET | `/users/{id}` | Get user profile |
| PUT | `/users/me` | Update current user |
| GET | `/posts/` | Get posts feed |
| POST | `/posts/` | Create new post |
| DELETE | `/posts/{id}` | Delete post |
| POST | `/follows/` | Follow user |
| DELETE | `/follows/{id}` | Unfollow user |
| GET | `/messages/conversations` | Get conversations |
| POST | `/messages/` | Send message |
| GET | `/notifications/` | Get notifications |
| POST | `/upload/image` | Upload image file |

---

## Known Challenges and Solutions

### Challenge 1: Data Not Persisting After Page Refresh

**Problem**: User data and statistics were lost when the page was refreshed.

**Cause**: The application relied too heavily on client-side state without proper synchronization with the backend.

**Solution**: Implemented a data fetching strategy where components fetch fresh data from the backend on mount. The `getCurrentUser` function now fetches user data with statistics from the server rather than relying solely on localStorage.

### Challenge 2: Follow/Unfollow Not Reflecting in UI

**Problem**: Following or unfollowing a user did not update the follower counts immediately.

**Cause**: The frontend was not refreshing user statistics after follow actions.

**Solution**: Added a `refreshUserStats` callback that is passed to components and called after follow/unfollow actions to update the sidebar and profile statistics.

### Challenge 3: Authentication Token Issues (401 Errors)

**Problem**: API requests were failing with 401 Unauthorized errors intermittently.

**Cause**: Token was not being properly attached to requests, or tokens were expiring without proper handling.

**Solution**:
- Implemented axios interceptors to automatically attach tokens to all requests
- Added proper error handling in the response interceptor
- Ensured tokens are stored immediately after login and cleared on logout

### Challenge 4: Image Upload Not Working

**Problem**: Media upload showed "coming soon" and images could not be attached to posts.

**Cause**: The upload endpoint and frontend integration were not implemented.

**Solution**:
- Created `/upload/image` endpoint in the backend
- Implemented `uploadImage` function in the frontend API service
- Added multipart/form-data handling for file uploads
- Configured static file serving for uploaded images

### Challenge 5: API Response Format Inconsistency

**Problem**: Frontend components crashed due to unexpected API response formats.

**Cause**: Backend responses used different field names (e.g., `is_following` vs `isFollowing`).

**Solution**: Standardized API response formats and added fallback handling in the frontend to accept both naming conventions where necessary.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

### Code Standards

- Frontend: Follow React best practices and ESLint configuration
- Backend: Follow PEP 8 style guide for Python code
- Commit messages: Use conventional commit format
- Documentation: Update relevant README files for significant changes

---

## Author

**Muhammad Abdullah**
- GitHub: [@abdullahxdev](https://github.com/abdullahxdev)
- LinkedIn: [Muhammad Abdullah](https://linkedin.com/in/mabdullahxdev)
- Email: abdullahisdev@gmail.com

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Support

For issues and feature requests, please open an issue on GitHub.

For detailed technical documentation, see:
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
