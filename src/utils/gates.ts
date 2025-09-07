import { ComplexNumber } from '../types/quantum';

// Utility functions for complex numbers
export const c = (re: number, im: number = 0): ComplexNumber => ({ re, im });

export const SQRT1_2 = 1 / Math.sqrt(2);

// Fixed gate matrices
export const GATES: Record<string, ComplexNumber[][]> = {
  X: [[c(0, 0), c(1, 0)], [c(1, 0), c(0, 0)]],
  Y: [[c(0, 0), c(0, -1)], [c(0, 1), c(0, 0)]],
  Z: [[c(1, 0), c(0, 0)], [c(0, 0), c(-1, 0)]],
  H: [[c(SQRT1_2, 0), c(SQRT1_2, 0)], [c(SQRT1_2, 0), c(-SQRT1_2, 0)]],
  S: [[c(1, 0), c(0, 0)], [c(0, 0), c(0, 1)]],
  Sdg: [[c(1, 0), c(0, 0)], [c(0, 0), c(0, -1)]],
  T: [[c(1, 0), c(0, 0)], [c(0, 0), c(Math.cos(Math.PI/4), Math.sin(Math.PI/4))]],
  Tdg: [[c(1, 0), c(0, 0)], [c(0, 0), c(Math.cos(-Math.PI/4), Math.sin(-Math.PI/4))]]
};

// Parameterized gates
export const Rx = (theta: number): ComplexNumber[][] => {
  const th = theta / 2;
  return [
    [c(Math.cos(th), 0), c(0, -Math.sin(th))],
    [c(0, -Math.sin(th)), c(Math.cos(th), 0)]
  ];
};

export const Ry = (theta: number): ComplexNumber[][] => {
  const th = theta / 2;
  return [
    [c(Math.cos(th), 0), c(-Math.sin(th), 0)],
    [c(Math.sin(th), 0), c(Math.cos(th), 0)]
  ];
};

export const Rz = (theta: number): ComplexNumber[][] => {
  const th = theta / 2;
  return [
    [c(Math.cos(-th), Math.sin(-th)), c(0, 0)],
    [c(0, 0), c(Math.cos(th), Math.sin(th))]
  ];
};

export const Phase = (phi: number): ComplexNumber[][] => {
  return [[c(1, 0), c(0, 0)], [c(0, 0), c(Math.cos(phi), Math.sin(phi))]];
};

export const GATE_DEFINITIONS: Record<string, any> = {
  X: { name: 'Pauli-X', category: 'single', parameterized: false, description: 'Bit flip gate' },
  Y: { name: 'Pauli-Y', category: 'single', parameterized: false, description: 'Bit and phase flip gate' },
  Z: { name: 'Pauli-Z', category: 'single', parameterized: false, description: 'Phase flip gate' },
  H: { name: 'Hadamard', category: 'single', parameterized: false, description: 'Creates superposition' },
  S: { name: 'S Gate', category: 'single', parameterized: false, description: 'Phase gate (π/2)' },
  Sdg: { name: 'S† Gate', category: 'single', parameterized: false, description: 'S gate dagger' },
  T: { name: 'T Gate', category: 'single', parameterized: false, description: 'Phase gate (π/4)' },
  Tdg: { name: 'T† Gate', category: 'single', parameterized: false, description: 'T gate dagger' },
  Rx: { name: 'Rx(θ)', category: 'single', parameterized: true, description: 'Rotation around X-axis' },
  Ry: { name: 'Ry(θ)', category: 'single', parameterized: true, description: 'Rotation around Y-axis' },
  Rz: { name: 'Rz(θ)', category: 'single', parameterized: true, description: 'Rotation around Z-axis' },
  Phase: { name: 'Phase(φ)', category: 'single', parameterized: true, description: 'Phase rotation' },
  CNOT: { name: 'CNOT', category: 'two', parameterized: false, description: 'Controlled NOT gate' },
  CZ: { name: 'CZ', category: 'two', parameterized: false, description: 'Controlled Z gate' },
  SWAP: { name: 'SWAP', category: 'two', parameterized: false, description: 'Swap two qubits' },
  CCNOT: { name: 'Toffoli', category: 'three', parameterized: false, description: 'Controlled-controlled NOT' }
};