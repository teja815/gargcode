import React from 'react';
import { Calculator, Database } from 'lucide-react';
import { QuantumState } from '../types/quantum';

interface ResultsDisplayProps {
  quantumState: QuantumState | null;
  numQubits: number;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  quantumState,
  numQubits
}) => {
  if (!quantumState) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="h-6 w-6 text-gray-400" />
          <h2 className="text-xl font-bold text-gray-900">Quantum State Analysis</h2>
        </div>
        
        <div className="text-center py-8 text-gray-500">
          <Calculator className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>Run simulation to see quantum state analysis</p>
        </div>
      </div>
    );
  }

  const formatComplex = (c: { re: number; im: number }, threshold = 1e-6) => {
    if (Math.abs(c.re) < threshold && Math.abs(c.im) < threshold) return '0';
    
    let result = '';
    if (Math.abs(c.re) >= threshold) {
      result += c.re.toFixed(3);
    }
    if (Math.abs(c.im) >= threshold) {
      if (result && c.im > 0) result += ' + ';
      else if (result && c.im < 0) result += ' - ';
      else if (c.im < 0) result += '-';
      
      if (Math.abs(c.im) !== 1 || !result) {
        result += Math.abs(c.im).toFixed(3);
      }
      result += 'i';
    }
    return result || '0';
  };

  const generateBasisStateLabel = (index: number) => {
    const binary = index.toString(2).padStart(numQubits, '0');
    return `|${binary}⟩`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-bold text-gray-900">Quantum State Analysis</h2>
      </div>

      {/* State Vector Amplitudes */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">State Vector Amplitudes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {quantumState.amplitudes.map((amplitude, index) => {
            const magnitude = Math.sqrt(amplitude.re * amplitude.re + amplitude.im * amplitude.im);
            if (magnitude < 1e-6) return null;
            
            return (
              <div key={index} className="bg-white rounded-lg p-3 border">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm">
                    {generateBasisStateLabel(index)}:
                  </span>
                  <span className="font-mono text-sm text-blue-600">
                    {formatComplex(amplitude)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(magnitude * magnitude) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Probability: {(magnitude * magnitude * 100).toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Qubit States */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Individual Qubit Density Matrices</h3>
        <div className="grid gap-4">
          {quantumState.reducedStates.map((reduced, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border">
              <h4 className="font-medium text-gray-800 mb-2">Qubit {index}</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs font-mono">
                  <tbody>
                    {reduced.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-2 py-1 border text-center bg-gray-50">
                            {formatComplex(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">P(|0⟩):</span>
                  <span className="ml-2 font-semibold text-blue-600">
                    {(reduced[0][0].re * 100).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">P(|1⟩):</span>
                  <span className="ml-2 font-semibold text-red-600">
                    {(reduced[1][1].re * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full System Density Matrix */}
      {quantumState.densityMatrix.length <= 8 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Full System Density Matrix</h3>
          <div className="overflow-x-auto bg-white rounded-lg p-3 border">
            <table className="min-w-full text-xs font-mono">
              <tbody>
                {quantumState.densityMatrix.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-1 py-1 border text-center">
                        {formatComplex(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {quantumState.densityMatrix.length}×{quantumState.densityMatrix.length} complex matrix
          </div>
        </div>
      )}
    </div>
  );
};