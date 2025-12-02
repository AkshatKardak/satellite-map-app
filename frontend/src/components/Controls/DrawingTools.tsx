import { MousePointer2, MapPin, Minus, Pentagon, Edit3, Trash2, LucideIcon } from 'lucide-react';
import { useMapStore } from '../../stores/mapStore';

interface Tool {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  gradient: string;
}

const tools: Tool[] = [
  { 
    id: 'select', 
    icon: MousePointer2, 
    label: 'Select', 
    description: 'Select & view features',
    gradient: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'Point', 
    icon: MapPin, 
    label: 'Point', 
    description: 'Add point markers',
    gradient: 'from-green-500 to-green-600'
  },
  { 
    id: 'LineString', 
    icon: Minus, 
    label: 'Line', 
    description: 'Draw lines',
    gradient: 'from-purple-500 to-purple-600'
  },
  { 
    id: 'Polygon', 
    icon: Pentagon, 
    label: 'Polygon', 
    description: 'Draw areas',
    gradient: 'from-orange-500 to-orange-600'
  },
  { 
    id: 'Modify', 
    icon: Edit3, 
    label: 'Edit', 
    description: 'Modify features',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  { 
    id: 'Delete', 
    icon: Trash2, 
    label: 'Delete', 
    description: 'Remove features',
    gradient: 'from-red-500 to-red-600'
  }
];

export const DrawingTools = () => {
  const activeTool = useMapStore((state) => state.activeTool);
  const setActiveTool = useMapStore((state) => state.setActiveTool);
  const features = useMapStore((state) => state.features);

  return (
    <div className="absolute left-5 top-1/2 -translate-y-1/2 z-[900] hidden md:block animate-slide-left">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2.5 space-y-2">
        {/* Header */}
        <div className="px-2 pb-2 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Drawing Tools</h3>
        </div>

        {/* Tools */}
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <div key={tool.id} className="relative group">
              <button
                onClick={() => setActiveTool(tool.id)}
                className={`
                  relative w-full p-3.5 rounded-xl transition-all duration-200 select-none
                  ${isActive
                    ? `bg-gradient-to-br ${tool.gradient} text-white shadow-lg scale-105`
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-md'
                  }
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                `}
                aria-label={tool.label}
                title={tool.description}
              >
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`mx-auto ${isActive ? 'drop-shadow-sm' : ''}`}
                />

                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute -right-1 -top-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full shadow-md" />
                )}
              </button>

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50 shadow-2xl">
                <div className="font-bold mb-0.5">{tool.label}</div>
                <div className="text-gray-300 text-xs">{tool.description}</div>
                {/* Arrow */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-900" />
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div className="pt-2 border-t border-gray-100">
          <div className="px-2 py-1.5 bg-blue-50 rounded-lg">
            <div className="text-xs font-bold text-blue-700 text-center">
              {activeTool === 'select' ? 'Ready' : `${activeTool} Mode`}
            </div>
          </div>
          
          {/* Feature Counter */}
          {features.length > 0 && (
            <div className="mt-2 px-2 py-1 bg-green-50 rounded-lg">
              <div className="text-xs font-bold text-green-700 text-center">
                {features.length} {features.length === 1 ? 'feature' : 'features'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
