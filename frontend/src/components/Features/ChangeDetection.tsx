import { useState } from 'react';
import { useMapStore } from '../../stores/mapStore';
import { ChangeDetectionResult } from '../../types/map';
import { Loader } from '../UI/Loader';
import { BarChart3, Calendar, MapPin } from 'lucide-react';

export const ChangeDetection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ChangeDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dates, setDates] = useState({
    beforeDate: '2023-01-01',
    afterDate: '2024-01-01'
  });

  const { map } = useMapStore();

  const performChangeDetection = async () => {
    if (!map) {
      setError('Map not available');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    
    try {
      const view = map.getView();
      const extent = view.calculateExtent(map.getSize());
      
      const response = await fetch('/api/change-detection/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bounds: extent,
          beforeDate: dates.beforeDate,
          afterDate: dates.afterDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Change detection failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Change detection failed');
      }

      setResult(data.data);
      
    } catch (err) {
      console.error('Change detection error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getChangeSeverity = (percentage: number) => {
    if (percentage < 5) return { color: 'text-green-600', label: 'Low' };
    if (percentage < 15) return { color: 'text-yellow-600', label: 'Medium' };
    return { color: 'text-red-600', label: 'High' };
  };

  return (
    <div className="absolute top-20 right-4 z-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <BarChart3 size={20} />
        Change Detection
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl p-6 w-96 z-20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Change Detection Analysis
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Calendar size={14} />
                  Before Date
                </label>
                <input
                  type="date"
                  value={dates.beforeDate}
                  onChange={(e) => setDates(prev => ({ ...prev, beforeDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  max={dates.afterDate}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                  <Calendar size={14} />
                  After Date
                </label>
                <input
                  type="date"
                  value={dates.afterDate}
                  onChange={(e) => setDates(prev => ({ ...prev, afterDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  min={dates.beforeDate}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <button
              onClick={performChangeDetection}
              disabled={isAnalyzing}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader size="sm" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 size={16} />
                  Detect Changes
                </>
              )}
            </button>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {result && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md border">
                <h4 className="font-semibold mb-3 text-gray-800">Analysis Results</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Change Percentage:</span>
                    <span className={`text-lg font-bold ${
                      getChangeSeverity(result.changePercentage).color
                    }`}>
                      {result.changePercentage.toFixed(2)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Changed Areas:</span>
                    <span className="font-semibold flex items-center gap-1">
                      <MapPin size={14} />
                      {result.changedAreas.length}
                    </span>
                  </div>

                  <div className="text-xs text-gray-600">
                    Analyzed on: {new Date(result.timestamp).toLocaleString()}
                  </div>

                  {/* Image Comparison */}
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <img 
                        src={`data:image/png;base64,${result.beforeImage}`} 
                        alt="Before" 
                        className="w-full h-20 object-cover rounded border"
                      />
                      <p className="text-xs text-gray-600 mt-1">Before</p>
                    </div>
                    <div className="text-center">
                      <img 
                        src={`data:image/png;base64,${result.afterImage}`} 
                        alt="After" 
                        className="w-full h-20 object-cover rounded border"
                      />
                      <p className="text-xs text-gray-600 mt-1">After</p>
                    </div>
                    <div className="text-center">
                      <img 
                        src={`data:image/png;base64,${result.differenceImage}`} 
                        alt="Difference" 
                        className="w-full h-20 object-cover rounded border"
                      />
                      <p className="text-xs text-gray-600 mt-1">Difference</p>
                    </div>
                  </div>

                  {/* Changed Areas List */}
                  {result.changedAreas.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium mb-2">Changed Areas:</h5>
                      <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                        {result.changedAreas.map((area, index) => (
                          <div key={index} className="flex justify-between items-center text-xs p-2 bg-white rounded border">
                            <span>Area {index + 1}</span>
                            <span className={`px-2 py-1 rounded ${
                              area.confidence > 0.7 ? 'bg-red-100 text-red-800' :
                              area.confidence > 0.3 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {Math.round(area.confidence * 100)}% conf
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};