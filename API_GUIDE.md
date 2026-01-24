# API Integration Guide

## What is an API?
An API (Application Programming Interface) lets your frontend (Next.js) talk to your backend (Django). Think of it like a waiter in a restaurant:
- Frontend = Customer (asks for data)
- API = Waiter (delivers requests)
- Backend = Kitchen (prepares data)

## How It Works

### 1. Environment Setup
File: `.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
This tells your frontend where the backend is located.

### 2. API Service
File: `lib/api.ts`
This file contains functions to communicate with the backend:

```typescript
// Get all clients
clientsApi.getAll()

// Get one client by ID
clientsApi.getById(1)

// Create new client
clientsApi.create({ name: "John", email: "john@example.com" })
```

### 3. Using API in Pages

**Before (Hardcoded Data):**
```typescript
const [clients] = useState([
  { id: 1, name: "John" },
  { id: 2, name: "Jane" }
])
```

**After (Real API Data):**
```typescript
const [clients, setClients] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  async function fetchClients() {
    try {
      const data = await clientsApi.getAll()
      setClients(data)
    } catch (error) {
      console.error('Failed to fetch clients:', error)
    } finally {
      setLoading(false)
    }
  }
  fetchClients()
}, [])
```

## Available APIs

All APIs are in `lib/api.ts`:

- `shipmentsApi` - Manage shipments
- `clientsApi` - Manage clients
- `driversApi` - Manage drivers
- `vehiclesApi` - Manage vehicles
- `destinationsApi` - Get destinations
- `serviceTypesApi` - Get service types
- `invoicesApi` - Manage invoices
- `incidentsApi` - Manage incidents
- `dashboardApi` - Get dashboard statistics

## Example: Clients Page

I've already updated the clients page (`app/(dashboard)/clients/page.tsx`) to use real API data.

**What changed:**
1. Import the API: `import { clientsApi } from "@/lib/api"`
2. Add loading state: `const [loading, setLoading] = useState(true)`
3. Fetch data on page load using `useEffect`
4. Show loading message while fetching
5. Display real data from backend

## Testing

1. **Start Backend:**
   ```bash
   cd backend
   .\venv\Scripts\activate
   python manage.py runserver
   ```
   Backend runs at: http://localhost:8000

2. **Start Frontend:**
   ```bash
   npm run dev
   ```
   Frontend runs at: http://localhost:3000

3. **Test:**
   - Go to http://localhost:3000/clients
   - You should see clients from your Django database
   - If empty, add clients via Django admin: http://localhost:8000/admin

## Next Steps

To connect other pages, follow the same pattern:
1. Import the API function
2. Add loading state
3. Use `useEffect` to fetch data
4. Update the UI to show real data

Need help with a specific page? Let me know!
