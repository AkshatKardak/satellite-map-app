import { useMapStore } from '../../stores/mapStore';
import { DrawingTool } from '../../types/map';
import { 
  MousePointer, 
  Circle, 
  Minus, 
  Hexagon, 
  Edit3 
} from 'lucide-react';

export const DrawingTools = () => {
  const { activeTool, setActiveTool } = useMapStore();

  const tools: { id: DrawingTool; icon: React.ReactNode; label: string }[] = [
    { 
      id: 'select', 
      icon: <MousePointer size={20} />, 
      label: 'Select' 
    },
    { 
      id: 'point', 
      icon: <Circle size={20} />, 
      label: 'Point' 
    },
    { 
      id: 'line', 
      icon: <Minus size={20} />, 
      label: 'Line' 
    },
    { 
      id: 'polygon', 
      icon: <Hexagon size={20} />, 
      label: 'Polygon' 
    },
    { 
      id: 'modify', 
      icon: <Edit3 size={20} />, 
      label: 'Modify' 
    },
  ];

  return (
    <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 z-10">
      <div className="flex flex-col gap-1">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`p-3 rounded-md transition-all duration-200 ${
              activeTool === tool.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
            }`}
            onClick={() => setActiveTool(tool.id)}
            title={tool.label}
            data-testid={`draw-${tool.id}`}
          >
            {tool.icon}
          </button>
        ))}
      </div>
    </div>
  );
};