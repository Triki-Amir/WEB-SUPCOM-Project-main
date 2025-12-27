/**
 * API Service
 * 
 * Centralized service for all API calls to the backend.
 * Handles authentication, error handling, and request/response formatting.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Generic API request handler with authentication
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Authentication Services
 */
export const authService = {
  /**
   * Login user
   */
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register new user
   */
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('auth_token');
  },

  /**
   * Save authentication token
   */
  saveToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },
};

/**
 * Vehicle Services
 */
export const vehicleService = {
  /**
   * Get all vehicles with optional filters
   */
  getAll: async (filters?: {
    type?: string;
    available?: boolean;
    station?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.available !== undefined) queryParams.append('available', String(filters.available));
    if (filters?.station) queryParams.append('station', filters.station);
    
    const query = queryParams.toString();
    return apiRequest(`/vehicles${query ? `?${query}` : ''}`);
  },

  /**
   * Get vehicle by ID
   */
  getById: async (id: string) => {
    return apiRequest(`/vehicles/${id}`);
  },

  /**
   * Create new vehicle (admin only)
   */
  create: async (vehicleData: any) => {
    return apiRequest('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  /**
   * Update vehicle (admin only)
   */
  update: async (id: string, vehicleData: any) => {
    return apiRequest(`/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  },

  /**
   * Delete vehicle (admin only)
   */
  delete: async (id: string) => {
    return apiRequest(`/vehicles/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Booking Services
 */
export const bookingService = {
  /**
   * Get user's bookings
   */
  getMyBookings: async () => {
    return apiRequest('/bookings');
  },

  /**
   * Create new booking
   */
  create: async (bookingData: {
    vehicleId: string;
    startDate: string;
    endDate: string;
    pickupStationId: string;
    returnStationId: string;
  }) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  /**
   * Cancel booking
   */
  cancel: async (id: string) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  /**
   * Get all bookings (admin only)
   */
  getAll: async () => {
    return apiRequest('/bookings/all');
  },
};

/**
 * Station Services
 */
export const stationService = {
  /**
   * Get all stations
   */
  getAll: async () => {
    return apiRequest('/stations');
  },

  /**
   * Get station by ID
   */
  getById: async (id: string) => {
    return apiRequest(`/stations/${id}`);
  },

  /**
   * Create new station (admin only)
   */
  create: async (stationData: {
    name: string;
    city: string;
    address: string;
    phone: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
    openingHours?: string;
  }) => {
    return apiRequest('/stations', {
      method: 'POST',
      body: JSON.stringify(stationData),
    });
  },

  /**
   * Update station (admin only)
   */
  update: async (id: string, stationData: any) => {
    return apiRequest(`/stations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(stationData),
    });
  },

  /**
   * Toggle station status (admin only)
   */
  toggle: async (id: string) => {
    return apiRequest(`/stations/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  /**
   * Delete station (admin only)
   */
  delete: async (id: string) => {
    return apiRequest(`/stations/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Incident Services
 */
export const incidentService = {
  /**
   * Get user's incidents
   */
  getMyIncidents: async () => {
    return apiRequest('/incidents');
  },

  /**
   * Report new incident
   */
  report: async (incidentData: {
    bookingId: string;
    description: string;
    severity: string;
  }) => {
    return apiRequest('/incidents', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  },

  /**
   * Get all incidents (admin only)
   */
  getAll: async () => {
    return apiRequest('/incidents/all');
  },

  /**
   * Update incident status (admin only)
   */
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/incidents/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

/**
 * User Services
 */
export const userService = {
  /**
   * Get all users (admin only)
   */
  getAll: async () => {
    return apiRequest('/users');
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    return apiRequest('/users/me');
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: any) => {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
};

/**
 * Maintenance Services
 */
export const maintenanceService = {
  /**
   * Get all maintenance records (admin only)
   */
  getAll: async () => {
    return apiRequest('/maintenance');
  },

  /**
   * Create maintenance record (admin only)
   */
  create: async (maintenanceData: {
    vehicleId: string;
    description: string;
    scheduledDate: string;
  }) => {
    return apiRequest('/maintenance', {
      method: 'POST',
      body: JSON.stringify(maintenanceData),
    });
  },

  /**
   * Update maintenance status (admin only)
   */
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/maintenance/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

/**
 * Notification Services
 */
export const notificationService = {
  /**
   * Get user's notifications
   */
  getMyNotifications: async () => {
    return apiRequest('/notifications');
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (id: string) => {
    return apiRequest(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    return apiRequest('/notifications/read-all', {
      method: 'PATCH',
    });
  },
};

// Export all services as a single object for convenience
export const api = {
  auth: authService,
  vehicles: vehicleService,
  bookings: bookingService,
  stations: stationService,
  incidents: incidentService,
  users: userService,
  maintenance: maintenanceService,
  notifications: notificationService,
};

export default api;
