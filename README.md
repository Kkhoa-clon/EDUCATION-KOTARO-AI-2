# EDUCATION KOTARO AI

## Project Description
EDUCATION KOTARO AI is a comprehensive educational platform focused on science and astronomy, built with React (frontend) and Node.js (backend). The project provides learning materials, quizzes, AI chatbot, and NASA API integration to explore the universe. This is the improved 2025 version of the project, featuring a modern user interface and interactive learning features.

## Key Features

### 🏫 Learning Library
- **Chemistry**: Materials and lectures on elements and chemical reactions
- **Physics**: Basic and advanced physical concepts
- **Biology**: Knowledge about organisms, cells, genetics
- **Scientific Research**: Research methods and experiments
- **HSG Exam Preparation**: Study materials for gifted students

### 🌌 Astronomy
- **Solar System**: Explore planets and satellites
- **Earth**: Images and data about the blue planet
- **Asteroids**: Information about the asteroid belt
- **Other Planets**: Exoplanets and other star systems
- **NASA Images**: Collection of astronomical images from NASA
- **Mars Robots**: Information about Mars exploration missions

### 🤖 AI Chatbot
- Intelligent AI assistant "Trợ lý Sen AI tỉnh Đồng Tháp"
- Supports answering questions about science, math, physics, chemistry
- Integrated with Ollama to run local AI models
- Modern chat interface with markdown support
- Supports copy, regenerate, and feedback for responses

### 📝 Quiz System
- Integrated with OpenTDB API to fetch multiple-choice questions
- Supports various topics: science, history, geography, entertainment, etc.
- Difficulty levels: easy, medium, hard
- Automatic translation of questions to Vietnamese
- Interactive quiz interface with instant feedback

### 🧪 Virtual Laboratory
- **Lab 2D**: 2D virtual laboratory
- **VR/AR**: Virtual reality and augmented reality technology (iframe from separate project)

### 📧 Other Features
- **Send Email**: Contact system with reCAPTCHA protection
- **NASA API Integration**: Fetch rover data and images from NASA
- **Responsive Design**: Compatible with all devices

## Installation

### System Requirements
- Node.js >= 18.0.0
- npm >= 9.0.0
- (Optional) Ollama for local AI chatbot

### Installation Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd education-kotaro-ai-better
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm run install:all
   ```

3. Create `.env` file in the `backend` directory:
   ```env
   # Email configuration (for email feature)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   CONTACT_EMAIL=contact@education-kotaro-ai.com

   # NASA API (optional)
   NASA_API_KEY=your-nasa-api-key

   # reCAPTCHA (optional)
   RECAPTCHA_SECRET=your-recaptcha-secret

   # Port configuration
   PORT=5000
   HOST=0.0.0.0
   ```

4. (Optional) Install and run Ollama for chatbot:
   ```bash
   # Download and install Ollama from https://ollama.ai
   ollama pull qwen2.5-coder:7b  # or other model
   ollama serve
   ```

## Running the Project

### Run in development mode
```bash
# Run both frontend and backend simultaneously
npm run dev
```

### Run separately
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Build for production
```bash
# Build both frontend and backend
npm run build

# Build separately
npm run build:backend
npm run build:frontend
```

## Project Structure

```
education-kotaro-ai-better/
├── backend/                          # Backend Node.js
│   ├── routes/
│   │   ├── email.js                 # Email sending API
│   │   ├── nasa.js                  # NASA API integration
│   │   └── quiz.js                  # Quiz generation API
│   ├── package.json
│   └── server.js                    # Main server
├── frontend/                         # Frontend React
│   ├── public/
│   │   └── assets/                  # Static assets
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Chatbot.tsx         # Chatbot component
│   │   │   ├── Header.tsx          # Header component
│   │   │   └── Footer.tsx          # Footer component
│   │   ├── pages/                   # Pages
│   │   │   ├── Home.tsx            # Home page
│   │   │   ├── Quiz.tsx            # Quiz page
│   │   │   ├── VR-AR.tsx           # VR/AR page
│   │   │   └── ...                 # Other pages
│   │   ├── services/
│   │   │   └── api.ts              # API service layer
│   │   ├── theme/                  # Material-UI theme
│   │   └── utils/                  # Utilities
│   ├── package.json
│   └── vite.config.ts               # Vite configuration
├── package.json                     # Root package.json
└── README.md
```

## Technologies Used

### Frontend
- **React 18**: JavaScript framework for UI
- **TypeScript**: Type-safe JavaScript
- **Material-UI (MUI)**: Component library
- **React Router**: Client-side routing
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **React Markdown**: Render markdown
- **React Syntax Highlighter**: Code highlighting

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Nodemailer**: Email sending
- **Axios**: HTTP requests
- **CORS**: Cross-origin resource sharing
- **Dotenv**: Environment variables

### APIs & Services
- **NASA API**: Astronomical data and images
- **OpenTDB**: Trivia question database
- **Google Translate API**: Question translation
- **Ollama**: Local AI model serving
- **reCAPTCHA**: Spam protection

## API Endpoints

### Backend APIs
- `GET /health` - Health check
- `POST /api/email/send` - Send contact email
- `GET /api/nasa/rovers` - Get NASA rover list
- `GET /api/nasa/photos` - Get images from rover
- `POST /api/quiz/generate` - Generate quiz questions

### Frontend Routes
- `/` - Home
- `/chatbot` - AI Chatbot
- `/thu-vien/*` - Learning Library
- `/thien-van/*` - Astronomy
- `/quiz` - Quiz
- `/lab/lab2d` - 2D Laboratory
- `/vr-ar` - VR/AR Experience
- `/lien-he` - Contact

## Contributing

We welcome all contributions! Please follow these steps:

1. Fork the project
2. Create a new branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add some AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Create a Pull Request

### Contribution Rules
- Follow the current code style
- Write clear commit messages
- Test thoroughly before submitting PR
- Update documentation if needed

## Development Team

### Đỗ Nguyễn Đăng Khoa
- **Role**: Front End Developer
- **School**: THPT Long Khanh A, Đồng Tháp
- **Skills**: HTML, CSS, JavaScript, React, Node.js, TypeScript, C++, Python

### Nguyễn Văng Ngọc Tiến
- **Role**: Back End Developer
- **School**: THPT Long Khanh A, Đồng Tháp
- **Skills**: HTML, CSS, JavaScript, React, Node.js, TypeScript, C++, Python

## Version History

- **v1.0.0 (2024)**: Initial version - Natural Science Website
- **v2.0.0 (2025)**: EDUCATION KOTARO AI - Added chatbot and NASA integration
- **v3.0.0 (2026)**: EDUCATION KOTARO AI BETTER - Current version with improved UI
