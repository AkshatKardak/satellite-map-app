import { Map, Layers, PenTool, Search, LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface Tab {
  id: string;
  icon: LucideIcon;
  label: string;
  gradient: string;
}

export const MobileToolbar = () => {
  const [activeTab, setActiveTab] = useState<string>('map');

  const tabs: Tab[] = [
    { id: 'map', icon: Map, label: 'Map', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'search', icon: Search, label: 'Search', gradient: 'from-green-500 to-emerald-500' },
    { id: 'draw', icon: PenTool, label: 'Draw', gradient: 'from-purple-500 to-pink-500' },
    { id: 'layers', icon: Layers, label: 'Layers', gradient: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-[1000] safe-area-bottom shadow-2xl">
      <div className="grid grid-cols-4 gap-1 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl transition-all duration-200 no-select
                ${isActive
                  ? `bg-gradient-to-br ${tab.gradient} text-white shadow-lg scale-105`
                  : 'bg-gray-50 text-gray-600 active:bg-gray-100 active:scale-95'
                }
              `}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-bold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
