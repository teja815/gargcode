import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Zap, Activity } from 'lucide-react';
import { useQuantumSimulation } from './hooks/useQuantumSimulation';
import { QuantumControls } from './components/QuantumControls';
import { GateList } from './components/GateList';
import { CircuitDiagram } from './components/CircuitDiagram';
import { BlochVisualization } from './components/BlochVisualization';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { AnimatedBackground } from './components/AnimatedBackground';

function AppContent() {
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
  
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <motion.header 
        className={`${
          isDark ? 'bg-gray-900/90' : 'bg-white/90'
        } backdrop-blur-sm shadow-lg border-b ${
          isDark ? 'border-purple-800/30' : 'border-purple-100'
        } relative z-10`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Atom className={`h-10 w-10 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </motion.div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Zap className={`h-4 w-4 absolute -top-1 -right-1 ${
                    isDark ? 'text-blue-400' : 'text-blue-500'
                  }`} />
                </motion.div>
              </div>
              <div>
                <motion.h1 
                  className={`text-3xl font-bold bg-gradient-to-r ${
                    isDark 
                      ? 'from-purple-400 to-blue-400' 
                      : 'from-purple-600 to-blue-600'
                  } bg-clip-text text-transparent`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Quantum Bloch Sphere Visualizer
                </motion.h1>
                <motion.p 
                  className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Interactive quantum circuit simulation with real-time visualization
                </motion.p>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </motion.header>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
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
      <motion.footer 
        className={`${
          isDark ? 'bg-gray-900/90' : 'bg-white/90'
        } backdrop-blur-sm border-t ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        } mt-16 relative z-10`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity className="h-4 w-4" />
              </motion.div>
              <span className="text-sm font-medium">Advanced Quantum Circuit Simulator</span>
            </div>
            <p className="text-xs">
              Explore quantum mechanics through interactive Bloch sphere visualization
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;