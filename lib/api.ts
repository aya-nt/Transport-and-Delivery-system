const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Generic fetch function
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error:', response.status, errorText);
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  // DELETE requests return 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// Shipments API
export const shipmentsApi = {
  getAll: () => apiFetch('/shipments/'),
  getById: (id: number) => apiFetch(`/shipments/${id}/`),
  create: (data: any) => apiFetch('/shipments/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch(`/shipments/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  partialUpdate: (id: number, data: any) => apiFetch(`/shipments/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch(`/shipments/${id}/`, {
    method: 'DELETE',
  }),
};

// Clients API
export const clientsApi = {
  getAll: () => apiFetch('/clients/'),
  getById: (id: number) => apiFetch(`/clients/${id}/`),
  create: (data: any) => apiFetch('/clients/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch(`/clients/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch(`/clients/${id}/`, {
    method: 'DELETE',
  }),
};

// Drivers API
export const driversApi = {
  getAll: () => apiFetch('/drivers/'),
  getById: (id: number) => apiFetch(`/drivers/${id}/`),
  create: (data: any) => apiFetch('/drivers/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch(`/drivers/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch(`/drivers/${id}/`, {
    method: 'DELETE',
  }),
};

// Vehicles API
export const vehiclesApi = {
  getAll: () => apiFetch('/vehicles/'),
  getById: (id: number) => apiFetch(`/vehicles/${id}/`),
  create: (data: any) => apiFetch('/vehicles/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch(`/vehicles/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch(`/vehicles/${id}/`, {
    method: 'DELETE',
  }),
};

// Destinations API
export const destinationsApi = {
  getAll: () => apiFetch('/destinations/'),
};

// Service Types API
export const serviceTypesApi = {
  getAll: () => apiFetch('/service-types/'),
};

// Invoices API
export const invoicesApi = {
  getAll: () => apiFetch('/invoices/'),
  getById: (id: number) => apiFetch(`/invoices/${id}/`),
  create: (data: any) => apiFetch('/invoices/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch(`/invoices/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Incidents API
export const incidentsApi = {
  getAll: () => apiFetch('/incidents/'),
  create: (data: any) => apiFetch('/incidents/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch(`/incidents/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Dashboard Stats API
export const dashboardApi = {
  getStats: async () => {
    const [shipments, incidents, invoices] = await Promise.all([
      shipmentsApi.getAll(),
      incidentsApi.getAll(),
      invoicesApi.getAll(),
    ]);
    
    const activeStatuses = ['IN_TRANSIT', 'SORTING_CENTER', 'OUT_FOR_DELIVERY'];
    const activeDeliveries = shipments.filter((s: any) => activeStatuses.includes(s.status));
    const pendingShipments = shipments.filter((s: any) => s.status === 'PENDING');
    const inTransitShipments = shipments.filter((s: any) => s.status === 'IN_TRANSIT');
    const openIncidents = incidents.filter((i: any) => i.status === 'OPEN');
    
    const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount_ttc || 0), 0);
    
    return {
      totalShipments: shipments.length,
      activeDeliveries: activeDeliveries.length,
      incidents: openIncidents.length,
      revenue: totalRevenue.toFixed(2),
      pendingCount: pendingShipments.length,
      inTransitCount: inTransitShipments.length,
    };
  },
};

// User API
export const userApi = {
  getMe: () => apiFetch('/users/me/'),
  update: (data: any) => apiFetch('/users/me/', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
};

// Tours API
export const toursApi = {
  getAll: () => apiFetch('/tours/'),
  getById: (id: number) => apiFetch(`/tours/${id}/`),
  create: (data: any) => apiFetch('/tours/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiFetch(`/tours/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiFetch(`/tours/${id}/`, {
    method: 'DELETE',
  }),
};
