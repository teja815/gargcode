import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ChevronUp, ChevronDown, Zap, List } from 'lucide-react';
import { QuantumGate } from '../types/quantum';
import { InteractiveButton } from './InteractiveButton';
import { useTheme } from '../contexts/ThemeContext';

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
  const { isDark } = useTheme();

  if (gates.length === 0) {
    return (
      <motion.div 
        className={`${
          isDark ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-sm rounded-xl shadow-lg p-6 border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <List className={`h-6 w-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Gate Sequence
          </h2>
        </div>
        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap className="h-12 w-12 mx-auto mb-3 opacity-30" />
          </motion.div>
          <p>No gates added yet.</p>
          <p className="text-sm">Add quantum gates to build your circuit.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`${
        isDark ? 'bg-gray-800/90' : 'bg-white/90'
      } backdrop-blur-sm rounded-xl shadow-lg p-6 border ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <List className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Gate Sequence
          </h2>
          <motion.span 
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              isDark 
                ? 'bg-blue-900/50 text-blue-300' 
                : 'bg-blue-100 text-blue-800'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {gates.length} gate{gates.length !== 1 ? 's' : ''}
          </motion.span>
        </div>
        <InteractiveButton
          onClick={onClearAll}
          variant="danger"
          icon={Trash2}
          size="sm"
        >
          Clear All
        </InteractiveButton>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        <AnimatePresence>
          {gates.map((gate, index) => (
            <motion.div
              key={gate.id}
              className={`rounded-lg p-3 flex items-center justify-between hover:shadow-md transition-all duration-200 border ${
                isDark 
                  ? 'bg-gradient-to-r from-gray-700/50 to-blue-800/30 border-gray-600 hover:border-blue-500' 
                  : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200 hover:border-blue-300'
              }`}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              layout
            >
              <div className="flex items-center space-x-3">
                <motion.div 
                  className={`rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ${
                    isDark 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {index + 1}
                </motion.div>
                <div>
                  <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {gate.name}
                    {gate.params.length > 0 && (
                      <span className={`ml-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        (q{gate.params.join(', q')})
                      </span>
                    )}
                    {gate.angle !== undefined && (
                      <span className={`ml-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                        {(gate.angle * 180 / Math.PI).toFixed(1)}°
                      </span>
                    )}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {gate.description}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <motion.button
                  onClick={() => onMoveGate(gate.id, 'up')}
                  disabled={index === 0}
                  className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'text-gray-400 hover:text-blue-400' 
                      : 'text-gray-400 hover:text-blue-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </motion.button>
                
                <motion.button
                  onClick={() => onMoveGate(gate.id, 'down')}
                  disabled={index === gates.length - 1}
                  className={`p-1 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    isDark 
                      ? 'text-gray-400 hover:text-blue-400' 
                      : 'text-gray-400 hover:text-blue-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.button>
                
                <motion.button
                  onClick={() => onRemoveGate(gate.id)}
                  className={`p-1 rounded transition-colors ml-2 ${
                    isDark 
                      ? 'text-gray-400 hover:text-red-400' 
                      : 'text-gray-400 hover:text-red-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title="Remove gate"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
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