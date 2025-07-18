// API client for the lab booking application
import { 
  Profile, 
  PharmacyDetails, 
  LaboratoryDetails, 
  LabBooking, 
  InsertProfile, 
  InsertPharmacyDetails, 
  InsertLaboratoryDetails, 
  InsertLabBooking 
} from "@shared/schema";

const API_BASE = "/api";

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Profile API
export const profileApi = {
  create: (data: InsertProfile) =>
    apiRequest<Profile>("/profiles", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  list: () => apiRequest<Profile[]>("/profiles"),
  
  get: (id: string) => apiRequest<Profile>(`/profiles/${id}`),
};

// Laboratory API
export const laboratoryApi = {
  create: (data: InsertLaboratoryDetails) =>
    apiRequest<LaboratoryDetails>("/laboratories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  list: () => apiRequest<LaboratoryDetails[]>("/laboratories"),
  
  get: (id: string) => apiRequest<LaboratoryDetails>(`/laboratories/${id}`),
  
  getBookings: (laboratoryId: string) =>
    apiRequest<LabBooking[]>(`/laboratories/${laboratoryId}/bookings`),
};

// Lab Booking API
export const labBookingApi = {
  create: (data: InsertLabBooking) =>
    apiRequest<LabBooking>("/lab-bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  list: () => apiRequest<LabBooking[]>("/lab-bookings"),
  
  get: (id: string) => apiRequest<LabBooking>(`/lab-bookings/${id}`),
  
  update: (id: string, data: Partial<LabBooking>) =>
    apiRequest<LabBooking>(`/lab-bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<{ message: string }>(`/lab-bookings/${id}`, {
      method: "DELETE",
    }),
};

// Pharmacy API
export const pharmacyApi = {
  create: (data: InsertPharmacyDetails) =>
    apiRequest<PharmacyDetails>("/pharmacies", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  list: () => apiRequest<PharmacyDetails[]>("/pharmacies"),
};

// Health check API
export const healthApi = {
  check: () => apiRequest<{ status: string; timestamp: string }>("/health"),
};

// Mapbox token API
export const mapboxApi = {
  getToken: async (): Promise<string | null> => {
    try {
      // Try to get token from environment variable first
      const envToken = import.meta.env.VITE_MAPBOX_TOKEN;
      if (envToken) {
        return envToken;
      }
      
      // Fallback to server configuration
      const response = await apiRequest<{ token: string | null }>("/mapbox-token");
      return response.token;
    } catch (error) {
      console.error("Error fetching Mapbox token:", error);
      return null;
    }
  },
};