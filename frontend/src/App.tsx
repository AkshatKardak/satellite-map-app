import { MapView } from './components/Map/MapView';
import { SearchBar } from './components/Controls/SearchBar';
import { DrawingTools } from './components/Controls/DrawingTools';
import { LayerManager } from './components/Controls/LayerManager';
import { CustomZoomControls } from './components/Controls/CustomZoomControls';
import { MobileToolbar } from './components/Controls/MobileToolbar';

function App() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50">
      <MapView />
      <SearchBar />
      <DrawingTools />
      <LayerManager />
      <CustomZoomControls />
      <MobileToolbar />

      <div className="absolute bottom-2 left-2 z-[800] hidden md:block">
        <div className="card px-3 py-2 text-xs text-gray-600 font-medium opacity-90">
          © OpenStreetMap contributors
        </div>
      </div>
    </div>
  );
}

export default App;
