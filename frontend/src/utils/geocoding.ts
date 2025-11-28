export interface GeocodingResult {
  displayName: string;
  lat: number;
  lon: number;
  boundingBox: number[];
  type: string;
  importance: number;
}

export const searchLocation = async (query: string): Promise<GeocodingResult[]> => {
  try {
    const response = await fetch(`/api/geocoding/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};