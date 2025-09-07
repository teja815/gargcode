export interface ComplexNumber {
  re: number;
  im: number;
}

export interface QuantumGate {
  id: string;
  type: string;
  params: number[];
  angle?: number;
  name: string;
  description: string;
}

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

export interface QuantumState {
  amplitudes: ComplexNumber[];
  densityMatrix: ComplexNumber[][];
  reducedStates: ComplexNumber[][][];
  blochVectors: BlochVector[];
}

export interface GateDefinition {
  name: string;
  category: 'single' | 'two' | 'three';
  parameterized: boolean;
  matrix?: ComplexNumber[][];
  description: string;
}