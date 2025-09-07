import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { BlochVector } from '../types/quantum';
import { calculateEntropy, calculatePurity } from '../utils/quantumMath';

interface BlochSphereProps {
  blochVector: BlochVector;
  qubitIndex: number;
  measurements: { prob0: number; prob1: number };
}

export const BlochSphere: React.FC<BlochSphereProps> = ({ 
  blochVector, 
  qubitIndex, 
  measurements 
}) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current) return;

    const { x, y, z } = blochVector;
    
    // Create sphere surface
    const u = Array.from({ length: 31 }, (_, i) => i);
    const v = Array.from({ length: 31 }, (_, i) => i);
    
    const xs = u.map(i => v.map(j => Math.sin(Math.PI * i / 30) * Math.cos(2 * Math.PI * j / 30)));
    const ys = u.map(i => v.map(j => Math.sin(Math.PI * i / 30) * Math.sin(2 * Math.PI * j / 30)));
    const zs = u.map(i => v.map(j => Math.cos(Math.PI * i / 30)));

    const sphere = {
      type: 'surface' as const,
      x: xs,
      y: ys,
      z: zs,
      opacity: 0.3,
      colorscale: [[0, 'rgba(59, 130, 246, 0.1)'], [1, 'rgba(147, 51, 234, 0.1)']],
      showscale: false,
      hoverinfo: 'skip' as const,
      contours: {
        x: { show: true, color: 'rgba(0,0,0,0.1)', width: 1 },
        y: { show: true, color: 'rgba(0,0,0,0.1)', width: 1 },
        z: { show: true, color: 'rgba(0,0,0,0.1)', width: 1 }
      }
    };

    // Coordinate axes
    const axes = [
      {
        type: 'scatter3d' as const,
        mode: 'lines' as const,
        x: [-1.2, 1.2],
        y: [0, 0],
        z: [0, 0],
        line: { width: 3, color: '#EF4444' },
        hoverinfo: 'skip' as const,
        name: 'X-axis'
      },
      {
        type: 'scatter3d' as const,
        mode: 'lines' as const,
        x: [0, 0],
        y: [-1.2, 1.2],
        z: [0, 0],
        line: { width: 3, color: '#10B981' },
        hoverinfo: 'skip' as const,
        name: 'Y-axis'
      },
      {
        type: 'scatter3d' as const,
        mode: 'lines' as const,
        x: [0, 0],
        y: [0, 0],
        z: [-1.2, 1.2],
        line: { width: 3, color: '#3B82F6' },
        hoverinfo: 'skip' as const,
        name: 'Z-axis'
      }
    ];

    // State vector
    const stateVector = {
      type: 'scatter3d' as const,
      mode: 'lines+markers' as const,
      x: [0, x],
      y: [0, y],
      z: [0, z],
      line: { width: 6, color: '#F59E0B' },
      marker: { size: 8, color: '#F59E0B' },
      hovertemplate: `<b>Qubit ${qubitIndex}</b><br>` +
                    `X: ${x.toFixed(3)}<br>` +
                    `Y: ${y.toFixed(3)}<br>` +
                    `Z: ${z.toFixed(3)}<br>` +
                    `<extra></extra>`,
      name: 'Qubit State'
    };

    // Arrowhead at the end of the vector
    const arrowHead = {
      type: 'cone' as const,
      x: [x],
      y: [y],
      z: [z],
      u: [x * 0.1],
      v: [y * 0.1],
      w: [z * 0.1],
      sizemode: 'absolute' as const,
      sizeref: 0.1,
      anchor: 'tip' as const,
      colorscale: [[0, '#F59E0B'], [1, '#F59E0B']],
      showscale: false,
      hoverinfo: 'skip' as const
    };

    // Labels for basis states
    const labels = {
      type: 'scatter3d' as const,
      mode: 'text' as const,
      x: [0, 0, 1.4, -1.4, 0, 0],
      y: [0, 0, 0, 0, 1.4, -1.4],
      z: [1.4, -1.4, 0, 0, 0, 0],
      text: ['|0⟩', '|1⟩', '|+⟩', '|−⟩', '|+i⟩', '|−i⟩'],
      textfont: { size: 12, color: '#6B7280' },
      textposition: 'middle center' as const,
      hoverinfo: 'text' as const,
      name: 'Basis States'
    };

    const layout = {
      title: {
        text: `Qubit ${qubitIndex}`,
        font: { size: 16, color: '#1F2937' }
      },
      margin: { l: 0, r: 0, b: 0, t: 40 },
      scene: {
        aspectmode: 'cube' as const,
        camera: { eye: { x: 1.2, y: 1.2, z: 0.8 } },
        xaxis: {
          range: [-1.5, 1.5],
          showgrid: false,
          zeroline: false,
          showticklabels: false,
          visible: false
        },
        yaxis: {
          range: [-1.5, 1.5],
          showgrid: false,
          zeroline: false,
          showticklabels: false,
          visible: false
        },
        zaxis: {
          range: [-1.5, 1.5],
          showgrid: false,
          zeroline: false,
          showticklabels: false,
          visible: false
        }
      },
      showlegend: false,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    };

    const config = {
      displayModeBar: false,
      responsive: true
    };

    Plotly.newPlot(
      plotRef.current,
      [sphere, ...axes, stateVector, arrowHead, labels],
      layout,
      config
    );

  }, [blochVector, qubitIndex]);

  const entropy = calculateEntropy(blochVector);
  const purity = calculatePurity(blochVector);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div ref={plotRef} className="h-80" />
      <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t">
        <h3 className="font-semibold text-gray-900 mb-3">Qubit {qubitIndex} Properties</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Bloch Vector</div>
            <div className="font-mono text-xs bg-white p-2 rounded border">
              ({blochVector.x.toFixed(3)}, {blochVector.y.toFixed(3)}, {blochVector.z.toFixed(3)})
            </div>
          </div>
          
          <div>
            <div className="text-gray-600">Measurements</div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>|0⟩:</span>
                <span className="font-mono">{(measurements.prob0 * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>|1⟩:</span>
                <span className="font-mono">{(measurements.prob1 * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-gray-600">Von Neumann Entropy</div>
            <div className="font-mono text-purple-600 font-semibold">
              {entropy.toFixed(4)} bits
            </div>
          </div>
          
          <div>
            <div className="text-gray-600">Purity</div>
            <div className="font-mono text-blue-600 font-semibold">
              {purity.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};