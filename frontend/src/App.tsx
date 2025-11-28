import { MapView } from './components/Map/MapView';
import { DrawingTools } from './components/Controls/DrawingTools';
import { LayerManager } from './components/Controls/LayerManager';
import { SearchBar } from './components/Controls/SearchBar';
import { CustomZoomControls } from './components/Controls/CustomZoomControls';
import { ChangeDetection } from './components/Features/ChangeDetection';

function App() {
  return (
    <div className="h-screen w-screen relative bg-gray-100">
      {/* Debug overlay to check if React is loading */}
      <div className="absolute top-2 left-2 z-50 bg-green-500 text-white px-3 py-1 rounded-lg shadow-md text-sm">
        ✅ React is loading!
      </div>
      
      {/* Map Container */}
      <div className="absolute inset-0">
        <MapView />
      </div>
      
      {/* UI Controls */}
      <DrawingTools />
      <LayerManager />
      <SearchBar />
      <CustomZoomControls />
      <ChangeDetection />
      
      {/* Feature List Panel */}
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-h-48 overflow-y-auto custom-scrollbar z-10">
        <h3 className="font-semibold mb-2 text-gray-800">Drawn Features</h3>
        <div data-testid="feature-list" className="space-y-2">
          <div className="text-sm text-gray-500 text-center py-4">
            No features drawn yet. Use the drawing tools to create points, lines, or polygons.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;