# InstaRepo

> **The Developer's Career Workspace. Parse once, compile anywhere.**

[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

InstaRepo is an open-source, centralized career infrastructure workspace built specifically for software engineers and technology professionals. Instead of re-entering work history, project details, and skills across multiple disparate tools, InstaRepo acts as a single source of truth database. Upload any existing resume PDF or image—InstaRepo uses multi-modal Gemini AI parsing to structure your career data, enabling you to instantly compile ATS-optimized vector PDFs, role-targeted cover letters, and 200+ distinct web portfolio configurations.

---

## 🚀 Core Features

- 📄 **AI Resume Ingestion & Builder**: Multi-modal PDF and image parsing powered by Google Gemini AI. Automatically structures work history, technical skills, education, and bullet-point achievements into a normalized database schema with granular live editing and vector PDF export.
- 🎨 **Combinatorial Web Portfolios**: Generate fully responsive developer portfolio websites from over 200 layout and color theme permutations (e.g. *Tokyo Minimal*, *Terminal Hacker*, *Ghost Slate*). Export self-contained single-file HTML packages with custom avatar cropping.
- 🎯 **ATS Match Scoring & Cover Letter Tailoring**: Quantify your resume's keyword alignment against specific job descriptions. Generate tailored cover letters aligned with ATS scanner guidelines.
- ⚡ **Dynamic Command Center**: High-contrast, Linear-style workspace dashboard providing instant REST management (`POST`, `GET`, `DELETE`) over saved resume versions and portfolio configurations.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 18, Vite
- **Styling**: Tailwind CSS, Minimalist Linear / Geist Design System
- **Icons**: Lucide React
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios

### **Backend**
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL with AsyncSQLAlchemy & Alembic
- **Schemas**: Pydantic v2
- **Authentication**: OAuth2 JWT Tokens with Passlib / Bcrypt
- **Server**: Uvicorn

### **AI & Ingestion**
- **LLM Parser**: Google Gemini 2.5 API (`google-genai`)
- **Document Processing**: PyMuPDF (`fitz`), Pillow (`PIL`), pdf2image

---

## ⚙️ Getting Started & Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **Python** (v3.11+ recommended)
- **PostgreSQL** or SQLite instance

### 1. Clone the Repository
```bash
git clone https://github.com/GSaikowshik/INSTA_REPO.git
cd INSTA_REPO
```

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

# Create .env file
cp .env.example .env
```

#### Environment Variables (`backend/.env`)
Create a `.env` file in the `backend` root with the following keys:
```env
PROJECT_NAME="InstaRepo API"
SECRET_KEY="your-super-secret-jwt-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Database Connection String
DATABASE_URL="postgresql+asyncpg://postgres:password@localhost:5432/instarepo"

# Google Gemini AI Key
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
```

#### Run Backend Server
```bash
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI API documentation will be available at `http://127.0.0.1:8000/docs`.

---

### 3. Frontend Setup (React + Vite)
Open a new terminal tab or window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The application will launch at `http://localhost:5173`.

---

## 📁 Repository Structure

```
InstaRepo_2/
├── backend/
│   ├── app/
│   │   ├── api/             # REST API routers (/auth, /profile, /resumes, /portfolios)
│   │   ├── core/            # Database configuration, security, & auth deps
│   │   ├── models/          # SQLAlchemy Models (User, Profile, Resume, PortfolioModel)
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Gemini AI parser engine & PyMuPDF extractors
│   ├── main.py              # FastAPI application entrypoint
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (ResumePreview, InstaRepoDashboardLayout, etc.)
│   │   ├── pages/           # Page routes (LandingPage, DashboardOverview, PortfolioGenerator, etc.)
│   │   ├── utils/           # Theme matrix engine & helpers
│   │   ├── App.jsx
│   │   └── main.jsx
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