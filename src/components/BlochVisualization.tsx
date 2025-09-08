import React from 'react';
import { motion } from 'framer-motion';
import { Atom } from 'lucide-react';
import { BlochSphere } from './BlochSphere';
import { QuantumState } from '../types/quantum';
import { useTheme } from '../contexts/ThemeContext';

interface BlochVisualizationProps {
  quantumState: QuantumState | null;
  isLoading: boolean;
}

export const BlochVisualization: React.FC<BlochVisualizationProps> = ({
  quantumState,
  isLoading
}) => {
  const { isDark } = useTheme();

  if (isLoading) {
    return (
      <motion.div 
        className={`${
          isDark ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-sm rounded-xl shadow-lg p-6 border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Atom className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </motion.div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Bloch Sphere Visualization
          </h2>
        </div>
        
        <div className="flex items-center justify-center py-16">
          <motion.div 
            className={`rounded-full h-12 w-12 border-b-2 ${
              isDark ? 'border-purple-400' : 'border-purple-600'
            }`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <span className={`ml-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Running quantum simulation...
          </span>
        </div>
      </motion.div>
    );
  }

  if (!quantumState) {
    return (
      <motion.div 
        className={`${
          isDark ? 'bg-gray-800/90' : 'bg-white/90'
        } backdrop-blur-sm rounded-xl shadow-lg p-6 border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Atom className={`h-6 w-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Bloch Sphere Visualization
          </h2>
        </div>
        
        <div className={`text-center py-16 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Atom className="h-16 w-16 mx-auto mb-4 opacity-30" />
          </motion.div>
          <p className="text-lg font-medium">Ready for Quantum Visualization</p>
          <p className="text-sm">Run the simulation to see Bloch sphere representations</p>
          <div className={`mt-6 text-xs max-w-md mx-auto ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <p>The Bloch sphere is a geometric representation of qubit states. Each point on the sphere represents a unique quantum state, with |0⟩ at the north pole and |1⟩ at the south pole.</p>
          </div>
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Atom className={`h-6 w-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          </motion.div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Bloch Sphere Visualization
          </h2>
        </div>
        <motion.div 
          className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {quantumState.blochVectors.length} qubit{quantumState.blochVectors.length !== 1 ? 's' : ''}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {quantumState.blochVectors.map((blochVector, index) => {
          const reduced = quantumState.reducedStates[index];
          const measurements = {
            prob0: reduced[0][0].re,
            prob1: reduced[1][1].re
          };
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlochSphere
                blochVector={blochVector}
                qubitIndex={index}
                measurements={measurements}
              />
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        className={`mt-6 rounded-lg p-4 ${
          isDark 
            ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-800/30' 
            : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/30'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Quantum Information
        </h3>
        <div className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          <p><strong>Tensor Products (⊗):</strong> Multi-qubit systems are described by tensor products of individual qubit states.</p>
          <p><strong>Entanglement:</strong> When qubits become entangled, individual Bloch vectors may not capture the complete quantum state.</p>
          <p><strong>Measurement:</strong> The position of the Bloch vector determines the probability of measuring |0⟩ or |1⟩.</p>
        </div>
      </motion.div>
    </motion.div>
  );
};