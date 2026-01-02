# Transport & Delivery Management System

## Project Structure

- `app/`: Next.js Frontend
- `backend/`: Django Backend

## Getting Started

### Backend (Django)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
# Windows
    ```bash
    .\venv\Scripts\activate
    ```

### Admin Console

1. Create a superuser account:
    ```bash
    python manage.py createsuperuser
    ```
    Follow the prompts to set username, email, and password.

2. Access the admin console:
    ```bash
    python manage.py runserver
    ```
    Navigate to `http://localhost:8000/admin/` and log in with your superuser credentials.

3. Manage users, shipments, and other resources through the Django admin interface.

   .\venv\Scripts\activate
   # Linux/Macsss
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the server:
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/`.

### Frontend (Next.js)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## Features

- **Dashboard**: Visual statistics for Claims, Revenue, and Shipment Status.
- **Logistics Management**: Manage Clients, Drivers, Vehicles, Destinations, and Service Types.
- **Shipments**: Create and track shipments with automatic cost calculation.
- **Invoicing**: Generate invoices with TVA calculation and payment tracking.
