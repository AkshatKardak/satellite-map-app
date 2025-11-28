import { useMapStore } from '../../stores/mapStore';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export const CustomZoomControls = () => {
  const { map } = useMapStore();

  const zoomIn = () => {
    if (!map) return;
    const view = map.getView();
    const currentZoom = view.getZoom();
    view.animate({
      zoom: currentZoom + 1,
      duration: 250
    });
  };

  const zoomOut = () => {
    if (!map) return;
    const view = map.getView();
    const currentZoom = view.getZoom();
    view.animate({
      zoom: currentZoom - 1,
      duration: 250
    });
  };

  const fitToWorld = () => {
    if (!map) return;
    map.getView().fit([-2000000, -2000000, 2000000, 2000000], {
      duration: 1000
    });
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 z-10">
      <div className="flex flex-col gap-2">
        <button
          onClick={zoomIn}
          className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={20} />
        </button>
        
        <button
          onClick={zoomOut}
          className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={20} />
        </button>
        
        <div className="border-t border-gray-200 pt-2">
          <button
            onClick={fitToWorld}
            className="p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors w-full"
            title="Fit to World"
          >
            <Maximize size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};