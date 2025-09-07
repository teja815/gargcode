import React from 'react';
import { Atom, Zap, Activity } from 'lucide-react';
import { useQuantumSimulation } from './hooks/useQuantumSimulation';
import { QuantumControls } from './components/QuantumControls';
import { GateList } from './components/GateList';
import { CircuitDiagram } from './components/CircuitDiagram';
import { BlochVisualization } from './components/BlochVisualization';
import { ResultsDisplay } from './components/ResultsDisplay';

function App() {
  const {
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
  } = useQuantumSimulation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Atom className="h-10 w-10 text-purple-600" />
              <Zap className="h-4 w-4 text-blue-500 absolute -top-1 -right-1" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Quantum Bloch Sphere Visualizer
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Interactive quantum circuit simulation with real-time visualization
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Controls and Gate Management */}
          <div className="xl:col-span-1 space-y-6">
            <QuantumControls
              numQubits={numQubits}
              setNumQubits={setNumQubits}
              initialState={initialState}
              setInitialState={setInitialState}
              onAddGate={addGate}
              onRunSimulation={runSimulation}
              isRunning={isRunning}
            />
            
            <GateList
              gates={gates}
              onRemoveGate={removeGate}
              onMoveGate={moveGate}
              onClearAll={clearGates}
            />
          </div>

          {/* Right Columns - Visualization and Results */}
          <div className="xl:col-span-2 space-y-6">
            {/* Circuit Diagram */}
            <CircuitDiagram numQubits={numQubits} gates={gates} />
            
            {/* Bloch Spheres */}
            <BlochVisualization 
              quantumState={quantumState} 
              isLoading={isRunning}
            />
            
            {/* Results */}
            <ResultsDisplay 
              quantumState={quantumState}
              numQubits={numQubits}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Advanced Quantum Circuit Simulator</span>
            </div>
            <p className="text-xs">
              Explore quantum mechanics through interactive Bloch sphere visualization
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;