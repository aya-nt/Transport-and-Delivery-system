# Start both backend (Django) and frontend (Next.js) concurrently
Write-Host "Starting Transport & Delivery System..." -ForegroundColor Green

# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; python manage.py runserver" -WindowStyle Minimized

# Start frontend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Minimized

Write-Host "Backend: http://127.0.0.1:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C in each window to stop services." -ForegroundColor Yellow
