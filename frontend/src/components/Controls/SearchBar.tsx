import { useState, useRef, useEffect } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { Search, MapPin, Loader2, Zap } from 'lucide-react';
import { fromLonLat } from 'ol/proj';

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  importance: number;
  address?: any;
}

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { map } = useMapStore();

  // Get API key from environment variable
  const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Use LocationIQ with your API key
      const response = await fetch(
        `https://us1.locationiq.com/v1/search?` +
        `key=${LOCATIONIQ_API_KEY}` +
        `&q=${encodeURIComponent(searchQuery)}` +
        `&format=json` +
        `&limit=5` +
        `&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('LocationIQ request failed:', response.status);
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
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
    if (!map) {
      console.warn('Map not initialized yet');
      return;
    }

    console.log('Selected result:', result);

    try {
      const lon = parseFloat(result.lon);
      const lat = parseFloat(result.lat);
      
      // Transform coordinates from EPSG:4326 (lat/lon) to EPSG:3857 (map projection)
      const coordinates = fromLonLat([lon, lat]);
      
      console.log(`Setting view to: [${coordinates}] at zoom 14`);
      
      // Get the map's view and set center and zoom
      const view = map.getView();
      view.animate({
        center: coordinates,
        zoom: 14,
        duration: 1000
      });
      
    } catch (error) {
      console.error('Error setting map view:', error);
    }

    setQuery(result.display_name);
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
            data-testid="search-input"
          />
          <div className="flex items-center gap-2 ml-2">
            {isLoading && (
              <Loader2 size={16} className="text-blue-500 animate-spin" />
            )}
            <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded text-xs">
              <Zap size={12} className="text-blue-500" />
              <span className="text-blue-600 font-medium">LocationIQ</span>
            </div>
          </div>
        </div>

        {isOpen && results.length > 0 && (
          <div className="absolute top-14 left-0 right-0 bg-white rounded-lg shadow-xl max-h-80 overflow-y-auto custom-scrollbar border border-gray-200">
            <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 border-b border-gray-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-700 font-medium">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                </span>
                <div className="flex items-center gap-1 text-blue-600">
                  <Zap size={12} />
                  <span>Powered by LocationIQ</span>
                </div>
              </div>
            </div>
            
            {results.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleResultClick(result)}
                className="w-full p-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 group"
              >
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-blue-500 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2">
                      {result.display_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded">
                        {result.type}
                      </span>
                      {result.importance && (
                        <>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {Math.round(result.importance * 100)}% match
                          </span>
                        </>
                      )}
                    </div>
                    {result.address && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {[
                          result.address.road,
                          result.address.city || result.address.town || result.address.village,
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
          <div className="absolute top-14 left-0 right-0 bg-white rounded-lg shadow-xl p-6 text-center border border-gray-200">
            <MapPin size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 text-sm font-medium">No results found for "{query}"</p>
            <p className="text-gray-400 text-xs mt-1">Try a different location or check spelling</p>
          </div>
        )}
      </div>
    </div>
  );
};
