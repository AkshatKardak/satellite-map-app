import { useEffect } from 'react';
import Draw from 'ol/interaction/Draw';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';
import Snap from 'ol/interaction/Snap';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';
import { useMapStore } from '../stores/mapStore';
import Feature from 'ol/Feature';
import { Geometry } from 'ol/geom';
import type Map from 'ol/Map';
import type { DrawEvent } from 'ol/interaction/Draw';
import type { SelectEvent } from 'ol/interaction/Select';
import type { ModifyEvent } from 'ol/interaction/Modify';

export const useDrawingInteractions = (): void => {
  const map = useMapStore((state) => state.map as Map | null);
  const activeTool = useMapStore((state) => state.activeTool);
  const addFeature = useMapStore((state) => state.addFeature);
  const removeFeature = useMapStore((state) => state.removeFeature);

  useEffect(() => {
    if (!map) return;

    const layers = map.getLayers().getArray();
    const vectorLayer = layers.find(
      (layer): layer is VectorLayer<VectorSource<Feature<Geometry>>> => 
        layer instanceof VectorLayer
    );

    if (!vectorLayer) {
      console.warn('⚠️ Vector layer not found');
      return;
    }

    const source = vectorLayer.getSource();
    if (!source) {
      console.warn('⚠️ Vector source not found');
      return;
    }

    // Remove existing interactions
    const interactions = map.getInteractions().getArray();
    interactions.forEach((interaction) => {
      if (
        interaction instanceof Draw ||
        interaction instanceof Modify ||
        interaction instanceof Select ||
        interaction instanceof Snap
      ) {
        map.removeInteraction(interaction);
      }
    });

    // Common styles
    const drawStyle = new Style({
      fill: new Fill({
        color: 'rgba(59, 130, 246, 0.2)',
      }),
      stroke: new Stroke({
        color: '#3B82F6',
        width: 3,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#3B82F6',
        }),
        stroke: new Stroke({
          color: '#FFFFFF',
          width: 2,
        }),
      }),
    });

    // Tool logic
    switch (activeTool) {
      case 'Point':
      case 'LineString':
      case 'Polygon': {
        const draw = new Draw({
          source: source,
          type: activeTool,
          style: drawStyle,
        });

        draw.on('drawend', (event: DrawEvent) => {
          const feature = event.feature;
          const id = `${activeTool.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          feature.setId(id);
          
          const geometry = feature.getGeometry();
          if (geometry) {
            addFeature({
              id,
              type: activeTool,
              geometry: geometry,
              properties: { createdAt: new Date().toISOString() },
            });
            console.log(`✏️ ${activeTool} added:`, id);
          }
        });

        map.addInteraction(draw);
        map.addInteraction(new Snap({ source: source }));
        console.log(`🎨 ${activeTool} tool activated`);
        break;
      }

      case 'Modify': {
        const select = new Select({
          style: new Style({
            fill: new Fill({
              color: 'rgba(251, 191, 36, 0.2)',
            }),
            stroke: new Stroke({
              color: '#F59E0B',
              width: 3,
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: '#F59E0B',
              }),
              stroke: new Stroke({
                color: '#FFFFFF',
                width: 2,
              }),
            }),
          }),
        });

        const modify = new Modify({
          features: select.getFeatures(),
          style: new Style({
            image: new CircleStyle({
              radius: 5,
              fill: new Fill({
                color: '#F59E0B',
              }),
              stroke: new Stroke({
                color: '#FFFFFF',
                width: 2,
              }),
            }),
          }),
        });

        map.addInteraction(select);
        map.addInteraction(modify);

        modify.on('modifyend', (event: ModifyEvent) => {
          console.log('🔧 Features modified:', event.features.getLength());
        });

        console.log('🔧 Edit tool activated');
        break;
      }

      case 'Delete': {
        const select = new Select({
          style: new Style({
            fill: new Fill({
              color: 'rgba(239, 68, 68, 0.2)',
            }),
            stroke: new Stroke({
              color: '#EF4444',
              width: 3,
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: '#EF4444',
              }),
              stroke: new Stroke({
                color: '#FFFFFF',
                width: 2,
              }),
            }),
          }),
        });

        map.addInteraction(select);

        select.on('select', (event: SelectEvent) => {
          const selectedFeatures = event.selected;
          if (selectedFeatures.length > 0) {
            selectedFeatures.forEach((feature) => {
              if (feature) { // ✅ NULL CHECK
                source.removeFeature(feature);
                const id = feature.getId();
                if (id) {
                  removeFeature(String(id));
                  console.log('🗑️ Deleted feature:', id);
                }
              }
            });
            select.getFeatures().clear();
          }
        });

        console.log('🗑️ Delete tool activated');
        break;
      }

      case 'select':
      default: {
        const select = new Select({
          style: new Style({
            fill: new Fill({
              color: 'rgba(59, 130, 246, 0.3)',
            }),
            stroke: new Stroke({
              color: '#3B82F6',
              width: 3,
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: '#3B82F6',
              }),
              stroke: new Stroke({
                color: '#FFFFFF',
                width: 2,
              }),
            }),
          }),
        });

        map.addInteraction(select);

        select.on('select', (event: SelectEvent) => {
          const selected = event.selected;
          if (selected.length > 0) {
            const feature = selected[0];
            if (feature) { // ✅ NULL CHECK
              const geom = feature.getGeometry();
              console.log('👆 Selected feature:', {
                id: feature.getId(),
                type: geom?.getType(),
              });
            }
          }
        });

        console.log('👆 Select tool activated');
        break;
      }
    }

    // Cleanup
    return () => {
      const interactions = map.getInteractions().getArray();
      interactions.forEach((interaction) => {
        if (
          interaction instanceof Draw ||
          interaction instanceof Modify ||
          interaction instanceof Select ||
          interaction instanceof Snap
        ) {
          map.removeInteraction(interaction);
        }
      });
    };
  }, [map, activeTool, addFeature, removeFeature]);
};
