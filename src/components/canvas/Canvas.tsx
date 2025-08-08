import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import './Canvas.css';

export const Canvas: React.FC = () => {
  return (
    <div className="canvas-container">
      <div className="canvas-content">
        <div className="canvas-stage">
          <Stage width={800} height={600}>
            <Layer>
              <Rect
                width={800}
                height={600}
                fill="white"
                stroke="#e2e8f0"
                strokeWidth={1}
              />
              <Text
                text="Drag and drop components here"
                x={300}
                y={290}
                fontSize={16}
                fill="#94a3b8"
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};
