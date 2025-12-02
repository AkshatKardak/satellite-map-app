import { useState, useRef, useEffect } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { Search, MapPin, Loader2, X, Globe } from 'lucide-react';
import { fromLonLat } from 'ol/proj';

interface SearchResult {
  place_id: string;
  lat: number;
  lon: number;
  display_name: string;
  type?: string;
  importance?: number;
  address?: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    [key: string]: string | undefined;
  };
}

export const SearchBar = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { map } = useMapStore();

  const searchLocation = async (searchQuery: string): Promise<void> => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery)}` +
        `&format=json` +
        `&limit=5` +
        `&addressdetails=1` +
        `&accept-language=en`,
        {
          headers: {
            'User-Agent': 'SatelliteMapApp/1.0 (education-project)'
          },
          signal: AbortSignal.timeout(10000)
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          setResults(data.map((item: any) => ({
            place_id: String(item.place_id),
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            display_name: item.display_name,
            type: item.type || item.class,
            importance: item.importance || 0.5,
            address: item.address || {}
          })));
        } else {
          setResults([]);
        }
      } else {
        setError('Search service temporarily unavailable');
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Unable to search. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  const handleResultClick = (result: SearchResult): void => {
    if (!map) {
      console.warn('Map not initialized');
      return;
    }

    try {
      const coordinates = fromLonLat([result.lon, result.lat]);
      const view = map.getView();
      
      view.animate({
        center: coordinates,
        zoom: 15,
        duration: 1000,
        easing: (t: number) => t * (2 - t)
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }

    setQuery(result.display_name);
    setResults([]);
    setIsOpen(false);
  };

  const clearSearch = (): void => {
    setQuery('');
    setResults([]);
    setError(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={searchRef} 
      className="absolute top-5 left-5 right-5 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[1000] w-auto md:w-[440px] animate-slide-down"
    >
      <div className="card relative group">
        <div className="flex items-center px-4 py-3 gap-3">
          <Search size={20} className="text-gray-400 flex-shrink-0" strokeWidth={2} />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search locations (e.g., Berlin, Paris, New York)"
            className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent font-medium"
            autoComplete="off"
            spellCheck={false}
          />

          <div className="flex items-center gap-2 flex-shrink-0">
            {isLoading && (
              <div className="spinner w-4 h-4" />
            )}

            {query && !isLoading && (
              <button
                onClick={clearSearch}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Clear search"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}

            <div className="badge badge-success">
              <Globe size={10} />
              <span>Free</span>
            </div>
          </div>
        </div>

        {isOpen && (results.length > 0 || error) && (
          <div className="absolute top-full left-0 right-0 mt-2 card animate-scale-in max-h-[420px] overflow-hidden">
            {error ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                  <X size={28} className="text-red-500" strokeWidth={2.5} />
                </div>
                <p className="text-sm text-red-600 font-semibold mb-1">{error}</p>
                <p className="text-xs text-gray-500">Please try again in a moment</p>
              </div>
            ) : (
              <>
                <div className="sticky top-0 px-4 py-3 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b border-gray-100 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
                      <span className="text-xs font-bold text-gray-700">
                        {results.length} {results.length === 1 ? 'location' : 'locations'} found
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">OpenStreetMap</span>
                  </div>
                </div>

                <div className="overflow-y-auto custom-scrollbar max-h-[340px]">
                  {results.map((result, index) => (
                    <button
                      key={result.place_id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3.5 text-left hover:bg-blue-50 transition-all border-b border-gray-100 last:border-b-0 group focus:bg-blue-50 focus:outline-none"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="mt-0.5 p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 group-hover:scale-105 transition-all flex-shrink-0">
                          <MapPin size={18} className="text-blue-600" strokeWidth={2.5} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1.5">
                            {result.display_name}
                          </p>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            {result.type && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-gray-100 text-gray-600 capitalize">
                                {result.type.replace('_', ' ')}
                              </span>
                            )}
                            
                            {result.importance && result.importance > 0 && (
                              <span className="text-xs text-gray-500 font-medium">
                                {Math.round(result.importance * 100)}% relevance
                              </span>
                            )}
                          </div>

                          {result.address && (
                            <p className="text-xs text-gray-500 mt-1.5 line-clamp-1 font-medium">
                              {[
                                result.address.road,
                                result.address.city || result.address.town || result.address.village,
                                result.address.country
                              ].filter(Boolean).join(' • ')}
                            </p>
                          )}
                        </div>

                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {index + 1}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {isOpen && query && results.length === 0 && !isLoading && !error && (
          <div className="absolute top-full left-0 right-0 mt-2 card p-10 text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <MapPin size={40} className="text-gray-300" strokeWidth={2} />
            </div>
            <p className="text-sm font-bold text-gray-700 mb-1">No locations found</p>
            <p className="text-xs text-gray-500 font-medium">Try a different search term or check spelling</p>
          </div>
        )}
      </div>

      {!isOpen && !query && (
        <div className="mt-2 px-4">
          <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <Globe size={12} className="text-green-500" />
            Free worldwide search powered by OpenStreetMap
          </p>
        </div>
      )}
    </div>
  );
};
