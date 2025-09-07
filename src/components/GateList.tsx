import React from 'react';
import { Trash2, ChevronUp, ChevronDown, Zap, List } from 'lucide-react';
import { QuantumGate } from '../types/quantum';

interface GateListProps {
  gates: QuantumGate[];
  onRemoveGate: (id: string) => void;
  onMoveGate: (id: string, direction: 'up' | 'down') => void;
  onClearAll: () => void;
}

export const GateList: React.FC<GateListProps> = ({
  gates,
  onRemoveGate,
  onMoveGate,
  onClearAll
}) => {
  if (gates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <List className="h-6 w-6 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900">Gate Sequence</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <Zap className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No gates added yet.</p>
          <p className="text-sm">Add quantum gates to build your circuit.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <List className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Gate Sequence</h2>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            {gates.length} gate{gates.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={onClearAll}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {gates.map((gate, index) => (
          <div
            key={gate.id}
            className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {gate.name}
                  {gate.params.length > 0 && (
                    <span className="text-gray-600 ml-1">
                      (q{gate.params.join(', q')})
                    </span>
                  )}
                  {gate.angle !== undefined && (
                    <span className="text-purple-600 ml-1">
                      {(gate.angle * 180 / Math.PI).toFixed(1)}°
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {gate.description}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onMoveGate(gate.id, 'up')}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move up"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onMoveGate(gate.id, 'down')}
                disabled={index === gates.length - 1}
                className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move down"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => onRemoveGate(gate.id)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors ml-2"
                title="Remove gate"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};