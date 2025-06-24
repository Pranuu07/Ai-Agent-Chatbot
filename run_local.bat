
@echo off
echo Starting AI Chat Application Locally...
echo.

echo Setting up Python Backend...
cd backend
echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting FastAPI Backend Server...
start "Backend Server" cmd /k "python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

cd..
echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo.
echo Press any key to exit...
pause > nul
