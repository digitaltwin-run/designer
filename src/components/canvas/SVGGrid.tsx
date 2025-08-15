import React from 'react';

interface SVGGridProps {
  viewBox: { x: number; y: number; width: number; height: number };
  gridSize: number;
  visible: boolean;
}

export const SVGGrid: React.FC<SVGGridProps> = ({ viewBox, gridSize, visible }) => {
  if (!visible) return null;

  const { x: startX, y: startY, width, height } = viewBox;
  const endX = startX + width;
  const endY = startY + height;

  // Calculate grid lines within the visible area
  const verticalLines: number[] = [];
  const horizontalLines: number[] = [];

  // Find first grid line positions
  const firstVertical = Math.floor(startX / gridSize) * gridSize;
  const firstHorizontal = Math.floor(startY / gridSize) * gridSize;

  // Generate vertical lines
  for (let x = firstVertical; x <= endX; x += gridSize) {
    if (x >= startX) {
      verticalLines.push(x);
    }
  }

  // Generate horizontal lines
  for (let y = firstHorizontal; y <= endY; y += gridSize) {
    if (y >= startY) {
      horizontalLines.push(y);
    }
  }

  return (
    <g className="svg-grid" opacity="0.1">
      {/* Vertical lines */}
      {verticalLines.map((x) => (
        <line
          key={`v-${x}`}
          x1={x}
          y1={startY}
          x2={x}
          y2={endY}
          stroke="#94a3b8"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      
      {/* Horizontal lines */}
      {horizontalLines.map((y) => (
        <line
          key={`h-${y}`}
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke="#94a3b8"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      
      {/* Major grid lines every 100px */}
      {verticalLines
        .filter((x) => x % (gridSize * 5) === 0)
        .map((x) => (
          <line
            key={`major-v-${x}`}
            x1={x}
            y1={startY}
            x2={x}
            y2={endY}
            stroke="#64748b"
            strokeWidth="1"
            opacity="0.3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      
      {horizontalLines
        .filter((y) => y % (gridSize * 5) === 0)
        .map((y) => (
          <line
            key={`major-h-${y}`}
            x1={startX}
            y1={y}
            x2={endX}
            y2={y}
            stroke="#64748b"
            strokeWidth="1"
            opacity="0.3"
            vectorEffect="non-scaling-stroke"
          />
        ))}
    </g>
  );
};
