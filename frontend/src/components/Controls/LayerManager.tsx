import { useState } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { Layers, Eye, EyeOff, ChevronDown, ChevronUp, Map as MapIcon, Circle, Sparkles, LucideIcon, Satellite } from 'lucide-react';

interface LayerConfig {
  icon: LucideIcon;
  label: string;
  description: string;
  gradient: string;
  storeKey: 'wmsVisible' | 'baseMapVisible';
  opacityKey: 'wmsOpacity';
}

export const LayerManager = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  
  // Get store state
  const layers = useMapStore((state) => state.layers);
  const toggleLayer = useMapStore((state) => state.toggleLayer);
  const setLayerOpacity = useMapStore((state) => state.setLayerOpacity);
  const setActiveSatelliteSource = useMapStore((state) => state.setActiveSatelliteSource);

  const layerConfigs: LayerConfig[] = [
    {
      icon: Satellite,
      label: 'WMS Satellite',
      description: 'High-resolution WMS tiles',
      gradient: 'from-blue-500 to-cyan-500',
      storeKey: 'wmsVisible',
      opacityKey: 'wmsOpacity'
    },
    {
      icon: MapIcon,
      label: 'Base Map',
      description: 'OpenStreetMap base layer',
      gradient: 'from-purple-500 to-pink-500',
      storeKey: 'baseMapVisible',
      opacityKey: 'wmsOpacity'
    }
  ];

  return (
    <div className="absolute right-5 top-5 z-[900] w-full max-w-[320px] sm:w-[340px] animate-slide-right">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
          aria-expanded={isOpen}
          aria-label="Toggle layer control panel"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:scale-110 transition-transform">
              <Layers size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                Layer Control
                <Sparkles size={14} className="text-yellow-500" />
              </h3>
              <p className="text-xs text-gray-500 font-medium">Manage map layers</p>
            </div>
          </div>
          
          <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            {isOpen ? (
              <ChevronUp size={20} className="text-gray-600" strokeWidth={2.5} />
            ) : (
              <ChevronDown size={20} className="text-gray-600" strokeWidth={2.5} />
            )}
          </div>
        </button>

        {/* Layer Controls */}
        {isOpen && (
          <div className="p-4 pt-0 space-y-3 border-t border-gray-100">
            {layerConfigs.map((config) => {
              const Icon = config.icon;
              const isVisible = layers[config.storeKey];
              const opacity = layers[config.opacityKey];

              return (
                <div key={config.storeKey} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  {/* Layer Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`p-2 bg-gradient-to-br ${config.gradient} rounded-lg shadow-sm`}>
                        <Icon size={18} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-gray-800 truncate">
                          {config.label}
                        </div>
                        <div className="text-xs text-gray-500 font-medium truncate">
                          {config.description}
                        </div>
                      </div>
                    </div>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => toggleLayer(config.storeKey)}
                      className={`
                        p-2.5 rounded-xl transition-all duration-200 shadow-sm
                        ${isVisible
                          ? `bg-gradient-to-br ${config.gradient} text-white shadow-md hover:scale-110`
                          : 'bg-white text-gray-400 hover:bg-gray-100 border-2 border-gray-200 hover:scale-105'
                        }
                      `}
                      aria-label={`Toggle ${config.label} ${isVisible ? 'off' : 'on'}`}
                      aria-pressed={isVisible}
                    >
                      {isVisible ? (
                        <Eye size={18} strokeWidth={2.5} />
                      ) : (
                        <EyeOff size={18} strokeWidth={2} />
                      )}
                    </button>
                  </div>

                  {/* Opacity Slider - Only for WMS layer */}
                  {isVisible && config.storeKey === 'wmsVisible' && (
                    <div className="space-y-2 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <label 
                          htmlFor={`opacity-${config.storeKey}`}
                          className="text-xs font-bold text-gray-600 uppercase tracking-wide"
                        >
                          Opacity
                        </label>
                        <span className="text-xs font-black text-gray-800 bg-white px-2.5 py-1 rounded-lg shadow-sm border border-gray-200">
                          {Math.round(opacity * 100)}%
                        </span>
                      </div>
                      
                      <input
                        id={`opacity-${config.storeKey}`}
                        type="range"
                        min="0"
                        max="100"
                        value={opacity * 100}
                        onChange={(e) => setLayerOpacity('wmsOpacity', parseFloat(e.target.value) / 100)}
                        className="w-full"
                        aria-label={`${config.label} opacity control`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(opacity * 100)}
                        aria-valuetext={`${Math.round(opacity * 100)} percent`}
                      />

                      {/* Opacity Presets */}
                      <div className="flex gap-1.5 pt-1" role="group" aria-label="Opacity presets">
                        {[25, 50, 75, 100].map(preset => (
                          <button
                            key={preset}
                            onClick={() => setLayerOpacity('wmsOpacity', preset / 100)}
                            className={`
                              flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all
                              ${Math.round(opacity * 100) === preset
                                ? 'bg-blue-500 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                              }
                            `}
                            aria-label={`Set opacity to ${preset} percent`}
                            aria-pressed={Math.round(opacity * 100) === preset}
                          >
                            {preset}%
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Satellite Source Selector */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <label 
                htmlFor="satellite-source-select"
                className="flex items-center gap-2 mb-2"
              >
                <Satellite size={16} className="text-indigo-600" strokeWidth={2.5} />
                <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                  Satellite Source
                </span>
              </label>
              <select
                id="satellite-source-select"
                value={layers.activeSatelliteSource}
                onChange={(e) => setActiveSatelliteSource(e.target.value)}
                className="w-full px-3 py-2 text-sm font-medium bg-white border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
                aria-label="Select satellite imagery source"
              >
                <option value="nrw">NRW Satellite</option>
                <option value="nasa">NASA GIBS</option>
              </select>
            </div>

            {/* Info Footer */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl" role="status" aria-live="polite">
                <Eye size={14} className="text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                <span className="text-xs text-blue-700 font-semibold">
                  {[layers.wmsVisible, layers.baseMapVisible].filter(Boolean).length} of 2 layers visible
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
