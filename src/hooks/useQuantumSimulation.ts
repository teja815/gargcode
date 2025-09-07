import { useState, useCallback } from 'react';
import { QuantumGate, QuantumState } from '../types/quantum';
import { QuantumSimulator } from '../utils/quantumMath';
import { GATES, Rx, Ry, Rz, Phase } from '../utils/gates';

export const useQuantumSimulation = () => {
  const [numQubits, setNumQubits] = useState(2);
  const [initialState, setInitialState] = useState(0);
  const [gates, setGates] = useState<QuantumGate[]>([]);
  const [quantumState, setQuantumState] = useState<QuantumState | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const addGate = useCallback((gate: QuantumGate) => {
    setGates(prev => [...prev, { ...gate, id: Date.now().toString() + Math.random() }]);
  }, []);

  const removeGate = useCallback((id: string) => {
    setGates(prev => prev.filter(gate => gate.id !== id));
  }, []);

  const moveGate = useCallback((id: string, direction: 'up' | 'down') => {
    setGates(prev => {
      const index = prev.findIndex(gate => gate.id === id);
      if (index === -1) return prev;

      const newGates = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newGates.length) {
        [newGates[index], newGates[targetIndex]] = [newGates[targetIndex], newGates[index]];
      }
      
      return newGates;
    });
  }, []);

  const clearGates = useCallback(() => {
    setGates([]);
  }, []);

  const runSimulation = useCallback(async () => {
    setIsRunning(true);
    
    // Add slight delay for loading animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const simulator = new QuantumSimulator(numQubits, initialState);
      
      for (const gate of gates) {
        switch (gate.type) {
          case 'X':
          case 'Y':
          case 'Z':
          case 'H':
          case 'S':
          case 'Sdg':
          case 'T':
          case 'Tdg':
            simulator.applySingleQubitGate(gate.params[0], GATES[gate.type]);
            break;
          case 'Rx':
            simulator.applySingleQubitGate(gate.params[0], Rx(gate.angle!));
            break;
          case 'Ry':
            simulator.applySingleQubitGate(gate.params[0], Ry(gate.angle!));
            break;
          case 'Rz':
            simulator.applySingleQubitGate(gate.params[0], Rz(gate.angle!));
            break;
          case 'Phase':
            simulator.applySingleQubitGate(gate.params[0], Phase(gate.angle!));
            break;
          case 'CNOT':
            simulator.applyCNOT(gate.params[0], gate.params[1]);
            break;
          case 'CZ':
            simulator.applyCZ(gate.params[0], gate.params[1]);
            break;
          case 'SWAP':
            simulator.applySWAP(gate.params[0], gate.params[1]);
            break;
          case 'CCNOT':
            simulator.applyCCNOT(gate.params[0], gate.params[1], gate.params[2]);
            break;
        }
      }
      
      setQuantumState(simulator.getQuantumState());
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsRunning(false);
    }
  }, [numQubits, initialState, gates]);

  return {
    numQubits,
    setNumQubits,
    initialState,
    setInitialState,
    gates,
    addGate,
    removeGate,
    moveGate,
    clearGates,
    quantumState,
    runSimulation,
    isRunning
  };
};