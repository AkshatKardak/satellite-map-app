import { useState, useEffect } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { Layers, Eye, EyeOff, Satellite, Map, Check } from 'lucide-react';

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
    { 
      id: 'nrw', 
      name: 'NRW Germany', 
      icon: '🇩🇪',
      description: 'High-resolution aerial imagery for North Rhine-Westphalia, Germany',
      maxZoom: 19
    },
    { 
      id: 'nasa', 
      name: 'NASA Global', 
      icon: '🚀',
      description: 'Global satellite mosaic from NASA',
      maxZoom: 14
    },
    { 
      id: 'usgs', 
      name: 'USGS Satellite', 
      icon: '🇺🇸',
      description: 'United States Geological Survey satellite imagery',
      maxZoom: 15
    },
    { 
      id: 'esa', 
      name: 'ESA Sentinel', 
      icon: '🛰️',
      description: 'European Space Agency Sentinel-2 imagery',
      maxZoom: 14
    }
  ];

  const freeBaseMaps = [
    { 
      id: 'osm', 
      name: 'OpenStreetMap', 
      icon: '🗺️',
      description: 'Standard OpenStreetMap base layer'
    },
    { 
      id: 'stamen', 
      name: 'Stamen Terrain', 
      icon: '🏔️',
      description: 'Terrain map with hill shading'
    },
    { 
      id: 'carto', 
      name: 'CartoDB Voyager', 
      icon: '🎨',
      description: 'Clean and colorful base map'
    }
  ];

  const handleSatelliteSourceChange = (sourceId: string) => {
    setActiveSatelliteSource(sourceId);
    // Ensure satellite layer is visible when switching sources
    if (!layers.wmsVisible) {
      toggleLayer('wmsVisible');
    }
  };

  const getCurrentSatelliteSource = () => {
    return freeSatelliteSources.find(source => source.id === layers.activeSatelliteSource) || freeSatelliteSources[0];
  };

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
          
          {/* Current Active Source Display */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-800">Active Satellite Source</h4>
                <p className="text-xs text-blue-600 mt-1">
                  {getCurrentSatelliteSource().icon} {getCurrentSatelliteSource().name}
                </p>
              </div>
              <div className="bg-blue-100 px-2 py-1 rounded text-xs text-blue-700">
                Zoom: up to {getCurrentSatelliteSource().maxZoom}
              </div>
            </div>
          </div>

          {/* Base Maps */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Map size={16} />
              Base Maps
            </h4>
            <div className="space-y-2">
              {freeBaseMaps.map((map) => (
                <button
                  key={map.id}
                  onClick={() => {
                    // Implement base map switching logic here
                    console.log('Switching to base map:', map.id);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <span className="text-base">{map.icon}</span>
                    <div>
                      <div className="font-medium">{map.name}</div>
                      <div className="text-xs text-gray-500">{map.description}</div>
                    </div>
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    map.id === 'osm' 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {map.id === 'osm' && <Check size={12} className="text-white" />}
                  </div>
                </button>
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
                <button
                  key={source.id}
                  onClick={() => handleSatelliteSourceChange(source.id)}
                  className={`w-full flex items-center justify-between p-3 rounded border transition-all ${
                    layers.activeSatelliteSource === source.id
                      ? 'bg-blue-50 border-blue-300 shadow-sm'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl">{source.icon}</span>
                    <div className="text-left">
                      <div className={`font-medium text-sm ${
                        layers.activeSatelliteSource === source.id ? 'text-blue-700' : 'text-gray-800'
                      }`}>
                        {source.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{source.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Max zoom: {source.maxZoom}
                      </div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    layers.activeSatelliteSource === source.id
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {layers.activeSatelliteSource === source.id && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Satellite Layer Controls */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 flex-1 cursor-pointer">
                <div className={`p-1 rounded ${
                  layers.wmsVisible ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {layers.wmsVisible ? (
                    <Eye size={16} className="text-green-600" />
                  ) : (
                    <EyeOff size={16} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium">Satellite Imagery</span>
                  <div className="text-xs text-gray-500 mt-1">
                    Toggle satellite layer visibility
                  </div>
                </div>
              </label>
              <button
                onClick={() => toggleLayer('wmsVisible')}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  layers.wmsVisible ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  layers.wmsVisible ? 'transform translate-x-7' : 'transform translate-x-1'
                }`} />
              </button>
            </div>
            
            {layers.wmsVisible && (
              <div className="pl-8 mt-3">
                <label className="block text-xs text-gray-600 mb-2">
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
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Transparent</span>
                  <span>Opaque</span>
                </div>
              </div>
            )}
          </div>

          {/* Available Services Status */}
          <div className="border-t pt-3 mt-3">
            <h4 className="text-xs font-medium text-gray-600 mb-2">
              Free Services Status
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>LocationIQ Geocoding:</span>
                <span className="flex items-center gap-1 text-green-600">
                  <Check size={12} />
                  Available
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>OpenStreetMap:</span>
                <span className="flex items-center gap-1 text-green-600">
                  <Check size={12} />
                  Available
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Satellite Sources:</span>
                <span className="flex items-center gap-1 text-green-600">
                  <Check size={12} />
                  {freeSatelliteSources.length} Available
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Current Source:</span>
                <span className="text-blue-600 font-medium">
                  {getCurrentSatelliteSource().name}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-3 mt-3">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveSatelliteSource('nrw');
                  if (!layers.wmsVisible) toggleLayer('wmsVisible');
                }}
                className="flex-1 bg-blue-500 text-white text-xs py-2 px-3 rounded hover:bg-blue-600 transition-colors"
              >
                Best Quality
              </button>
              <button
                onClick={() => {
                  toggleLayer('wmsVisible');
                }}
                className="flex-1 bg-gray-500 text-white text-xs py-2 px-3 rounded hover:bg-gray-600 transition-colors"
              >
                {layers.wmsVisible ? 'Hide Satellite' : 'Show Satellite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};