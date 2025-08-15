import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Group, Image, Rect, Circle, Line, Text } from 'react-konva';
import { useDrop } from 'react-dnd';
import { useAppStore } from '../../store/useAppStore';
import { AnimatedSVGComponent } from './AnimatedSVGComponent';
import type { Component } from '../../types';
import useImage from 'use-image';
import './Canvas.css';

// List of SVG components that have embedded JavaScript and need AnimatedSVGComponent
const ANIMATED_SVG_COMPONENTS = [
  'led', 'relay', 'pump', 'slider', 'switch', 'motor', 'sensor', 'gauge', 'knob', 
  'button-new', 'button', 'button2', 'counter', 'valve', 'display', 'toggle',
  'modbus8i8o', 'modbus8adc', 'USB2RS485', 'rpi3b', 'rpi4b', 'rpi5b', 'rpizero2w'
];

// Helper function to check if component needs animated SVG rendering
const needsAnimatedSVG = (component: Component): boolean => {
  if (!component.svg) return false;
  const filename = component.svg.split('/').pop()?.replace('.svg', '') || '';
  return ANIMATED_SVG_COMPONENTS.includes(filename);
};

// Component to render individual SVG on canvas with resize handles
const CanvasComponentItem: React.FC<{ 
  canvasComponent: any; 
  component: Component; 
  snapToGrid: (value: number) => number; 
  updateCanvasComponent: any;
  updateMultipleComponents: (updates: { id: string; x: number; y: number }[]) => void;
  gridSize: number;
  isSelected: boolean;
  selectedComponents: any[];
  onSelect: (ctrlKey: boolean) => void;
}> = ({ canvasComponent, component, snapToGrid, updateCanvasComponent, updateMultipleComponents, gridSize, isSelected, selectedComponents, onSelect }) => {
  const [image] = useImage(component.svg);
  const isAnimatedSVG = needsAnimatedSVG(component);
  
  const handleResize = (newWidth: number, newHeight: number) => {
    // Calculate original aspect ratio
    const aspectRatio = canvasComponent.width / canvasComponent.height;
    
    // Use the larger dimension as the primary constraint for proportional scaling
    const primaryDimension = Math.max(newWidth, newHeight / aspectRatio);
    
    // Snap to grid increments while maintaining aspect ratio - ensure minimum size
    const minSize = gridSize * 2; // Minimum 2 grid units
    const snappedWidth = Math.max(minSize, Math.round(primaryDimension / gridSize) * gridSize);
    const snappedHeight = Math.max(minSize, Math.round((snappedWidth / aspectRatio) / gridSize) * gridSize);
    
    console.log('📍 Component resized proportionally to grid:', { 
      original: { width: canvasComponent.width, height: canvasComponent.height },
      raw: { width: newWidth, height: newHeight },
      snapped: { width: snappedWidth, height: snappedHeight },
      aspectRatio: aspectRatio.toFixed(2) 
    });
    
    updateCanvasComponent(canvasComponent.id, {
      width: snappedWidth,
      height: snappedHeight
    });
  };
  
  // Handle animated SVG components
  if (isAnimatedSVG) {
    console.log('🎨 Rendering animated SVG component:', component.name);
    return (
      <AnimatedSVGComponent
        svgUrl={component.svg}
        x={canvasComponent.x}
        y={canvasComponent.y}
        width={canvasComponent.width}
        height={canvasComponent.height}
        visible={canvasComponent.visible !== false}
        selected={isSelected}
        onSelect={() => {
          console.log('🖱️ Animated SVG clicked for selection:', canvasComponent.name);
          onSelect(false); // For now, disable multi-select on animated SVGs
        }}
        className={`canvas-component ${isSelected ? 'selected' : ''}`}
      />
    );
  }

  return (
    <Group>
      <Image
        image={image}
        x={canvasComponent.x}
        y={canvasComponent.y}
        width={canvasComponent.width}
        height={canvasComponent.height}
        draggable
        visible={canvasComponent.visible !== false}
        onClick={(e) => {
          e.cancelBubble = true; // Prevent canvas panning
          const ctrlKey = e.evt.ctrlKey || e.evt.metaKey; // Support both Ctrl and Cmd
          console.log('🖱️ Component clicked for selection:', canvasComponent.name, 'ctrlKey:', ctrlKey);
          onSelect(ctrlKey);
        }}
        onDragStart={(e) => {
          e.cancelBubble = true; // Prevent canvas panning during drag
          console.log('🚀 Group drag started for', selectedComponents.length, 'components, primary:', canvasComponent.name);
        }}
        onDragMove={(e) => {
          e.cancelBubble = true; // Prevent canvas panning during drag
          
          // Calculate movement delta
          const rawX = e.target.x();
          const rawY = e.target.y();
          
          // Snap primary component to grid
          const snappedX = snapToGrid(rawX);
          const snappedY = snapToGrid(rawY);
          const snappedDeltaX = snappedX - canvasComponent.x;
          const snappedDeltaY = snappedY - canvasComponent.y;
          
          console.log('🔄 Group dragging:', selectedComponents.length, 'components, delta:', { x: snappedDeltaX, y: snappedDeltaY });
          
          // Apply snapped movement to primary component
          e.target.x(snappedX);
          e.target.y(snappedY);
          
          // Note: We'll update other selected components in onDragEnd to avoid conflicts
        }}
        onDragEnd={(e) => {
          e.cancelBubble = true; // Prevent canvas panning during drag
          const snappedX = snapToGrid(e.target.x());
          const snappedY = snapToGrid(e.target.y());
          
          // Calculate final movement delta
          const deltaX = snappedX - canvasComponent.x;
          const deltaY = snappedY - canvasComponent.y;
          
          console.log('🎯 Group drag ended:', selectedComponents.length, 'components moved by:', { deltaX, deltaY });
          
          // Update all selected components with the movement delta
          const updates = selectedComponents.map(comp => ({
            id: comp.id,
            x: snapToGrid(comp.x + deltaX),
            y: snapToGrid(comp.y + deltaY)
          }));
          
          updateMultipleComponents(updates);
        }}
      />
      
      {/* Selection outline */}
      {isSelected && (
        <Rect
          x={canvasComponent.x - 2}
          y={canvasComponent.y - 2}
          width={canvasComponent.width + 4}
          height={canvasComponent.height + 4}
          stroke="#3b82f6"
          strokeWidth={2}
          fill="transparent"
          dash={[5, 5]}
        />
      )}
      
      {/* Resize handles */}
      {isSelected && (
        <>
          {/* Bottom-right resize handle */}
          <Circle
            x={canvasComponent.x + canvasComponent.width}
            y={canvasComponent.y + canvasComponent.height}
            radius={6}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2}
            draggable
            onDragMove={(e) => {
              const rawWidth = e.target.x() - canvasComponent.x;
              const rawHeight = e.target.y() - canvasComponent.y;
              
              // Calculate proportional dimensions during drag
              const aspectRatio = canvasComponent.width / canvasComponent.height;
              const primaryDimension = Math.max(rawWidth, rawHeight / aspectRatio);
              
              // Snap to grid increments while maintaining aspect ratio
              const snappedWidth = Math.max(gridSize, Math.round(primaryDimension / gridSize) * gridSize);
              const snappedHeight = snappedWidth / aspectRatio;
              
              console.log('🔄 Component resizing - raw:', { w: rawWidth, h: rawHeight }, 'snapped:', { w: snappedWidth, h: snappedHeight });
              
              // Update visual feedback with grid-snapped proportional sizing
              e.target.x(canvasComponent.x + snappedWidth);
              e.target.y(canvasComponent.y + snappedHeight);
            }}
            onDragEnd={(e) => {
              const rawWidth = e.target.x() - canvasComponent.x;
              const rawHeight = e.target.y() - canvasComponent.y;
              
              console.log('🎯 Component resize end - handling with handleResize');
              handleResize(rawWidth, rawHeight);
              
              // Reset handle position to new proportional size after store update
              setTimeout(() => {
                e.target.x(canvasComponent.x + canvasComponent.width);
                e.target.y(canvasComponent.y + canvasComponent.height);
              }, 10);
            }}
          />
          
          {/* Corner resize handle markers */}
          <Circle
            x={canvasComponent.x + canvasComponent.width}
            y={canvasComponent.y}
            radius={4}
            fill="#6b7280"
            stroke="white"
            strokeWidth={1}
          />
          <Circle
            x={canvasComponent.x}
            y={canvasComponent.y + canvasComponent.height}
            radius={4}
            fill="#6b7280"
            stroke="white"
            strokeWidth={1}
          />
        </>
      )}
    </Group>
  );
};

export const Canvas: React.FC = () => {
  const canvasSettings = useAppStore((state) => state.canvasSettings);
  const canvasComponents = useAppStore((state) => state.canvasComponents);
  const availableComponents = useAppStore((state) => state.availableComponents);
  const selectedComponentIds = useAppStore((state) => state.selection.componentIds);
  const addCanvasComponent = useAppStore((state) => state.addCanvasComponent);
  const updateCanvasComponent = useAppStore((state) => state.updateCanvasComponent);
  const updateMultipleComponents = useAppStore((state) => state.updateMultipleComponents);
  const selectComponents = useAppStore((state) => state.selectComponents);
  const toggleComponentSelection = useAppStore((state) => state.toggleComponentSelection);
  
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPointerPosition, setLastPointerPosition] = useState({ x: 0, y: 0 });
  
  // Grid utility functions
  const snapToGrid = (value: number): number => {
    if (!canvasSettings.snapToGrid) return value;
    return Math.round(value / canvasSettings.gridSize) * canvasSettings.gridSize;
  };
  
  const renderGrid = () => {
    if (!canvasSettings.showGrid) return [];
    
    const lines: React.ReactElement[] = [];
    const { gridSize, gridColor } = canvasSettings;
    const canvasWidth = 800;
    const canvasHeight = 600;
    
    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, canvasHeight]}
          stroke={x % (gridSize * 5) === 0 ? '#94a3b8' : gridColor} // Major lines every 5 units
          strokeWidth={x % (gridSize * 5) === 0 ? 1 : 0.5}
          opacity={x % (gridSize * 5) === 0 ? 0.8 : 0.4}
        />
      );
    }
    
    // Horizontal lines  
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, canvasWidth, y]}
          stroke={y % (gridSize * 5) === 0 ? '#94a3b8' : gridColor} // Major lines every 5 units
          strokeWidth={y % (gridSize * 5) === 0 ? 1 : 0.5}
          opacity={y % (gridSize * 5) === 0 ? 0.8 : 0.4}
        />
      );
    }
    
    return lines;
  };
  
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'component',
    hover: (item: { component: Component }, _monitor) => {
      console.log('🎯 Canvas HOVER:', item.component.name, 'isOver:', isOver);
    },
    drop: (item: { component: Component }, monitor) => {
      try {
        console.log('🎯 Canvas DROP STARTED:', item.component.name);
        
        const didDrop = monitor.didDrop();
        console.log('🔧 Drop monitor check:', { didDrop });
        
        if (didDrop) {
          console.log('🚨 Early return - nested drop target handled this');
          return; // Already handled by nested drop target
        }
        
        console.log('🔧 Proceeding with drop handler...');
        
        const offset = monitor.getClientOffset();
        console.log('🔧 Client offset:', offset);
        
        const canvasElement = document.querySelector('.canvas-container');
        console.log('🔧 Canvas element found:', !!canvasElement);
        
        if (offset && canvasElement) {
          const canvasRect = canvasElement.getBoundingClientRect();
          const x = offset.x - canvasRect.left;
          const y = offset.y - canvasRect.top;
          
          console.log('🎯 Dropping component:', item.component.name, 'at position:', { x, y });
          
          // Snap drop position to grid
          const snappedX = snapToGrid(Math.max(0, Math.min(x - 25, 750)));
          const snappedY = snapToGrid(Math.max(0, Math.min(y - 25, 550)));
          
          console.log('🎯 Dropping component:', item.component.name, 'snapped to grid:', { x: snappedX, y: snappedY });
          
          // Add component to canvas at snapped position
          console.log('🔧 Adding component to store...', item.component.name);
          addCanvasComponent({
            id: `${item.component.id}-${Date.now()}`, // Unique ID for each instance
            componentId: item.component.id,
            name: item.component.name,
            category: item.component.category,
            description: item.component.description,
            tags: item.component.tags,
            version: item.component.version,
            author: item.component.author,
            license: item.component.license,
            x: snappedX,
            y: snappedY,
            width: canvasSettings.gridSize * 2, // Default 2 grid units wide
            height: canvasSettings.gridSize * 2, // Default 2 grid units tall
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            visible: true,
            locked: false,
            selected: false,
            data: {},
            properties: {},
            svg: item.component.svg,
            zIndex: 1
          });
          
          console.log('✅ Component successfully added to store!');
        }
      } catch (error) {
        console.error('🚨 DROP HANDLER ERROR:', error);
      }
    },
    collect: (monitor) => {
      const collected = {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
      console.log('🎯 Canvas drop state:', collected);
      return collected;
    },
  });
  
  // Drop ref setup using useRef + useEffect pattern for react-dnd
  const dropRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef.current);
      console.log('🎯 Canvas drop ref attached to DOM element');
    }
  }, [drop]);
  
  // Canvas panning handlers - ONLY for Stage, don't interfere with drop zone
  const handleStageMouseDown = (e: any) => {
    // Only handle right mouse button for panning, ignore left click to allow drag & drop
    if (e.evt.button === 2) {
      e.evt.preventDefault();
      setIsPanning(true);
      setLastPointerPosition({ x: e.evt.clientX, y: e.evt.clientY });
      console.log('🖱️ Stage panning started');
    }
  };

  const handleStageMouseMove = (e: any) => {
    if (isPanning) {
      const deltaX = e.evt.clientX - lastPointerPosition.x;
      const deltaY = e.evt.clientY - lastPointerPosition.y;
      
      const newPosition = {
        x: stagePosition.x + deltaX,
        y: stagePosition.y + deltaY
      };
      
      setStagePosition(newPosition);
      setLastPointerPosition({ x: e.evt.clientX, y: e.evt.clientY });
      console.log('🔄 Canvas panned to:', newPosition);
    }
  };

  const handleStageMouseUp = (e: any) => {
    if (isPanning && e.evt.button === 2) {
      setIsPanning(false);
      console.log('🖱️ Stage panning stopped');
    }
  };

  const handleContextMenu = (e: any) => {
    e.evt.preventDefault(); // Prevent browser context menu
  };

  return (
    <div 
      ref={dropRef}
      className="canvas-container"
      style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        backgroundColor: isOver ? '#f0f8ff' : '#ffffff',
        border: isOver ? '2px dashed #007acc' : '1px solid #e0e0e0'
      }}
    >
      <Stage 
        width={800} 
        height={600}
        x={stagePosition.x}
        y={stagePosition.y}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onContextMenu={handleContextMenu}
      >
        <Layer>
          <Rect
            width={800}
            height={600}
            fill="white"
            stroke="#e2e8f0"
            strokeWidth={1}
          />
          
          {/* Render grid lines */}
          {renderGrid()}
          
          {/* Render all canvas components */}
          {canvasComponents.map((canvasComponent) => {
            const component = availableComponents.find(c => c.id === canvasComponent.componentId);
            if (!component) {
              console.warn('⚠️ Component not found:', canvasComponent.componentId);
              return null;
            }
            return (
              <CanvasComponentItem
                key={canvasComponent.id}
                canvasComponent={canvasComponent}
                component={component}
                snapToGrid={snapToGrid}
                updateCanvasComponent={updateCanvasComponent}
                updateMultipleComponents={updateMultipleComponents}
                gridSize={canvasSettings.gridSize}
                isSelected={selectedComponentIds.includes(canvasComponent.id)}
                selectedComponents={canvasComponents.filter(c => selectedComponentIds.includes(c.id))}
                onSelect={(ctrlKey: boolean) => {
                  if (ctrlKey) {
                    // Toggle selection with Ctrl/Cmd
                    toggleComponentSelection(canvasComponent.id);
                    console.log('🔄 Toggled selection for:', canvasComponent.name);
                  } else {
                    // Single selection without Ctrl/Cmd
                    selectComponents([canvasComponent.id]);
                    console.log('🎯 Selected single component:', canvasComponent.name);
                  }
                }}
              />
            );
          })}
          
          {/* Show helper text only when no components */}
          {canvasComponents.length === 0 && (
            <Text
              text={canDrop && isOver ? "Drop component here" : "Drag and drop components here"}
              x={280}
              y={290}
              fontSize={16}
              fill={canDrop && isOver ? "#22c55e" : "#94a3b8"}
            />
          )}
          
          {/* Grid info overlay */}
          {canvasSettings.showGrid && (
            <Text
              text={`Grid: ${canvasSettings.gridSize}px | Snap: ${canvasSettings.snapToGrid ? 'ON' : 'OFF'} | Pan: Right-click + drag`}
              x={10 - stagePosition.x}
              y={10 - stagePosition.y}
              fontSize={12}
              fill="#666"
              fontFamily="Arial"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
