import { useState, useRef, useEffect } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { Search, MapPin, Wifi, WifiOff } from 'lucide-react';

interface SearchResult {
  id: string;
  displayName: string;
  lat: number;
  lon: number;
  boundingBox: number[];
  type: string;
  importance: number;
  address: any;
}

interface GeocodingUsage {
  locationIQ: {
    used: number;
    remaining: number;
    limit: number;
  };
  providers: {
    locationIQ: boolean;
    nominatim: boolean;
    photon: boolean;
  };
}

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState<string>('none');
  const [usage, setUsage] = useState<GeocodingUsage | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { map, setView } = useMapStore();

  // Fetch usage stats on component mount
  useEffect(() => {
    fetchUsageStats();
  }, []);

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/geocoding/usage');
      const data = await response.json();
      if (data.success) {
        setUsage(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
    }
  };

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setProvider('none');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/geocoding/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        setProvider(data.provider);
        if (data.usage) {
          setUsage(data.usage);
        }
      } else {
        setResults([]);
        setProvider('none');
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setProvider('none');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => {
      searchLocation(value);
    }, 300);
  };

  const handleResultClick = (result: SearchResult) => {
    if (!map) return;

    console.log('Selected result:', result);

    try {
      // Convert lat/lon to the map's coordinate system (EPSG:3857)
      // For OpenLayers, we need to transform from EPSG:4326 to EPSG:3857
      const lon = result.lon;
      const lat = result.lat;
      
      // Simple conversion (approximate for demo purposes)
      // In a real app, you'd use ol/proj to transform coordinates
      const x = (lon * 20037508.34) / 180;
      const y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
      const y3857 = (y * 20037508.34) / 180;

      console.log(`Setting view to: [${x}, ${y3857}]`);
      
      // Set map view to the location
      setView([x, y3857], 14);
      
    } catch (error) {
      console.error('Error setting map view:', error);
      // Fallback: Use a default location
      setView([794611, 6693224], 10);
    }

    setQuery(result.displayName);
    setResults([]);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProviderIcon = () => {
    switch (provider) {
      case 'locationiq':
        return <Wifi size={14} className="text-green-500" />;
      case 'nominatim':
        return <Wifi size={14} className="text-blue-500" />;
      case 'photon':
        return <Wifi size={14} className="text-orange-500" />;
      default:
        return <WifiOff size={14} className="text-gray-400" />;
    }
  };

  const getProviderText = () => {
    switch (provider) {
      case 'locationiq':
        return 'LocationIQ';
      case 'nominatim':
        return 'OpenStreetMap';
      case 'photon':
        return 'Photon';
      default:
        return 'No service';
    }
  };

  return (
    <div ref={searchRef} className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-96">
      <div className="relative">
        <div className="flex items-center bg-white rounded-lg shadow-lg pl-3 pr-2 py-2 border border-gray-200">
          <Search size={20} className="text-gray-400 mr-2" />
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="Search for locations (e.g., Berlin, Germany)..."
            className="flex-1 outline-none text-sm bg-transparent placeholder-gray-500"
          />
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin ml-2" />
          ) : (
            <div className="flex items-center gap-1 ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
              {getProviderIcon()}
              <span className="text-gray-600">{getProviderText()}</span>
            </div>
          )}
        </div>

        {/* Usage Stats */}
        {usage && usage.providers.locationIQ && (
          <div className="absolute top-12 left-0 right-0 bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-medium">LocationIQ</span>
              <span className="text-blue-600">
                {usage.locationIQ.used} / {usage.locationIQ.limit} requests today
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5 mt-1">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(usage.locationIQ.used / usage.locationIQ.limit) * 100}%` 
                }}
              />
            </div>
          </div>
        )}

        {isOpen && results.length > 0 && (
          <div className="absolute top-20 left-0 right-0 bg-white rounded-lg shadow-xl max-h-80 overflow-y-auto custom-scrollbar border border-gray-200">
            <div className="sticky top-0 bg-gray-50 px-3 py-2 border-b border-gray-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  {getProviderIcon()}
                  {getProviderText()}
                </span>
              </div>
            </div>
            
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="w-full p-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group"
              >
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600">
                      {result.displayName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 capitalize">
                        {result.type}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        Confidence: {Math.round(result.importance * 100)}%
                      </span>
                    </div>
                    {result.address && (
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {[
                          result.address.road,
                          result.address.city,
                          result.address.state,
                          result.address.country
                        ].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {isOpen && query && results.length === 0 && !isLoading && (
          <div className="absolute top-20 left-0 right-0 bg-white rounded-lg shadow-xl p-6 text-center border border-gray-200">
            <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm">No results found for "{query}"</p>
            <p className="text-gray-400 text-xs mt-1">Try a different location name</p>
          </div>
        )}
      </div>
    </div>
  );
};