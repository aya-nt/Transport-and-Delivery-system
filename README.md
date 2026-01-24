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


## Using the Map in Tracking

The tracking feature uses Google Maps to display shipment locations and routes. To use this feature after cloning the repository:

### Frontend Setup

1. Make sure you're in the root directory:
 

2. If you encounter a "Module not found: Can't resolve '@react-google-maps/api'" error:
   ```bash
   npm cache clean --force
   npm install
   ```

3. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000/dashboard/tracking`.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Activate the virtual environment:
   ```bash
   # Windows
   .\venv\Scripts\activate
   # Linux/Mac
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

### Accessing the Tracking Map

1. Open your browser and go to `http://localhost:3000`
2. Log in with your credentials
3. Navigate to **Dashboard** → **Tracking**
4. The map will display:
   - **Origin address** (shipment starting point)
   - **Destination address** (shipment delivery point)
   - **Driver location** (current driver position in real-time)
   - **Route directions** between locations
