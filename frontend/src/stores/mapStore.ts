import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MapStore {
  map: any | null;
  activeTool: string;
  features: any[];
  layers: {
    wmsVisible: boolean;
    wmsOpacity: number;
    baseMapVisible: boolean;
    activeSatelliteSource: string;
  };
  view: {
    center: [number, number];
    zoom: number;
  };
  setMap: (map: any) => void;
  setActiveTool: (tool: string) => void;
  addFeature: (feature: any) => void;
  removeFeature: (featureId: string) => void;
  updateFeature: (featureId: string, updates: any) => void;
  toggleLayer: (layer: keyof MapStore['layers']) => void;
  setLayerOpacity: (layer: keyof MapStore['layers'], opacity: number) => void;
  setView: (center: [number, number], zoom: number) => void;
  clearFeatures: () => void;
  setActiveSatelliteSource: (source: string) => void;
}

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
      map: null,
      activeTool: 'select',
      features: [],
      layers: {
        wmsVisible: true,
        wmsOpacity: 1,
        baseMapVisible: true,
        activeSatelliteSource: 'nrw',
      },
      view: {
        center: [0, 0], // Default center
        zoom: 2, // Default zoom
      },

      setMap: (map) => {
        console.log('Setting map in store:', map);
        set({ map });
      },

      setActiveTool: (activeTool) => set({ activeTool }),

      addFeature: (feature) => set((state) => ({
        features: [...state.features, feature]
      })),

      removeFeature: (featureId) => set((state) => ({
        features: state.features.filter(f => f.id !== featureId)
      })),

      updateFeature: (featureId, updates) => set((state) => ({
        features: state.features.map(f => 
          f.id === featureId ? { ...f, ...updates } : f
        )
      })),

      toggleLayer: (layer) => set((state) => ({
        layers: { ...state.layers, [layer]: !state.layers[layer] }
      })),

      setLayerOpacity: (layer, opacity) => set((state) => ({
        layers: { ...state.layers, [layer]: opacity }
      })),

      setView: (center, zoom) => set({
        view: { center, zoom }
      }),

      clearFeatures: () => set({ features: [] }),

      setActiveSatelliteSource: (source) => set((state) => ({
        layers: { ...state.layers, activeSatelliteSource: source }
      })),
    }),
    {
      name: 'map-storage',
      partialize: (state) => ({
        features: state.features,
        layers: state.layers,
        view: state.view,
      }),
    }
  )
);