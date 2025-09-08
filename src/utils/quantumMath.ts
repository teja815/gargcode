import * as math from 'mathjs';
import { ComplexNumber, QuantumState, BlochVector } from '../types/quantum';
import { GATES, Rx, Ry, Rz, Phase, c } from './gates';

// Convert between mathjs complex and our ComplexNumber type
export const toComplex = (c: ComplexNumber) => math.complex(c.re, c.im);
export const fromComplex = (c: any): ComplexNumber => ({ re: math.re(c), im: math.im(c) });

// Quantum state operations
export class QuantumSimulator {
  private stateVector: any[] = [];
  private numQubits: number = 0;

  constructor(numQubits: number, initialState: number = 0) {
    this.numQubits = numQubits;
    this.initializeState(initialState);
  }

  private initializeState(initialState: number) {
    const dim = 1 << this.numQubits;
    this.stateVector = Array(dim).fill(0).map(() => math.complex(0, 0));
    this.stateVector[initialState] = math.complex(1, 0);
  }

  applySingleQubitGate(target: number, U: ComplexNumber[][]) {
    const dim = this.stateVector.length;
    const newState = Array(dim).fill(0).map(() => math.complex(0, 0));

    for (let i = 0; i < dim; i++) {
      const bin = i.toString(2).padStart(this.numQubits, '0');
      const bit = parseInt(bin[target]);

      for (let j = 0; j < 2; j++) {
        const newBin = bin.substring(0, target) + j.toString() + bin.substring(target + 1);
        const idx = parseInt(newBin, 2);
        const coeff = toComplex(U[j][bit]);
        newState[idx] = math.add(newState[idx], math.multiply(coeff, this.stateVector[i]));
      }
    }
    this.stateVector = newState;
  }

  applyCNOT(control: number, target: number) {
    const dim = this.stateVector.length;
    const newState = Array(dim).fill(0).map(() => math.complex(0, 0));

    for (let i = 0; i < dim; i++) {
      const bin = i.toString(2).padStart(this.numQubits, '0');
      if (bin[control] === '1') {
        const flippedBit = bin[target] === '1' ? '0' : '1';
        const newBin = bin.substring(0, target) + flippedBit + bin.substring(target + 1);
        const idx = parseInt(newBin, 2);
        newState[idx] = math.add(newState[idx], this.stateVector[i]);
      } else {
        newState[i] = math.add(newState[i], this.stateVector[i]);
      }
    }
    this.stateVector = newState;
  }

  applyCZ(control: number, target: number) {
    const dim = this.stateVector.length;
    const newState = Array(dim).fill(0).map(() => math.complex(0, 0));

    for (let i = 0; i < dim; i++) {
      const bin = i.toString(2).padStart(this.numQubits, '0');
      if (bin[control] === '1' && bin[target] === '1') {
        newState[i] = math.add(newState[i], math.multiply(math.complex(-1, 0), this.stateVector[i]));
      } else {
        newState[i] = math.add(newState[i], this.stateVector[i]);
      }
    }
    this.stateVector = newState;
  }

  applySWAP(a: number, b: number) {
    if (a === b) return;

    const dim = this.stateVector.length;
    const newState = Array(dim).fill(0).map(() => math.complex(0, 0));

    for (let i = 0; i < dim; i++) {
      const bin = i.toString(2).padStart(this.numQubits, '0');
      if (bin[a] === bin[b]) {
        newState[i] = math.add(newState[i], this.stateVector[i]);
      } else {
        const swapped = bin.substring(0, Math.min(a, b)) +
          (a < b ? bin[b] : bin[a]) +
          bin.substring(Math.min(a, b) + 1, Math.max(a, b)) +
          (a < b ? bin[a] : bin[b]) +
          bin.substring(Math.max(a, b) + 1);
        const idx = parseInt(swapped, 2);
        newState[idx] = math.add(newState[idx], this.stateVector[i]);
      }
    }
    this.stateVector = newState;
  }

  applyCCNOT(c1: number, c2: number, target: number) {
    const dim = this.stateVector.length;
    const newState = Array(dim).fill(0).map(() => math.complex(0, 0));

    for (let i = 0; i < dim; i++) {
      const bin = i.toString(2).padStart(this.numQubits, '0');
      if (bin[c1] === '1' && bin[c2] === '1') {
        const flippedBit = bin[target] === '1' ? '0' : '1';
        const newBin = bin.substring(0, target) + flippedBit + bin.substring(target + 1);
        const idx = parseInt(newBin, 2);
        newState[idx] = math.add(newState[idx], this.stateVector[i]);
      } else {
        newState[i] = math.add(newState[i], this.stateVector[i]);
      }
    }
    this.stateVector = newState;
  }

  getDensityMatrix(): ComplexNumber[][] {
    const dim = this.stateVector.length;
    const rho: ComplexNumber[][] = Array(dim).fill(0).map(() => 
      Array(dim).fill(0).map(() => c(0, 0))
    );

    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        const product = math.multiply(this.stateVector[i], math.conj(this.stateVector[j]));
        rho[i][j] = fromComplex(product);
      }
    }
    return rho;
  }

  getReducedDensityMatrix(target: number): ComplexNumber[][] {
    const rho = this.getDensityMatrix();
    const dim = rho.length;
    let reduced: ComplexNumber[][] = [[c(0, 0), c(0, 0)], [c(0, 0), c(0, 0)]];

    for (let i = 0; i < dim; i++) {
      for (let j = 0; j < dim; j++) {
        const ib = i.toString(2).padStart(this.numQubits, '0');
        const jb = j.toString(2).padStart(this.numQubits, '0');
        
        let equalOther = true;
        for (let k = 0; k < this.numQubits; k++) {
          if (k !== target && ib[k] !== jb[k]) {
            equalOther = false;
            break;
          }
        }
        
        if (equalOther) {
          const a = parseInt(ib[target]);
          const b = parseInt(jb[target]);
          reduced[a][b] = {
            re: reduced[a][b].re + rho[i][j].re,
            im: reduced[a][b].im + rho[i][j].im
          };
        }
      }
    }
    return reduced;
  }

  getBlochVector(reducedMatrix: ComplexNumber[][]): BlochVector {
    const rho01 = reducedMatrix[0][1];
    const x = 2 * rho01.re;
    const y = -2 * rho01.im;
    const z = reducedMatrix[0][0].re - reducedMatrix[1][1].re;
    return { x, y, z };
  }

  getQuantumState(): QuantumState {
    const amplitudes = this.stateVector.map(fromComplex);
    const densityMatrix = this.getDensityMatrix();
    const reducedStates: ComplexNumber[][][] = [];
    const blochVectors: BlochVector[] = [];

    for (let i = 0; i < this.numQubits; i++) {
      const reduced = this.getReducedDensityMatrix(i);
      reducedStates.push(reduced);
      blochVectors.push(this.getBlochVector(reduced));
    }

    return {
      amplitudes,
      densityMatrix,
      reducedStates,
      blochVectors
    };
  }
}

export const calculateEntropy = (blochVector: BlochVector): number => {
  const { x, y, z } = blochVector;
  const r = Math.sqrt(x * x + y * y + z * z);
  
  const lambda1 = (1 + r) / 2;
  const lambda2 = (1 - r) / 2;
  
  const log2Safe = (val: number) => val > 0 ? Math.log(val) / Math.log(2) : 0;
  
  return -(lambda1 * log2Safe(lambda1) + lambda2 * log2Safe(lambda2));
};

export const calculatePurity = (blochVector: BlochVector): number => {
  const { x, y, z } = blochVector;
  return (1 + x * x + y * y + z * z) / 2;
};