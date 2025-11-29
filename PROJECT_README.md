# Brownbag Monorepo Project

A full-stack monorepo application with React frontend and Express backend, following Feature-Driven Development (FDD) architecture.

## Project Structure

```
brownbag/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── features/         # Feature-based modules (FDD)
│   │   │   ├── auth/         # Authentication feature
│   │   │   │   ├── api/      # Auth API calls
│   │   │   │   ├── components/ # Auth components
│   │   │   │   ├── hooks/    # Auth hooks
│   │   │   │   ├── pages/    # Auth pages
│   │   │   │   ├── types/    # Auth TypeScript types
│   │   │   │   └── index.ts  # Feature exports
│   │   │   └── user/         # User feature
│   │   │       ├── api/      # User API calls
│   │   │       ├── components/ # User components
│   │   │       ├── hooks/    # User hooks
│   │   │       ├── pages/    # User pages
│   │   │       ├── types/    # User TypeScript types
│   │   │       └── index.ts  # Feature exports
│   │   ├── shared/           # Shared utilities
│   │   │   ├── api/          # API client
│   │   │   └── types/        # Shared types
│   │   └── App.tsx           # Main app component
│   └── package.json
├── backend/                  # Express backend application
│   ├── src/
│   │   └── index.ts          # Main server file
│   └── package.json
├── nginx/                    # Nginx configuration
│   └── nginx.conf            # Reverse proxy config
├── start.sh                  # Startup script for all services
└── stop.sh                   # Shutdown script for all services
```

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tool and dev server
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **ESLint** with Airbnb configuration
- **Prettier** for code formatting
- **Feature-Driven Development (FDD)** architecture

### Backend
- **Express 5** with TypeScript
- **Faker.js** for generating fake user data
- **CORS** enabled for cross-origin requests
- **dotenv** for environment configuration

### Infrastructure
- **Nginx** as reverse proxy
- **Bash scripts** for easy startup/shutdown of all services

## Features

### Authentication
- Login page with Material UI
- Accepts any credentials (mock authentication)
- JWT token generation
- Automatic redirect after login

### User Information
- User profile display with avatar
- Personal information cards
- Work information display
- Address information
- Activity tracking (join date, last login)
- Logout functionality

### API Endpoints

#### POST /api/login
Login endpoint that accepts any credentials.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "string",
  "username": "string"
}
```

#### GET /api/user/info
Get user information with fake data.

**Query Parameters:**
- `username`: User's username

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "avatar": "string",
  "phone": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "company": "string",
  "jobTitle": "string",
  "bio": "string",
  "joinedDate": "string",
  "lastLogin": "string"
}
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Nginx (optional, for production setup)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Brownbag
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Install backend dependencies**
```bash
cd ../backend
npm install
```

### Running the Application

#### Option 1: All Services with One Command (Recommended)

**Start all services:**
```bash
./start.sh
```

This will start:
- Backend on http://localhost:3001
- Frontend on http://localhost:5173
- Nginx on http://localhost (port 80)

**Stop all services:**
```bash
./stop.sh
```

**View logs:**
```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log

# Nginx logs
tail -f nginx.log
```

#### Option 2: Run Services Separately (Development)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

**Terminal 3 - Nginx (Optional):**
```bash
nginx -c $(pwd)/nginx/nginx.conf -p $(pwd)/nginx/
# Access application at http://localhost
```

## Development

### Frontend Development

**Available Scripts:**
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

**Adding a New Feature:**
1. Create feature directory in `src/features/`
2. Add subdirectories: `api/`, `components/`, `hooks/`, `pages/`, `types/`
3. Create feature components and logic
4. Export feature from `index.ts`
5. Import and use in `App.tsx`

### Backend Development

**Available Scripts:**
- `npm run dev` - Start dev server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server

**Adding a New Endpoint:**
1. Define route in `src/index.ts`
2. Add request/response types
3. Use Faker.js for mock data if needed

## Architecture Decisions

### Feature-Driven Development (FDD)
The frontend follows FDD principles where each feature is self-contained:
- **Modularity**: Each feature has its own components, hooks, API, and types
- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Clear separation of concerns
- **Reusability**: Features can be easily ported or extracted

### Type Safety
- Separate type definition files for each feature
- Shared types in `shared/types` for cross-feature use
- Strict TypeScript configuration

### CORS Solution
- Nginx reverse proxy routes all traffic through port 80
- Frontend requests to `/api/*` are proxied to backend
- No CORS issues in development or production

## Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=development
```

## Code Style

### ESLint
- Airbnb configuration
- TypeScript support
- React hooks rules
- Prettier integration

### Prettier
- Single quotes
- 2-space indentation
- Trailing commas (ES5)
- 100 character line width

## License

ISC

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linter and formatter
4. Create a pull request

## Automated Testing

### Login Flow Testing with Email Notifications

This project includes automated testing for the login flow using Playwright MCP (Model Context Protocol) with automatic email notifications.

#### Overview

The `/test-login` command performs the following:
1. Navigates to the login page at http://localhost:5173
2. Takes a screenshot of the initial login page
3. Fills in the login form with test credentials
4. Takes a screenshot of the filled form
5. Submits the form and navigates to the user profile page
6. Takes a screenshot of the user profile
7. **Automatically sends an email** with all screenshots attached

#### Setup Email Notifications

1. **Copy the environment template:**
```bash
cp .env.example .env
```

2. **Configure Gmail credentials in `.env`:**
```env
GMAIL_SENDER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
TEST_EMAIL_RECIPIENT=recipient@example.com
```

3. **Generate Gmail App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Generate the password and copy it to `.env`

#### Running Tests

**Using the slash command:**
```bash
/test-login
```

This will:
- Execute the complete login flow test
- Capture 3 screenshots in `.playwright-mcp/.playwright-mcp/`
- Send an email with HTML-formatted results and attached screenshots
- Display success/failure status

#### Email Contents

Each test email includes:
- **Subject:** "Login Flow Test Results - [timestamp]"
- **Body:** HTML-formatted test summary with:
  - Execution timestamp
  - Test steps performed
  - Results summary
- **Attachments:**
  - `01-login-page.png` - Initial login page
  - `02-filled-login-form.png` - Form with test credentials
  - `03-user-profile-page.png` - User profile after successful login

#### Test Credentials

The automated test uses:
- Username: `testuser123`
- Password: `password456`

(Note: The application accepts any credentials as it uses mock authentication)

#### Files

- `.claude/commands/test-login.md` - Slash command definition
- `.claude/scripts/send-test-email.py` - Email sending script
- `.env.example` - Configuration template
- `.env` - Your actual credentials (git-ignored)

#### Troubleshooting

**Email not sending:**
- Verify Gmail credentials in `.env`
- Ensure App Password is correct (not your regular Gmail password)
- Check that 2-factor authentication is enabled on your Google account

**Screenshots not found:**
- Ensure the application is running on http://localhost:5173
- Check that `.playwright-mcp/` directory exists
- Verify Playwright MCP is properly configured

## Documentation

See additional documentation:
- [Session Log](./SESSION_LOG.md) - Detailed interaction history
- [Claude Instructions](./CLAUDE_INSTRUCTIONS.md) - Context for Claude sessions
- [User Prompts](./USER_PROMPTS.md) - Chronological prompt history
