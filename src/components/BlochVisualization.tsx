import React from 'react';
import { Atom } from 'lucide-react';
import { BlochSphere } from './BlochSphere';
import { QuantumState } from '../types/quantum';

interface BlochVisualizationProps {
  quantumState: QuantumState | null;
  isLoading: boolean;
}

export const BlochVisualization: React.FC<BlochVisualizationProps> = ({
  quantumState,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Atom className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Bloch Sphere Visualization</h2>
        </div>
        
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <span className="ml-4 text-gray-600">Running quantum simulation...</span>
        </div>
      </div>
    );
  }

  if (!quantumState) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Atom className="h-6 w-6 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900">Bloch Sphere Visualization</h2>
        </div>
        
        <div className="text-center py-16 text-gray-500">
          <Atom className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Ready for Quantum Visualization</p>
          <p className="text-sm">Run the simulation to see Bloch sphere representations</p>
          <div className="mt-6 text-xs text-gray-400 max-w-md mx-auto">
            <p>The Bloch sphere is a geometric representation of qubit states. Each point on the sphere represents a unique quantum state, with |0⟩ at the north pole and |1⟩ at the south pole.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Atom className="h-6 w-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Bloch Sphere Visualization</h2>
        </div>
        <div className="text-sm text-gray-500">
          {quantumState.blochVectors.length} qubit{quantumState.blochVectors.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {quantumState.blochVectors.map((blochVector, index) => {
          const reduced = quantumState.reducedStates[index];
          const measurements = {
            prob0: reduced[0][0].re,
            prob1: reduced[1][1].re
          };
          
          return (
            <BlochSphere
              key={index}
              blochVector={blochVector}
              qubitIndex={index}
              measurements={measurements}
            />
          );
        })}
      </div>

      <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Quantum Information</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p><strong>Tensor Products (⊗):</strong> Multi-qubit systems are described by tensor products of individual qubit states.</p>
          <p><strong>Entanglement:</strong> When qubits become entangled, individual Bloch vectors may not capture the complete quantum state.</p>
          <p><strong>Measurement:</strong> The position of the Bloch vector determines the probability of measuring |0⟩ or |1⟩.</p>
        </div>
      </div>
    </div>
  );
};