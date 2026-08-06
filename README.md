# Eduvise Graduate (EduviseSkills)

Eduvise Graduate is a modern, comprehensive educational platform featuring a microservices-based backend architecture and a responsive React frontend. It provides diagnostic assessments, a course marketplace, instructor dashboards, AI-driven course generation, and various analytics features.

## Architecture Overview

The system is designed with a service-oriented architecture using Docker Compose:

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **State Management**: Zustand, React Query (TanStack)
- **Routing**: React Router DOM v7
- **Features**: Data visualization (Recharts), Code editor integration (Monaco Editor), Diagramming (React Flow), PDF/Canvas exports (jspdf, html2canvas)

### Backend Services
The backend uses **Python & FastAPI (Uvicorn)** and is split into several microservices:
- `api-gateway` (Port 8000): Central entry point handling requests and routing them to respective services.
- `auth-service` (Port 8001): Manages user authentication, roles, and sessions.
- `course-service` (Port 8002): Manages courses, lessons, diagnostic assessments, and content generation.
- `ai-service` (Port 8003): Handles AI capabilities, integrations (Gemini, etc.), and intelligent content processing.
- `analytics-service` (Port 8004): Processes platform analytics and user performance metrics.

**Infrastructure**:
- **PostgreSQL**: Relational database for persistent storage (`eduviseskills` DB).
- **Redis**: Caching, session management, and potential message queuing.

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Docker & Docker Compose
- Python 3.10+ (for utility scripts)

### Running Locally (Docker Compose)

The easiest way to run the entire backend stack is via Docker Compose:

```bash
# Clone the repository
git clone https://github.com/berkaybnc/eduvise-graduate.git
cd eduvise-graduate

# Start all microservices and databases in detached mode
docker-compose up --build -d
```
You can also simply run the provided `baslat.bat` if on Windows.

### Running Frontend Locally

To start the Vite development server for the frontend UI:

```bash
cd frontend
npm install
npm run dev
```
The frontend will typically run on `http://localhost:5173`.

## Additional Tools & Scripts
The repository includes several helpful Python scripts in the root directory:
- `extract_docx.py`, `update_docx.py`: Scripts for processing Word documents.
- `take_screenshots.py`: Tool for automated UI screenshot capture.
- `replace_urls.py`: Utility for environment/URL manipulation.
- `test_flow.py`, `test_gemini.py`: Test scripts for verifying flows and AI API connections.

## Deployment Pipeline
This project is configured with continuous deployment workflows.
- Merging or pushing to the `main` branch automatically triggers the production deployment pipeline (GitHub Actions -> Google Cloud Run + Railway).
- **Rule**: Do NOT push directly to `master`. Only push/merge to `main` when ready to deploy.

## License
Proprietary. Do not distribute.
