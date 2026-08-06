# Eduvise Graduate

Eduvise Graduate is a comprehensive web application designed for graduate students and educators. It provides tools for diagnostic assessment, marketplace features, and more.

## Project Structure

- `frontend/`: Contains the React-based frontend application (Vite/Next.js/React).
- `backend/`: Contains the backend services and APIs.
- `services/`: Additional microservices or background workers.
- `presentation/`: Presentation materials and HTML slides.
- `docker-compose.yml`: Docker composition for running the services locally.

## Prerequisites

- Node.js
- Docker & Docker Compose
- Python 3.x (for various utility scripts)

## Getting Started

To get started with the project locally:

1. Clone the repository and navigate to the root directory.
2. Ensure Docker Desktop is running.
3. Start the services using Docker Compose or the provided batch script:
   ```bash
   docker-compose up -d
   ```
   Or run the `baslat.bat` script.

## Frontend

Navigate to the `frontend/` directory to run the development server:
```bash
cd frontend
npm install
npm run dev
```

## Backend

Navigate to the `backend/` directory to set up the backend environment and run the server. Check the backend README for more specific instructions if available.

## Deployment

This repository uses continuous deployment. Pushing to the `main` branch will trigger the deployment process via GitHub Actions.

> **Note:** Only push to the `main` branch when you are ready to deploy.

## Scripts

- `replace_urls.py`, `take_screenshots.py`, `update_docx.py`, `extract_docx.py`: Utility Python scripts for various administrative and data extraction tasks.
- `test_flow.py`, `test_gemini.py`: Test scripts.

## License

This project is proprietary and confidential.
