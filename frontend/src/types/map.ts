export type DrawingTool = 'point' | 'line' | 'polygon' | 'modify' | 'select' | 'none';

export interface MapFeature {
  id: string;
  type: 'Point' | 'LineString' | 'Polygon';
  coordinates: any[];
  properties: {
    name?: string;
    description?: string;
    createdAt: string;
    [key: string]: any;
  };
}

export interface MapState {
  map: any | null;
  activeTool: DrawingTool;
  features: MapFeature[];
  layers: {
    wmsVisible: boolean;
    wmsOpacity: number;
    baseMapVisible: boolean;
  };
  view: {
    center: [number, number];
    zoom: number;
  };
}

export interface ChangeDetectionResult {
  changePercentage: number;
  changedAreas: Array<{
    bounds: [number, number, number, number];
    confidence: number;
  }>;
  beforeImage: string;
  afterImage: string;
  differenceImage: string;
  timestamp: string;
}