import { Plus, Minus, Maximize2, Minimize2, Crosshair } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMapStore } from '../../stores/mapStore';

export const CustomZoomControls = () => {
  const { map } = useMapStore();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentZoom, setCurrentZoom] = useState<number>(10);

  useEffect(() => {
    const handleFullscreenChange = (): void => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (map) {
      const view = map.getView();
      const updateZoom = (): void => setCurrentZoom(Math.round(view.getZoom() || 10));
      
      view.on('change:resolution', updateZoom);
      updateZoom();
      
      return () => view.un('change:resolution', updateZoom);
    }
  }, [map]);

  const zoomIn = (): void => {
    if (!map) return;
    const view = map.getView();
    const currentZoom = view.getZoom() || 10;
    const maxZoom = 19;
    
    if (currentZoom < maxZoom) {
      view.animate({
        zoom: Math.min(currentZoom + 1, maxZoom),
        duration: 300,
        easing: (t: number) => t * (2 - t)
      });
    }
  };

  const zoomOut = (): void => {
    if (!map) return;
    const view = map.getView();
    const currentZoom = view.getZoom() || 10;
    const minZoom = 2;
    
    if (currentZoom > minZoom) {
      view.animate({
        zoom: Math.max(currentZoom - 1, minZoom),
        duration: 300,
        easing: (t: number) => t * (2 - t)
      });
    }
  };

  const resetView = (): void => {
    if (!map) return;
    const view = map.getView();
    
    view.animate({
      center: [794611, 6693224],
      zoom: 10,
      duration: 800,
      easing: (t: number) => t * (2 - t)
    });
  };

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="absolute right-5 bottom-5 z-[900] hidden md:block animate-fade-in">
      <div className="card p-2.5 space-y-2 min-w-[60px]">
        <button
          onClick={zoomIn}
          disabled={currentZoom >= 19}
          className="group relative w-full p-3.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 no-select"
          aria-label="Zoom in"
        >
          <Plus size={22} strokeWidth={2.5} className="mx-auto" />
          
          <div className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl">
            Zoom In
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-gray-900" />
          </div>
        </button>

        <div className="px-2 py-2 text-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md">
          <div className="text-xs text-white font-black leading-none">
            {currentZoom}
          </div>
        </div>

        <button
          onClick={zoomOut}
          disabled={currentZoom <= 2}
          className="group relative w-full p-3.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:scale-105 hover:shadow-md transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 no-select"
          aria-label="Zoom out"
        >
          <Minus size={22} strokeWidth={2.5} className="mx-auto" />
          
          <div className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl">
            Zoom Out
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-gray-900" />
          </div>
        </button>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-1" />

        <button
          onClick={resetView}
          className="group relative w-full p-3.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-600 hover:scale-105 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 no-select"
          aria-label="Reset view"
        >
          <Crosshair size={22} strokeWidth={2} className="mx-auto" />
          
          <div className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl">
            Reset View
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-gray-900" />
          </div>
        </button>

        <button
          onClick={toggleFullscreen}
          className="group relative w-full p-3.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 no-select"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 size={22} strokeWidth={2} className="mx-auto" />
          ) : (
            <Maximize2 size={22} strokeWidth={2} className="mx-auto" />
          )}
          
          <div className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-2xl">
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-gray-900" />
          </div>
        </button>
      </div>
    </div>
  );
};
