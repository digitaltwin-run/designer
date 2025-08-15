import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Component, CanvasComponent } from '../../types';

interface SVGCanvasComponentProps {
  canvasComponent: CanvasComponent;
  component: Component;
  isSelected: boolean;
  snapToGrid: (value: number) => number;
  onSelect: (multiSelect: boolean) => void;
  onUpdate: (updates: Partial<CanvasComponent>) => void;
  onMultiUpdate: (updates: { id: string; x: number; y: number }[]) => void;
  selectedComponents: CanvasComponent[];
}

export const SVGCanvasComponent: React.FC<SVGCanvasComponentProps> = ({
  canvasComponent,
  component,
  isSelected,
  snapToGrid,
  onSelect,
  onUpdate,
  onMultiUpdate,
  selectedComponents
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const componentRef = useRef<SVGGElement>(null);

  // Load SVG content
  useEffect(() => {
    const loadSVG = async () => {
      try {
        console.log('📥 Loading SVG content for:', component.name);
        const response = await fetch(component.svg);
        const content = await response.text();
        setSvgContent(content);
        setIsLoaded(true);
        console.log('✅ SVG content loaded:', component.name);
      } catch (error) {
        console.error('❌ Failed to load SVG:', error);
      }
    };

    if (component.svg) {
      loadSVG();
    }
  }, [component.svg, component.name]);

  // Parse and render SVG content
  const renderSVGContent = useCallback(() => {
    if (!svgContent || !isLoaded) return null;

    try {
      // Parse the SVG content
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      const svgElement = svgDoc.documentElement;

      // Extract viewBox or use default dimensions
      const viewBox = svgElement.getAttribute('viewBox');
      const [, , vbWidth = 100, vbHeight = 100] = viewBox 
        ? viewBox.split(' ').map(Number) 
        : [0, 0, 100, 100];

      // Calculate scale to fit component dimensions 
      const compWidth = canvasComponent.width || 100;
      const compHeight = canvasComponent.height || 100;
      
      // Use uniform scaling to maintain aspect ratio
      const scale = Math.min(compWidth / vbWidth, compHeight / vbHeight);
      console.log(`📏 Scaling component ${component.name}: viewBox(${vbWidth}x${vbHeight}) -> size(${compWidth}x${compHeight}) scale=${scale}`);

      // Create the SVG elements as JSX
      const svgChildren: React.ReactNode[] = [];
      
      Array.from(svgElement.children).forEach((child, index) => {
        if (child.tagName === 'script') {
          // Handle embedded scripts - we'll inject them as <script> tags
          const scriptContent = child.textContent || '';
          
          // For SVG export, we keep the script as-is
          svgChildren.push(
            <script key={`script-${index}`} type="text/javascript" dangerouslySetInnerHTML={{ __html: scriptContent }} />
          );
          
          // Execute the script in current context for live preview
          try {
            // Skip scripts that use document.currentScript as they won't work in this context
            if (scriptContent.includes('document.currentScript')) {
              console.warn('⚠️ Skipping script that uses document.currentScript:', component.name);
              return;
            }
            
            const scriptFunc = new Function('element', scriptContent);
            setTimeout(() => {
              if (componentRef.current) {
                scriptFunc.call(componentRef.current, componentRef.current);
              }
            }, 100);
          } catch (error) {
            console.warn('⚠️ Script execution failed:', error);
          }
        } else {
          // Convert SVG elements to JSX
          const jsxElement = createJSXFromSVGElement(child, index);
          if (jsxElement) {
            svgChildren.push(jsxElement);
          }
        }
      });

      return (
        <g transform={`scale(${scale})`}>
          {svgChildren}
        </g>
      );
    } catch (error) {
      console.error('❌ Failed to parse SVG content:', error);
      return (
        <rect 
          width={canvasComponent.width} 
          height={canvasComponent.height} 
          fill="#fee2e2" 
          stroke="#ef4444"
          rx="4"
        />
      );
    }
  }, [svgContent, isLoaded, canvasComponent.width, canvasComponent.height]);

  // Convert SVG DOM element to JSX
  const createJSXFromSVGElement = (element: Element, key: number): React.ReactNode => {
    const tagName = element.tagName.toLowerCase();
    const props: any = { key };

    // Copy all attributes
    Array.from(element.attributes).forEach(attr => {
      const name = attr.name.replace(/[-:](.)/g, (_, char) => char.toUpperCase());
      props[name] = attr.value;
    });

    // Handle children
    const children: React.ReactNode[] = [];
    Array.from(element.children).forEach((child, index) => {
      const childJSX = createJSXFromSVGElement(child, index);
      if (childJSX) {
        children.push(childJSX);
      }
    });

    // Add text content if any
    if (element.textContent && !element.children.length) {
      children.push(element.textContent);
    }

    // Return JSX element
    return React.createElement(tagName, props, ...children);
  };

  // Mouse event handlers
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (canvasComponent.locked) return;
    
    event.stopPropagation();
    
    const isMultiSelect = event.ctrlKey || event.metaKey;
    onSelect(isMultiSelect);
    
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
    
    console.log('🖱️ Component drag started:', canvasComponent.name, 'multi-select:', isMultiSelect);
  }, [canvasComponent.locked, canvasComponent.name, onSelect]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDragging || canvasComponent.locked) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    
    // Apply snapping
    const newX = snapToGrid(canvasComponent.x + deltaX);
    const newY = snapToGrid(canvasComponent.y + deltaY);
    
    // Update position temporarily (visual feedback)
    if (componentRef.current) {
      componentRef.current.setAttribute('transform', `translate(${newX}, ${newY})`);
    }
  }, [isDragging, canvasComponent.locked, canvasComponent.x, canvasComponent.y, dragStart, snapToGrid]);

  const handleMouseUp = useCallback((event: React.MouseEvent) => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    
    const newX = snapToGrid(canvasComponent.x + deltaX);
    const newY = snapToGrid(canvasComponent.y + deltaY);
    
    // Update all selected components
    const updates = selectedComponents.map(comp => ({
      id: comp.id,
      x: comp.id === canvasComponent.id ? newX : snapToGrid(comp.x + deltaX),
      y: comp.id === canvasComponent.id ? newY : snapToGrid(comp.y + deltaY)
    }));
    
    if (updates.length > 0) {
      onMultiUpdate(updates);
      console.log('✅ Updated positions for', updates.length, 'components');
    }
  }, [isDragging, dragStart, canvasComponent, selectedComponents, snapToGrid, onMultiUpdate]);

  // Resize handles
  const renderResizeHandles = () => {
    if (!isSelected || canvasComponent.locked) return null;
    
    const handleSize = 8;
    const { x, y } = canvasComponent;
    const width = canvasComponent.width || 80;
    const height = canvasComponent.height || 80;
    
    return (
      <g className="resize-handles">
        {/* Corner handles */}
        <rect
          x={x + width - handleSize/2}
          y={y + height - handleSize/2}
          width={handleSize}
          height={handleSize}
          fill="#3b82f6"
          stroke="#ffffff"
          strokeWidth="2"
          style={{ cursor: 'se-resize' }}
          onMouseDown={(e) => {
            e.stopPropagation();
            // TODO: Implement resize functionality
          }}
        />
      </g>
    );
  };

  if (!isLoaded) {
    return (
      <g className="svg-canvas-component loading" data-component-id={canvasComponent.id}>
        <rect
          x={canvasComponent.x}
          y={canvasComponent.y}
          width={canvasComponent.width}
          height={canvasComponent.height}
          fill="#f3f4f6"
          stroke="#d1d5db"
          strokeDasharray="4,4"
          rx="4"
        />
        <text
          x={canvasComponent.x + (canvasComponent.width || 80) / 2}
          y={canvasComponent.y + (canvasComponent.height || 80) / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill="#6b7280"
        >
          Loading...
        </text>
      </g>
    );
  }

  return (
    <>
      <g
        ref={componentRef}
        className={`svg-canvas-component ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''}`}
        data-component-id={canvasComponent.id}
        data-component-name={canvasComponent.name}
        transform={`translate(${canvasComponent.x}, ${canvasComponent.y})`}
        style={{
          opacity: canvasComponent.visible ? 1 : 0.3,
          cursor: canvasComponent.locked ? 'not-allowed' : (isDragging ? 'grabbing' : 'grab'),
          pointerEvents: canvasComponent.locked ? 'none' : 'all'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Selection border */}
        {isSelected && (
          <rect
            x={-2}
            y={-2}
            width={(canvasComponent.width || 80) + 4}
            height={(canvasComponent.height || 80) + 4}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray="5,5"
            rx="2"
            opacity="0.8"
          />
        )}
        
        {/* Component content */}
        {renderSVGContent()}
      </g>
      
      {/* Resize handles */}
      {renderResizeHandles()}
    </>
  );
};
