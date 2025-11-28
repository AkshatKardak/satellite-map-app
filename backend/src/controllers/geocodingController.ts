import { Request, Response } from 'express';
import axios from 'axios';

// Track usage for monitoring
let locationIQRequestCount = 0;
const LOCATIONIQ_DAILY_LIMIT = 5000;

export interface GeocodingResult {
  id: string;
  displayName: string;
  lat: number;
  lon: number;
  boundingBox: number[];
  type: string;
  importance: number;
  address: any;
  provider: string;
}

export const searchLocation = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        success: false,
        error: 'Query parameter is required' 
      });
    }

    console.log(`🔍 Geocoding search for: "${query}"`);

    // Try providers in order of preference
    const providers = [
      { name: 'locationiq', function: searchWithLocationIQ, priority: 1 },
      { name: 'nominatim', function: searchWithNominatim, priority: 2 },
      { name: 'photon', function: searchWithPhoton, priority: 3 }
    ];

    // Sort by priority
    providers.sort((a, b) => a.priority - b.priority);

    let results: GeocodingResult[] = [];
    let usedProvider = 'none';

    for (const provider of providers) {
      try {
        // Skip LocationIQ if no API key or near daily limit
        if (provider.name === 'locationiq') {
          if (!process.env.LOCATIONIQ_API_KEY || process.env.LOCATIONIQ_API_KEY === 'pk.your_actual_locationiq_access_token_here') {
            console.log('⏭️  Skipping LocationIQ - API key not configured');
            continue;
          }
          if (locationIQRequestCount >= LOCATIONIQ_DAILY_LIMIT - 100) {
            console.log('⚠️  Skipping LocationIQ - Near daily limit');
            continue;
          }
        }

        console.log(`🔄 Trying ${provider.name} geocoding...`);
        const providerResults = await provider.function(query);
        
        if (providerResults.length > 0) {
          results = providerResults;
          usedProvider = provider.name;
          console.log(`✅ ${provider.name} found ${results.length} results`);
          break;
        }
      } catch (error) {
        console.log(`❌ ${provider.name} failed:`, error instanceof Error ? error.message : 'Unknown error');
        // Continue to next provider
      }
    }

    res.json({
      success: true,
      data: results,
      provider: usedProvider,
      usage: {
        locationIQRequests: locationIQRequestCount,
        locationIQLimit: LOCATIONIQ_DAILY_LIMIT
      }
    });

  } catch (error) {
    console.error('💥 All geocoding providers failed:', error);
    res.status(500).json({ 
      success: false,
      error: 'Geocoding service temporarily unavailable',
      details: error instanceof Error ? error.message : 'Please try again in a moment'
    });
  }
};

export const getGeocodingUsage = async (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      locationIQ: {
        used: locationIQRequestCount,
        remaining: LOCATIONIQ_DAILY_LIMIT - locationIQRequestCount,
        limit: LOCATIONIQ_DAILY_LIMIT,
        configured: !!process.env.LOCATIONIQ_API_KEY && process.env.LOCATIONIQ_API_KEY !== 'pk.your_actual_locationiq_access_token_here'
      },
      freeServices: {
        nominatim: true,
        photon: true
      }
    }
  });
};

// LocationIQ Geocoding (Primary - Most Reliable)
const searchWithLocationIQ = async (query: string): Promise<GeocodingResult[]> => {
  const apiKey = process.env.LOCATIONIQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('LocationIQ API key not configured');
  }

  if (!apiKey.startsWith('pk.')) {
    throw new Error('Invalid LocationIQ token format. Token should start with "pk."');
  }

  console.log(`🔑 Using LocationIQ token: ${apiKey.substring(0, 15)}...`);

  const response = await axios.get(`https://us1.locationiq.com/v1/search.php`, {
    params: {
      q: query,
      format: 'json',
      key: apiKey,
      limit: 10,
      'accept-language': 'en',
      addressdetails: 1,
      normalizedaddress: 1,
      countrycodes: 'de,us,gb,fr,it,es,ca,au,cn,jp,in,br,mx'
    },
    timeout: 10000
  });

  locationIQRequestCount++;
  console.log(`📍 LocationIQ request #${locationIQRequestCount} for: "${query}"`);

  if (response.data.error) {
    throw new Error(`LocationIQ API error: ${response.data.error}`);
  }

  return response.data.map((item: any, index: number) => ({
    id: `locationiq-${Date.now()}-${index}`,
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    boundingBox: ensureBoundingBox(item.boundingbox),
    type: item.type || 'unknown',
    importance: parseFloat(item.importance) || 0.5,
    address: item.address || {},
    provider: 'locationiq'
  }));
};

// Nominatim Geocoding (Backup - Free)
const searchWithNominatim = async (query: string): Promise<GeocodingResult[]> => {
  const baseUrl = process.env.NOMINATIM_BASE_URL || 'https://nominatim.openstreetmap.org';
  
  const response = await axios.get(`${baseUrl}/search`, {
    params: {
      q: query,
      format: 'json',
      limit: 10,
      addressdetails: 1,
      countrycodes: 'de,us,gb,fr,it,es,ca,au,cn,jp,in,br,mx'
    },
    headers: {
      'User-Agent': 'SatelliteMapApp/1.0 (https://github.com/your-repo)'
    },
    timeout: 10000
  });

  console.log(`🗺️  Nominatim found ${response.data.length} results`);

  return response.data.map((item: any, index: number) => ({
    id: `nominatim-${Date.now()}-${index}`,
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    boundingBox: ensureBoundingBox(item.boundingbox),
    type: item.type || item.class || 'unknown',
    importance: parseFloat(item.importance) || 0.5,
    address: item.address || {},
    provider: 'nominatim'
  }));
};

// Photon Geocoding (Backup - Free)
const searchWithPhoton = async (query: string): Promise<GeocodingResult[]> => {
  const baseUrl = process.env.PHOTON_BASE_URL || 'https://photon.komoot.io';
  
  const response = await axios.get(`${baseUrl}/api/`, {
    params: {
      q: query,
      limit: 10,
      lang: 'en'
    },
    timeout: 10000
  });

  console.log(`📡 Photon found ${response.data.features?.length || 0} results`);

  if (!response.data.features) {
    return [];
  }

  return response.data.features.map((feature: any, index: number) => ({
    id: `photon-${Date.now()}-${index}`,
    displayName: feature.properties.name || 
                feature.properties.street || 
                feature.properties.city || 
                feature.properties.country ||
                'Unknown location',
    lat: feature.geometry.coordinates[1],
    lon: feature.geometry.coordinates[0],
    boundingBox: ensureBoundingBox(feature.properties.extent),
    type: feature.properties.osm_key || feature.properties.type || 'unknown',
    importance: feature.properties.importance || 0.3,
    address: feature.properties,
    provider: 'photon'
  }));
};

// Helper function to ensure bounding box is valid
const ensureBoundingBox = (bbox: any[]): number[] => {
  if (!bbox || !Array.isArray(bbox) || bbox.length !== 4) {
    // Return a default bounding box (whole world)
    return [-180, -90, 180, 90];
  }
  
  return bbox.map(coord => {
    const num = parseFloat(coord);
    return isNaN(num) ? 0 : num;
  });
};

// Batch search for multiple locations
export const batchSearch = async (req: Request, res: Response) => {
  try {
    const { queries } = req.body;

    if (!Array.isArray(queries)) {
      return res.status(400).json({ 
        success: false,
        error: 'Queries must be an array' 
      });
    }

    const results = await Promise.all(
      queries.map(async (query: string) => {
        try {
          const response = await axios.get(`/api/geocoding/search?query=${encodeURIComponent(query)}`);
          return {
            query,
            success: true,
            data: response.data.data,
            provider: response.data.provider
          };
        } catch (error) {
          return {
            query,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      })
    );

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Batch search error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Batch search failed'
    });
  }
};