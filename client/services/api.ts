const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface FoodPrediction {
  food_name: string;
  confidence: number;
  class_id: number;
  description: string;
}

export interface RecognitionResponse {
  success: boolean;
  predictions: FoodPrediction[];
  top_prediction: FoodPrediction;
  model: string;
  message: string;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  rating: number;
  price_range: string;
  distance: string;
  menu_link: string;
  coordinates: any;
}

export interface RestaurantSearchResponse {
  dish: string;
  location: { lat: number; lon: number };
  restaurants: Restaurant[];
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Food Recognition
  async recognizeFood(imageFile: File): Promise<RecognitionResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/api/food/recognize`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header for FormData - browser will set it automatically
    });

    if (!response.ok) {
      throw new Error(`Recognition failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // Restaurant Search
  async searchRestaurants(dish: string, location?: { lat: number; lon: number }): Promise<RestaurantSearchResponse> {
    const params = new URLSearchParams({
      dish,
      ...(location && {
        lat: location.lat.toString(),
        lon: location.lon.toString(),
      }),
    });

    return this.request<RestaurantSearchResponse>(`/api/restaurants/search?${params}`);
  }

  // Get popular dishes
  async getPopularDishes(): Promise<{ dishes: Array<{ id: number; name: string; category: string }> }> {
    return this.request('/api/food/dishes');
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();