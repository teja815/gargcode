import React from 'react';
import { Activity } from 'lucide-react';
import { QuantumGate } from '../types/quantum';

interface CircuitDiagramProps {
  numQubits: number;
  gates: QuantumGate[];
}

export const CircuitDiagram: React.FC<CircuitDiagramProps> = ({ numQubits, gates }) => {
  const renderCircuitSVG = () => {
    const width = Math.max(400, 120 * (gates.length + 1));
    const height = 60 * numQubits + 40;

    return (
      <svg width={width} height={height} className="border rounded-lg bg-white">
        {/* Draw wires */}
        {Array.from({ length: numQubits }, (_, q) => {
          const y = 30 + q * 60;
          return (
            <g key={q}>
              <line
                x1={20}
                y1={y}
                x2={width - 20}
                y2={y}
                stroke="#4B5563"
                strokeWidth="2"
              />
              <text x={10} y={y + 5} fontSize="14" textAnchor="middle" fill="#374151">
                q{q}
              </text>
            </g>
          );
        })}

        {/* Draw gates */}
        {gates.map((gate, i) => {
          const x = 100 + i * 120;
          

          if ([
            'X', 'Y', 'Z', 'H', 'S', 'T', 'Sdg', 'Tdg', 'Rx', 'Ry', 'Rz', 'Phase'
          ].includes(gate.type)) {
            const y = 30 + gate.params[0] * 60;
            return (
              <g key={gate.id}>
                <rect
                  x={x - 25}
                  y={y - 25}
                  width={50}
                  height={50}
                  fill="#DBEAFE"
                  stroke="#2563EB"
                  strokeWidth="2"
                  rx="5"
                />
                <text
                  x={x}
                  y={y + 3}
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill="#1E40AF"
                >
                  {gate.type}
                  {gate.angle !== undefined && (
                    <tspan fontSize="10">
                      ({(gate.angle * 180 / Math.PI).toFixed(0)}°)
                    </tspan>
                  )}
                </text>
              </g>
            );
          }

          // Render CZ gate
          if (gate.type === 'CZ') {
            const [control, target] = gate.params;
            const yc = 30 + control * 60;
            const yt = 30 + target * 60;
            return (
              <g key={gate.id}>
                {/* Control dot */}
                <circle cx={x} cy={yc} r="6" fill="#1E40AF" />
                {/* Target Z label */}
                <rect
                  x={x - 15}
                  y={yt - 15}
                  width={30}
                  height={30}
                  fill="#FDE68A"
                  stroke="#CA8A04"
                  strokeWidth="2"
                  rx="6"
                />
                <text
                  x={x}
                  y={yt + 5}
                  fontSize="14"
                  textAnchor="middle"
                  fontWeight="bold"
                  fill="#CA8A04"
                >
                  Z
                </text>
                {/* Connection line */}
                <line x1={x} y1={yc} x2={x} y2={yt} stroke="#CA8A04" strokeWidth="2" />
              </g>
            );
          }

          if (gate.type === 'CNOT') {
            const [control, target] = gate.params;
            const yc = 30 + control * 60;
            const yt = 30 + target * 60;

            return (
              <g key={gate.id}>
                {/* Control dot */}
                <circle cx={x} cy={yc} r="6" fill="#1E40AF" />
                
                {/* Target circle */}
                <circle cx={x} cy={yt} r="15" stroke="#1E40AF" strokeWidth="2" fill="white" />
                <line x1={x - 10} y1={yt} x2={x + 10} y2={yt} stroke="#1E40AF" strokeWidth="2" />
                <line x1={x} y1={yt - 10} x2={x} y2={yt + 10} stroke="#1E40AF" strokeWidth="2" />
                
                {/* Connection line */}
                <line x1={x} y1={yc} x2={x} y2={yt} stroke="#1E40AF" strokeWidth="2" />
              </g>
            );
          }

          if (gate.type === 'SWAP') {
            const [a, b] = gate.params;
            const ya = 30 + a * 60;
            const yb = 30 + b * 60;

            return (
              <g key={gate.id}>
                {/* SWAP symbols */}
                <g stroke="#1E40AF" strokeWidth="2">
                  <line x1={x - 10} y1={ya - 10} x2={x + 10} y2={ya + 10} />
                  <line x1={x - 10} y1={ya + 10} x2={x + 10} y2={ya - 10} />
                  <line x1={x - 10} y1={yb - 10} x2={x + 10} y2={yb + 10} />
                  <line x1={x - 10} y1={yb + 10} x2={x + 10} y2={yb - 10} />
                  <line x1={x} y1={ya} x2={x} y2={yb} />
                </g>
              </g>
            );
          }

          if (gate.type === 'CCNOT') {
            const [c1, c2, target] = gate.params;
            const y1 = 30 + c1 * 60;
            const y2 = 30 + c2 * 60;
            const yt = 30 + target * 60;

            return (
              <g key={gate.id}>
                {/* Control dots */}
                <circle cx={x} cy={y1} r="6" fill="#1E40AF" />
                <circle cx={x} cy={y2} r="6" fill="#1E40AF" />
                
                {/* Target circle */}
                <circle cx={x} cy={yt} r="15" stroke="#1E40AF" strokeWidth="2" fill="white" />
                <line x1={x - 10} y1={yt} x2={x + 10} y2={yt} stroke="#1E40AF" strokeWidth="2" />
                <line x1={x} y1={yt - 10} x2={x} y2={yt + 10} stroke="#1E40AF" strokeWidth="2" />
                
                {/* Connection lines */}
                <line x1={x} y1={Math.min(y1, y2)} x2={x} y2={yt} stroke="#1E40AF" strokeWidth="2" />
              </g>
            );
          }

          return null;
        })}
      </svg>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="h-6 w-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Quantum Circuit</h2>
      </div>
      
      {gates.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="bg-gray-100 rounded-lg p-8">
            <Activity className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No Circuit Yet</p>
            <p className="text-sm">Add gates to see your quantum circuit diagram</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-50 rounded-lg p-4">
          {renderCircuitSVG()}
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Legend:</strong> Blue rectangles = single-qubit gates, Circles with + = CNOT targets, Black dots = control qubits, × symbols = SWAP gates</p>
      </div>
    </div>
  );
};