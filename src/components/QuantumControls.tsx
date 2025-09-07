import React, { useState } from 'react';
import { Play, Settings, Zap } from 'lucide-react';
import { QuantumGate } from '../types/quantum';
import { GATE_DEFINITIONS } from '../utils/gates';

interface QuantumControlsProps {
  numQubits: number;
  setNumQubits: (n: number) => void;
  initialState: number;
  setInitialState: (state: number) => void;
  onAddGate: (gate: QuantumGate) => void;
  onRunSimulation: () => void;
  isRunning: boolean;
}

export const QuantumControls: React.FC<QuantumControlsProps> = ({
  numQubits,
  setNumQubits,
  initialState,
  setInitialState,
  onAddGate,
  onRunSimulation,
  isRunning
}) => {
  const [selectedGateType, setSelectedGateType] = useState('X');
  const [targetQubit, setTargetQubit] = useState(0);
  const [controlQubit, setControlQubit] = useState(0);
  const [targetQubit2, setTargetQubit2] = useState(1);
  const [swapA, setSwapA] = useState(0);
  const [swapB, setSwapB] = useState(1);
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(1);
  const [ccTarget, setCcTarget] = useState(2);
  const [angle, setAngle] = useState(90);

  const generateBasisStates = () => {
    const states = [];
    for (let i = 0; i < (1 << numQubits); i++) {
      const binary = i.toString(2).padStart(numQubits, '0');
      const label = binary.split('').map(bit => `|${bit}⟩`).join(' ⊗ ');
      states.push({ value: i, label, binary });
    }
    return states;
  };

  const handleAddGate = () => {
    const gateDefinition = GATE_DEFINITIONS[selectedGateType];
    let gate: QuantumGate;

    switch (gateDefinition.category) {
      case 'single':
        gate = {
          id: '',
          type: selectedGateType,
          params: [targetQubit],
          name: gateDefinition.name,
          description: gateDefinition.description
        };
        if (gateDefinition.parameterized) {
          gate.angle = (angle * Math.PI) / 180;
        }
        break;
      case 'two':
        if (selectedGateType === 'SWAP') {
          if (swapA === swapB) {
            alert('SWAP qubits must be different');
            return;
          }
          gate = {
            id: '',
            type: selectedGateType,
            params: [swapA, swapB],
            name: gateDefinition.name,
            description: gateDefinition.description
          };
        } else {
          if (controlQubit === targetQubit2) {
            alert('Control and target must be different');
            return;
          }
          gate = {
            id: '',
            type: selectedGateType,
            params: [controlQubit, targetQubit2],
            name: gateDefinition.name,
            description: gateDefinition.description
          };
        }
        break;
      case 'three':
        const controls = new Set([c1, c2, ccTarget]);
        if (controls.size < 3) {
          alert('All three qubits must be different');
          return;
        }
        gate = {
          id: '',
          type: selectedGateType,
          params: [c1, c2, ccTarget],
          name: gateDefinition.name,
          description: gateDefinition.description
        };
        break;
      default:
        return;
    }

    onAddGate(gate);
  };

  const renderGateInputs = () => {
    const gateDefinition = GATE_DEFINITIONS[selectedGateType];

    return (
      <div className="space-y-4">
        {gateDefinition.category === 'single' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Qubit
              </label>
              <select
                value={targetQubit}
                onChange={(e) => setTargetQubit(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
            {gateDefinition.parameterized && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedGateType === 'Phase' ? 'φ (degrees)' : 'θ (degrees)'}
                </label>
                <input
                  type="number"
                  value={angle}
                  onChange={(e) => setAngle(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  step="1"
                />
              </div>
            )}
          </>
        )}

        {gateDefinition.category === 'two' && selectedGateType !== 'SWAP' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Control Qubit
              </label>
              <select
                value={controlQubit}
                onChange={(e) => setControlQubit(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Qubit
              </label>
              <select
                value={targetQubit2}
                onChange={(e) => setTargetQubit2(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {selectedGateType === 'SWAP' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qubit A
              </label>
              <select
                value={swapA}
                onChange={(e) => setSwapA(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qubit B
              </label>
              <select
                value={swapB}
                onChange={(e) => setSwapB(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {gateDefinition.category === 'three' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Control 1
              </label>
              <select
                value={c1}
                onChange={(e) => setC1(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Control 2
              </label>
              <select
                value={c2}
                onChange={(e) => setC2(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target
              </label>
              <select
                value={ccTarget}
                onChange={(e) => setCcTarget(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>q{i}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Quantum Controls</h2>
      </div>

      {/* System Configuration */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-gray-800">System Configuration</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Qubits (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={numQubits}
            onChange={(e) => {
              const n = parseInt(e.target.value);
              if (n >= 1 && n <= 5) {
                setNumQubits(n);
                setInitialState(0); // Reset initial state
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Basis State
          </label>
          <select
            value={initialState}
            onChange={(e) => setInitialState(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {generateBasisStates().map(state => (
              <option key={state.value} value={state.value}>
                |{state.binary}⟩ = {state.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gate Selection */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-gray-800">Add Quantum Gate</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gate Type
          </label>
          <select
            value={selectedGateType}
            onChange={(e) => setSelectedGateType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <optgroup label="Single-Qubit (Fixed)">
              <option value="X">X (Pauli-X)</option>
              <option value="Y">Y (Pauli-Y)</option>
              <option value="Z">Z (Pauli-Z)</option>
              <option value="H">H (Hadamard)</option>
              <option value="S">S</option>
              <option value="Sdg">S†</option>
              <option value="T">T</option>
              <option value="Tdg">T†</option>
            </optgroup>
            <optgroup label="Single-Qubit (Parameterized)">
              <option value="Rx">Rx(θ)</option>
              <option value="Ry">Ry(θ)</option>
              <option value="Rz">Rz(θ)</option>
              <option value="Phase">Phase(φ)</option>
            </optgroup>
            <optgroup label="Two-Qubit">
              <option value="CNOT">CNOT</option>
              <option value="CZ">CZ</option>
              <option value="SWAP">SWAP</option>
            </optgroup>
            {numQubits >= 3 && (
              <optgroup label="Three-Qubit">
                <option value="CCNOT">CCNOT (Toffoli)</option>
              </optgroup>
            )}
          </select>
        </div>

        <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
          <strong>{GATE_DEFINITIONS[selectedGateType]?.name}:</strong>{' '}
          {GATE_DEFINITIONS[selectedGateType]?.description}
        </div>

        {renderGateInputs()}

        <button
          onClick={handleAddGate}
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
        >
          <Zap className="h-4 w-4" />
          <span>Add Gate</span>
        </button>
      </div>

      {/* Run Simulation */}
      <button
        onClick={onRunSimulation}
        disabled={isRunning}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play className="h-5 w-5" />
        <span>{isRunning ? 'Running Simulation...' : 'Run Quantum Simulation'}</span>
      </button>
    </div>
  );
};