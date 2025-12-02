import { useEffect, useRef } from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { defaults as defaultControls } from 'ol/control';
import { useMapStore } from '../../stores/mapStore';
import { useDrawingInteractions } from '../../hooks/useDrawingInteractions';
import 'ol/ol.css';

export const MapView = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const setMap = useMapStore((state) => state.setMap);
  const layers = useMapStore((state) => state.layers);
  const view = useMapStore((state) => state.view);

  // Initialize drawing interactions
  useDrawingInteractions();

  useEffect(() => {
    if (!mapRef.current) return;

    console.log('🗺️ Initializing map...');

    // Base layer (OSM)
    const baseLayer = new TileLayer({
      source: new OSM(),
      visible: layers.baseMapVisible,
    });

    // WMS Satellite layer
    const wmsLayer = new TileLayer({
      source: new TileWMS({
        url: import.meta.env.VITE_WMS_NRW_URL || 'https://www.wms.nrw.de/geobasis/wms_nw_dop',
        params: {
          'LAYERS': 'nw_dop_rgb',
          'TILED': true,
        },
        serverType: 'geoserver',
      }),
      visible: layers.wmsVisible,
      opacity: layers.wmsOpacity,
    });

    // Vector layer for drawings
    const vectorLayer = new VectorLayer({
      source: new VectorSource(),
      visible: true,
      style: undefined, // Will use interaction styles
    });

    // Create map
    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, wmsLayer, vectorLayer],
      view: new View({
        center: view.center,
        zoom: view.zoom,
        projection: 'EPSG:3857',
      }),
      controls: defaultControls({
        zoom: false,
        rotate: false,
        attribution: false,
      }),
    });

    console.log('✅ Map initialized successfully');
    setMap(map);

    return () => {
      console.log('🧹 Cleaning up map...');
      map.setTarget(undefined);
    };
  }, []);

  // Update layer visibility and opacity
  useEffect(() => {
    const map = useMapStore.getState().map;
    if (!map) return;

    const mapLayers = map.getLayers().getArray();
    
    if (mapLayers[0]) {
      mapLayers[0].setVisible(layers.baseMapVisible);
    }
    
    if (mapLayers[1]) {
      mapLayers[1].setVisible(layers.wmsVisible);
      mapLayers[1].setOpacity(layers.wmsOpacity);
    }
  }, [layers.baseMapVisible, layers.wmsVisible, layers.wmsOpacity]);

  return (
    <div 
      ref={mapRef} 
      id="map" 
      className="w-full h-full"
      style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
    />
  );
};
