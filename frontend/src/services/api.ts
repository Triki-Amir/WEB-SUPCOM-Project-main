/**
 * API Service
 * 
 * Centralized service for all API calls to the backend.
 * Handles authentication, error handling, and request/response formatting.
 */

// Analytics API Response Types
interface DashboardResponse {
  vehicles?: {
    total: number;
    available: number;
    rented: number;
    maintenance: number;
    utilizationRate: string;
  };
  bookings?: {
    total: number;
    active: number;
  };
  revenue?: {
    total: number;
  };
  users?: {
    total: number;
  };
  incidents?: {
    open: number;
  };
}

interface StationStatisticsResponse {
  id: string;
  name: string;
  city: string;
  totalVehicles: number;
  availablePlaces: number;
  capacity: number;
  occupancyRate: string;
  totalBookings: number;
  totalRevenue: number;
  isOpen: boolean;
}

interface UserStatisticsResponse {
  totalUsers: number;
  activeClients: number;
  newThisMonth: number;
}

interface MonthlyTrendResponse {
  month: string;
  revenue: number;
  bookings: number;
}

interface VehiclePerformanceResponse {
  name: string;
  totalBookings: number;
  totalRevenue: number;
}

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
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
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
      const error = await response.json().catch(() => ({ error: 'An error occurred' }));
      throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
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
    status?: string;
    category?: string;
    stationId?: string;
    city?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.available !== undefined) queryParams.append('available', String(filters.available));
    if (filters?.station) queryParams.append('station', filters.station);
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.stationId) queryParams.append('stationId', filters.stationId);
    if (filters?.city) queryParams.append('city', filters.city);
    if (filters?.startDate) queryParams.append('startDate', filters.startDate);
    if (filters?.endDate) queryParams.append('endDate', filters.endDate);
    
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
   * Get all bookings (admin only)
   */
  getAll: async () => {
    return apiRequest('/bookings/all');
  },

  /**
   * Get booking by ID
   */
  getById: async (id: string) => {
    return apiRequest(`/bookings/${id}`);
  },

  /**
   * Create new booking
   */
  create: async (bookingData: {
    vehicleId: string;
    stationId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    pickupLocation?: string;
    dropoffLocation?: string;
    notes?: string;
  }) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  /**
   * Update booking
   */
  update: async (id: string, bookingData: {
    startDate?: string;
    endDate?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    notes?: string;
  }) => {
    return apiRequest(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  },

  /**
   * Update booking status (admin only)
   */
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
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
   * Get user by ID (admin only)
   */
  getById: async (id: string) => {
    return apiRequest(`/users/${id}`);
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
  updateProfile: async (userData: {
    name?: string;
    phone?: string;
    address?: string;
  }) => {
    return apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Update user password
   */
  updatePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return apiRequest('/users/me/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  /**
   * Update user role (admin only)
   */
  updateRole: async (id: string, role: string) => {
    return apiRequest(`/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  /**
   * Delete user (admin only)
   */
  delete: async (id: string) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
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
   * Get maintenance by ID (admin only)
   */
  getById: async (id: string) => {
    return apiRequest(`/maintenance/${id}`);
  },

  /**
   * Create maintenance record (admin only)
   */
  create: async (maintenanceData: {
    vehicleId: string;
    type: string;
    description: string;
    cost?: number;
    scheduledAt: string;
    notes?: string;
  }) => {
    return apiRequest('/maintenance', {
      method: 'POST',
      body: JSON.stringify(maintenanceData),
    });
  },

  /**
   * Update maintenance (admin only)
   */
  update: async (id: string, maintenanceData: {
    type?: string;
    description?: string;
    cost?: number;
    scheduledAt?: string;
    completedAt?: string;
    notes?: string;
  }) => {
    return apiRequest(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(maintenanceData),
    });
  },

  /**
   * Complete maintenance (admin only)
   */
  complete: async (id: string) => {
    return apiRequest(`/maintenance/${id}/complete`, {
      method: 'PATCH',
    });
  },

  /**
   * Delete maintenance (admin only)
   */
  delete: async (id: string) => {
    return apiRequest(`/maintenance/${id}`, {
      method: 'DELETE',
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

  /**
   * Delete notification
   */
  delete: async (id: string) => {
    return apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Analytics Services
 */
export const analyticsService = {
  /**
   * Get dashboard statistics (admin and direction only)
   */
  getDashboard: async () => {
    return apiRequest<DashboardResponse>('/analytics/dashboard');
  },

  /**
   * Get booking trends (admin and direction only)
   */
  getBookingTrends: async (period: number = 30) => {
    return apiRequest(`/analytics/bookings/trends?period=${period}`);
  },

  /**
   * Get vehicle performance (admin and direction only)
   */
  getVehiclePerformance: async () => {
    return apiRequest<VehiclePerformanceResponse[]>('/analytics/vehicles/performance');
  },

  /**
   * Get station statistics (admin and direction only)
   */
  getStationStatistics: async () => {
    return apiRequest<StationStatisticsResponse[]>('/analytics/stations/statistics');
  },

  /**
   * Get user statistics (admin and direction only)
   */
  getUserStatistics: async () => {
    return apiRequest<UserStatisticsResponse>('/analytics/users/statistics');
  },

  /**
   * Get revenue by category (admin and direction only)
   */
  getRevenueByCategory: async () => {
    return apiRequest('/analytics/revenue/by-category');
  },

  /**
   * Get revenue by city (admin and direction only)
   */
  getRevenueByCity: async () => {
    return apiRequest('/analytics/revenue/by-city');
  },

  /**
   * Get bookings by weekday (admin and direction only)
   */
  getBookingsByWeekday: async () => {
    return apiRequest('/analytics/bookings/by-weekday');
  },

  /**
   * Get monthly revenue trends (admin and direction only)
   */
  getMonthlyTrends: async () => {
    return apiRequest<MonthlyTrendResponse[]>('/analytics/revenue/monthly-trends');
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
  analytics: analyticsService,
};

export default api;
