import { useEffect, useRef } from 'react';
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { useMapStore } from '../../stores/mapStore';
import { defaults as defaultControls } from 'ol/control';


export const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { map, setMap } = useMapStore();

  useEffect(() => {
    if (!mapRef.current) {
      console.log('Map container not found');
      return;
    }

    console.log('Initializing OpenLayers map...');

    // Create a simple OSM layer
    const osmLayer = new TileLayer({
      source: new OSM()
    });

    // Initialize map
    const mapInstance = new Map({
      target: mapRef.current,
      layers: [osmLayer],
      view: new View({
        center: [0, 0], // Default center
        zoom: 2, // Default zoom
      }),
      controls: defaultControls(),
    });

    console.log('OpenLayers map created successfully');

    // Store map instance in state
    setMap(mapInstance);

    // Cleanup on unmount
    return () => {
      console.log('Cleaning up map...');
      mapInstance.setTarget(undefined);
    };
  }, [setMap]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full bg-blue-50" 
      data-testid="map-container"
    >
      {/* Fallback content if map fails to load */}
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-600">
          <div className="text-lg font-semibold mb-2">Loading Map...</div>
          <div className="text-sm">If this persists, check the console for errors.</div>
        </div>
      </div>
    </div>
  );
};