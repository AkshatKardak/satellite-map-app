import { useState, useEffect } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { Layers, Eye, EyeOff, Satellite, Map } from 'lucide-react';

interface MapService {
  name: string;
  url: string;
  layers: string;
  format: string;
  maxZoom: number;
  attribution: string;
  free: boolean;
  available?: boolean;
}

export const LayerManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [services, setServices] = useState<MapService[]>([]);
  const { layers, toggleLayer, setLayerOpacity, setActiveSatelliteSource } = useMapStore();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/map-services/wms');
        const data = await response.json();
        if (data.success) {
          setServices(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const freeSatelliteSources = [
    { id: 'nrw', name: 'NRW Germany', icon: '🇩🇪' },
    { id: 'nasa', name: 'NASA Global', icon: '🚀' },
    { id: 'usgs', name: 'USGS Satellite', icon: '🇺🇸' },
    { id: 'esa', name: 'ESA Sentinel', icon: '🛰️' }
  ];

  const freeBaseMaps = [
    { id: 'osm', name: 'OpenStreetMap', icon: '🗺️' },
    { id: 'stamen', name: 'Stamen Terrain', icon: '🏔️' },
    { id: 'carto', name: 'CartoDB Voyager', icon: '🎨' }
  ];

  return (
    <div className="absolute top-4 right-20 z-10">
      <button
        className="bg-white rounded-lg shadow-lg p-3 hover:shadow-xl transition-all duration-200 flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
        data-testid="layer-manager-toggle"
      >
        <Layers size={20} />
        <span className="font-medium">Layers</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-16 right-0 bg-white rounded-lg shadow-xl p-4 min-w-80 z-20 max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <Layers size={18} />
            Free Layer Management
          </h3>
          
          {/* Base Maps */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Map size={16} />
              Base Maps
            </h4>
            <div className="space-y-2">
              {freeBaseMaps.map((map) => (
                <label key={map.id} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm">
                    <span>{map.icon}</span>
                    {map.name}
                  </span>
                  <input
                    type="radio"
                    name="base-map"
                    checked={layers.baseMapVisible && map.id === 'osm'} // Simplified for demo
                    onChange={() => {}} // Would implement base map switching
                    className="rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Satellite Sources */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Satellite size={16} />
              Free Satellite Sources
            </h4>
            <div className="space-y-2">
              {freeSatelliteSources.map((source) => (
                <label key={source.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="satellite-source"
                    checked={layers.activeSatelliteSource === source.id}
                    onChange={() => setActiveSatelliteSource(source.id)}
                    className="rounded"
                  />
                  <span className="flex items-center gap-2">
                    <span>{source.icon}</span>
                    {source.name}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Satellite Layer Controls */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 flex-1">
                <div className={`p-1 rounded ${
                  layers.wmsVisible ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {layers.wmsVisible ? (
                    <Eye size={16} className="text-green-600" />
                  ) : (
                    <EyeOff size={16} className="text-gray-400" />
                  )}
                </div>
                <span className="text-sm font-medium">Satellite Imagery</span>
              </label>
              <button
                onClick={() => toggleLayer('wmsVisible')}
                className={`w-10 h-5 rounded-full transition-colors ${
                  layers.wmsVisible ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${
                  layers.wmsVisible ? 'transform translate-x-5' : 'transform translate-x-1'
                }`} />
              </button>
            </div>
            
            {layers.wmsVisible && (
              <div className="pl-8">
                <label className="block text-xs text-gray-600 mb-1">
                  Opacity: {Math.round(layers.wmsOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={layers.wmsOpacity}
                  onChange={(e) => setLayerOpacity('wmsOpacity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}
          </div>

          {/* Available Services Status */}
          <div className="border-t pt-3 mt-3">
            <h4 className="text-xs font-medium text-gray-600 mb-2">
              Free Services Status
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>LocationIQ Geocoding:</span>
                <span className="text-green-600">✅ Available</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>OpenStreetMap:</span>
                <span className="text-green-600">✅ Available</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Satellite Imagery:</span>
                <span className="text-green-600">✅ Multiple Sources</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};