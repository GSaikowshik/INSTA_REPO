# InstaRepo

> **The Developer's Career Workspace. Parse once, compile anywhere.**

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

InstaRepo is an open-source, centralized career infrastructure workspace built specifically for software engineers and technology professionals. Instead of re-entering work history, project details, and skills across multiple disparate tools, InstaRepo acts as a single source of truth database. Upload any existing resume PDF or image—InstaRepo uses multi-modal Gemini AI parsing to structure your career data, enabling you to instantly compile ATS-optimized vector PDFs, role-targeted cover letters, and 200+ distinct web portfolio configurations.

---

## 🚀 Core Features

- 🔑 **Clerk Authentication & Webhooks**: Seamless Google & OAuth SSO auth via Clerk. Real-time user synchronization (`user.created`, `user.updated`, `user.deleted`) with backend PostgreSQL database via Svix signature-verified webhooks.
- 📄 **AI Resume Ingestion & Builder**: Multi-modal PDF and image parsing powered by Google Gemini AI. Automatically structures work history, technical skills, education, and bullet-point achievements into a normalized database schema with granular live editing and vector PDF export.
- 🎨 **Combinatorial Web Portfolios**: Generate fully responsive developer portfolio websites from over 200 layout and color theme permutations (e.g. *Tokyo Minimal*, *Terminal Hacker*, *Ghost Slate*). Export self-contained single-file HTML packages with custom avatar cropping.
- 🎯 **ATS Match Scoring & Cover Letter Tailoring**: Quantify your resume's keyword alignment against specific job descriptions. Generate tailored cover letters aligned with ATS scanner guidelines.
- ⚡ **Dynamic Command Center**: High-contrast workspace dashboard providing dynamic Clerk profile integration, live identity avatar rendering, and full REST management over saved resume versions and portfolio configurations.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18, Vite
- **Authentication**: `@clerk/clerk-react`
- **Styling**: Tailwind CSS, Minimalist Linear / Geist Design System
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios

### **Backend**
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with AsyncSQLAlchemy & Alembic
- **Drivers**: `asyncpg`, `psycopg2-binary`
- **Webhook Processing**: Svix (`svix`)
- **Schemas**: Pydantic v2
- **Authentication**: Clerk JWT Verification with PyJWT
- **Server**: Uvicorn

### **AI & Ingestion**
- **LLM Parser**: Google Gemini API (`google-genai`)
- **Document Processing**: PyMuPDF (`fitz`), Pillow (`PIL`), `pdf2image`

---

## ⚙️ Getting Started & Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.11+ recommended)
- **PostgreSQL** instance
- **Clerk Account** (for authentication API keys)

---

### 1. Clone the Repository
```bash
git clone https://github.com/GSaikowshik/INSTA_REPO.git
cd INSTA_REPO
```

---

### 2. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux/macOS:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env
```

#### Environment Variables (`backend/.env`)
Create a `.env` file in the `backend` directory:
```env
PROJECT_NAME="InstaRepo API"
API_V1_STR="/api/v1"
SECRET_KEY="your-secure-random-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# PostgreSQL Connection String
DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/insta_repo"

# Google Gemini AI Key
GEMINI_API_KEY="your_gemini_api_key_here"

# Clerk Webhook Signing Secret (from Clerk Dashboard -> Webhooks -> Signing Secret)
CLERK_WEBHOOK_SIGNING_SECRET="whsec_your_clerk_webhook_signing_secret"

# Production Frontend Origin for CORS
FRONTEND_URL="http://localhost:5173"
```

#### Run Backend Server
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI API documentation will be available at `http://127.0.0.1:8000/docs`.

---

### 3. Frontend Setup (React + Vite)
Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local
```

#### Environment Variables (`frontend/.env.local`)
Create a `.env.local` file in the `frontend` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_API_URL=http://localhost:8000
```

#### Start Vite Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## 🌐 Production Deployment Guide

### Deploying Frontend to **Vercel**
1. Import `frontend` repository folder into Vercel.
2. Set Build Command to `npm run build` and Output Directory to `dist`.
3. Configure Environment Variables in Vercel Dashboard:
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk Publishable Key (`pk_live_...` or `pk_test_...`)
   - `VITE_API_URL`: Your deployed Render backend URL (e.g., `https://your-backend.onrender.com`)
4. SPA routing is pre-configured via [`frontend/vercel.json`](file:///c:/Users/KOWSHIK/OneDrive/Desktop/projects/vibecoding/InstaRepo_2/frontend/vercel.json).

### Deploying Backend to **Render**
1. Create a **Web Service** on Render connected to the `backend` directory.
2. Set Build Command: `pip install -r requirements.txt`
3. Set Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Configure Environment Variables in Render Dashboard:
   - `DATABASE_URL`: Render PostgreSQL connection string (`postgresql+asyncpg://...`)
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `CLERK_WEBHOOK_SIGNING_SECRET`: Your Clerk webhook signing secret (`whsec_...`)
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)

---

## 📁 Repository Structure

```
InstaRepo_2/
├── backend/
│   ├── alembic/             # Database migrations
│   ├── app/
│   │   ├── api/             # REST API routers & Webhook endpoints (/auth, /profile, /resumes, /portfolios, /webhooks)
│   │   ├── core/            # Database configuration, security, & Clerk auth deps
│   │   ├── models/          # SQLAlchemy Models (User, Profile, Resume, PortfolioModel)
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Gemini AI parser engine & PyMuPDF extractors
│   ├── main.py              # FastAPI application entrypoint
│   └── requirements.txt
├── frontend/
│   ├── public/              # Static assets and demo media
│   ├── src/
│   │   ├── components/      # UI components (Dashboard, InstaRepoDashboardLayout, Sidebar, ProfileManagement, etc.)
│   │   ├── pages/           # Page routes (LandingPage, DashboardOverview, PortfolioGenerator, Profile, etc.)
│   │   ├── utils/           # Theme matrix engine & helpers
│   │   ├── api.js           # Dynamic Axios client with Clerk auth headers
│   │   ├── App.jsx
│   │   └── main.jsx         # ClerkProvider root entrypoint
│   ├── vercel.json          # Vercel SPA rewrite configuration
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 👤 Author

**Gandikota Sai Kowshik**
- **GitHub**: [@GSaikowshik](https://github.com/GSaikowshik)
- **Email**: saikowshikgandikota@gmail.com

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.