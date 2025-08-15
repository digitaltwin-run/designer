import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { useAppStore } from '../../store/useAppStore';
import { SVGCanvasComponent } from './SVGCanvasComponent';
import { SVGGrid } from './SVGGrid';
import type { Component, CanvasComponent } from '../../types';
import './SVGCanvas.css';

interface SVGCanvasProps {
  width?: number;
  height?: number;
}

export const SVGCanvas: React.FC<SVGCanvasProps> = ({ 
  width = 1200, 
  height = 800 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width, height });
  const [zoom, setZoom] = useState(1);
  const [draggedComponent, setDraggedComponent] = useState<Component | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Store selectors
  const canvasComponents = useAppStore(state => state.canvasComponents);
  const selectedComponentIds = useAppStore(state => state.selection.componentIds);
  const addCanvasComponent = useAppStore(state => state.addCanvasComponent);
  const updateCanvasComponent = useAppStore(state => state.updateCanvasComponent);
  const updateMultipleComponents = useAppStore(state => state.updateMultipleComponents);
  const selectComponents = useAppStore(state => state.selectComponents);
  const toggleComponentSelection = useAppStore(state => state.toggleComponentSelection);
  const canvasSettings = useAppStore(state => state.canvasSettings);

  const gridSize = canvasSettings.gridSize;

  // Utility functions
  const snapToGrid = useCallback((value: number) => {
    return Math.round(value / gridSize) * gridSize;
  }, [gridSize]);

  // Zoom functions - zoom around canvas center, not current viewBox center
  const zoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 5);
    setZoom(newZoom);
    
    // Calculate new viewBox dimensions
    const newWidth = width / newZoom;
    const newHeight = height / newZoom;
    
    // Center on canvas center (width/2, height/2) instead of current viewBox center
    const canvasCenterX = width / 2;
    const canvasCenterY = height / 2;
    
    const newViewBox = {
      x: canvasCenterX - newWidth / 2,
      y: canvasCenterY - newHeight / 2,
      width: newWidth,
      height: newHeight
    };
    
    console.log('🔍 Zoom In:', { zoom: newZoom, oldViewBox: viewBox, newViewBox, canvasCenter: { x: canvasCenterX, y: canvasCenterY } });
    setViewBox(newViewBox);
  }, [zoom, width, height, viewBox]);

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    setZoom(newZoom);
    
    // Calculate new viewBox dimensions
    const newWidth = width / newZoom;
    const newHeight = height / newZoom;
    
    // Center on canvas center (width/2, height/2) instead of current viewBox center
    const canvasCenterX = width / 2;
    const canvasCenterY = height / 2;
    
    const newViewBox = {
      x: canvasCenterX - newWidth / 2,
      y: canvasCenterY - newHeight / 2,
      width: newWidth,
      height: newHeight
    };
    
    console.log('🔍 Zoom Out:', { zoom: newZoom, oldViewBox: viewBox, newViewBox, canvasCenter: { x: canvasCenterX, y: canvasCenterY } });
    setViewBox(newViewBox);
  }, [zoom, width, height, viewBox]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    const newViewBox = { x: 0, y: 0, width, height };
    console.log('🔄 Reset Zoom:', { zoom: 1, viewBox: newViewBox });
    setViewBox(newViewBox);
  }, [width, height]);

  // Mouse wheel zoom
  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  }, [zoomIn, zoomOut]);

  // Expose zoom functions globally
  useEffect(() => {
    (window as any).zoomIn = zoomIn;
    (window as any).zoomOut = zoomOut;
    (window as any).resetZoom = resetZoom;
    return () => {
      delete (window as any).zoomIn;
      delete (window as any).zoomOut;
      delete (window as any).resetZoom;
    };
  }, [zoomIn, zoomOut, resetZoom]);

  const getSVGPoint = useCallback((event: React.MouseEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;
    
    return {
      x: viewBox.x + (event.clientX - rect.left) * scaleX,
      y: viewBox.y + (event.clientY - rect.top) * scaleY
    };
  }, [viewBox]);

  // Pan handlers
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 2) return; // Only right mouse button for panning
    
    setIsPanning(true);
    setPanStart({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = (event.clientX - panStart.x) * (viewBox.width / width);
      const deltaY = (event.clientY - panStart.y) * (viewBox.height / height);
      
      setViewBox(prev => ({
        ...prev,
        x: prev.x - deltaX,
        y: prev.y - deltaY
      }));
      
      setPanStart({ x: event.clientX, y: event.clientY });
    }
    
    if (draggedComponent) {
      const point = getSVGPoint(event);
      setDragOffset({
        x: point.x - dragOffset.x,
        y: point.y - dragOffset.y
      });
    }
  }, [isPanning, panStart, viewBox, width, height, draggedComponent, getSVGPoint, dragOffset]);

  const handleMouseUp = useCallback((event: React.MouseEvent) => {
    if (isPanning) {
      setIsPanning(false);
    }
    
    if (draggedComponent) {
      const point = getSVGPoint(event);
      const snappedX = snapToGrid(point.x);
      const snappedY = snapToGrid(point.y);
      
      console.log('🎯 Dropping component:', draggedComponent.name, 'at', { x: snappedX, y: snappedY });
      
      // Create new canvas component
      const newComponent: CanvasComponent = {
        id: `${draggedComponent.id}-${Date.now()}`,
        componentId: draggedComponent.id,
        name: draggedComponent.name,
        version: draggedComponent.version,
        description: draggedComponent.description,
        category: draggedComponent.category,
        tags: draggedComponent.tags,
        svg: draggedComponent.svg,
        x: snappedX,
        y: snappedY,
        width: 80,
        height: 80,
        zIndex: canvasComponents.length,
        visible: true,
        locked: false,
        data: {}
      };
      
      addCanvasComponent(newComponent);
      setDraggedComponent(null);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isPanning, draggedComponent, getSVGPoint, snapToGrid, addCanvasComponent, canvasComponents.length]);

  // Canvas click handler
  const handleCanvasClick = useCallback((event: React.MouseEvent) => {
    // Only handle clicks on the canvas itself (not components)
    if (event.target === svgRef.current || (event.target as SVGElement).classList.contains('canvas-background')) {
      selectComponents([]); // Clear selection
    }
  }, [selectComponents]);

  // Drag and drop handlers
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    
    try {
      const componentData = event.dataTransfer.getData('application/json');
      const component: Component = JSON.parse(componentData);
      
      const point = getSVGPoint(event as any);
      const snappedX = snapToGrid(point.x);
      const snappedY = snapToGrid(point.y);
      
      console.log('🎯 Dropping component via drag event:', component.name, 'at', { x: snappedX, y: snappedY });
      
      const newComponent: CanvasComponent = {
        id: `${component.id}-${Date.now()}`,
        componentId: component.id,
        name: component.name,
        version: component.version,
        description: component.description,
        category: component.category,
        tags: component.tags,
        svg: component.svg,
        x: snappedX,
        y: snappedY,
        width: 80,
        height: 80,
        zIndex: canvasComponents.length,
        visible: true,
        locked: false,
        data: {}
      };
      
      addCanvasComponent(newComponent);
    } catch (error) {
      console.error('❌ Failed to parse dropped component data:', error);
    }
  }, [getSVGPoint, snapToGrid, addCanvasComponent, canvasComponents.length]);

  // Export to SVG
  const exportToSVG = useCallback(async () => {
    if (!svgRef.current) {
      console.error('❌ SVG canvas not found');
      return;
    }
    
    console.log('🎨 Starting SVG export...');
    
    const svgElement = svgRef.current;
    const svgClone = svgElement.cloneNode(true) as SVGElement;
    
    // Add XML namespace for standalone SVG
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svgClone.setAttribute('height', height.toString());
    
    // Add XML namespace for standalone SVG
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    
    // Set proper viewBox for export
    svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svgClone.setAttribute('width', width.toString());
    
    // Remove grid and UI elements for clean export
    const grid = svgClone.querySelector('.svg-grid');
    if (grid) grid.remove();
    
    // Process each component to embed SVG content
    const componentElements = svgClone.querySelectorAll('.svg-canvas-component');
    
    for (const element of Array.from(componentElements)) {
      const componentId = element.getAttribute('data-component-id');
      const canvasComponent = canvasComponents.find(c => c.id === componentId);
      
      if (canvasComponent) {
        try {
          // Find the original component definition
          const component = useAppStore.getState().availableComponents.find(c => c.id === canvasComponent.componentId);
          if (component?.svg) {
            // Fetch the SVG content
            const response = await fetch(component.svg);
            const svgContent = await response.text();
            
            // Parse SVG content
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
            const originalSvg = svgDoc.documentElement;
            
            // Create group for the component
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            const compWidth = canvasComponent.width || 80;
            const compHeight = canvasComponent.height || 80;
            group.setAttribute('transform', `translate(${canvasComponent.x}, ${canvasComponent.y}) scale(${compWidth / 100}, ${compHeight / 100})`);
            group.setAttribute('data-component-name', canvasComponent.name);
            
            // Clone all children from original SVG
            Array.from(originalSvg.children).forEach(child => {
              const clonedChild = child.cloneNode(true);
              group.appendChild(clonedChild);
            });
            
            // Replace the placeholder element with the actual SVG content
            element.parentNode?.replaceChild(group, element);
            
            console.log('✅ Embedded SVG for component:', canvasComponent.name);
          }
        } catch (error) {
          console.error('❌ Failed to embed SVG for component:', canvasComponent.name, error);
        }
      }
    }
    
    // Serialize the final SVG
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgClone);
    
    // Create download
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'digital-twin-canvas.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ SVG exported successfully');
    
    console.log('✅ SVG Canvas exported successfully!');
  }, [width, height, canvasComponents]);

  // Export to SVG with embedded video recording
  const exportSVGWithVideo = useCallback(async (recordingDurationSeconds = 10) => {
    if (!svgRef.current) {
      console.error('❌ SVG canvas not found');
      return;
    }

    console.log('🎥 Starting SVG+Video export...');
    
    try {
      // Get canvas container for recording
      const canvasContainer = svgRef.current.parentElement;
      if (!canvasContainer) {
        console.error('❌ Canvas container not found');
        return;
      }

      // Start screen recording of the canvas area
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: width,
          height: height,
        },
        audio: false
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const videoChunks: Blob[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Create video blob
        const videoBlob = new Blob(videoChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        
        // Convert video to base64 for embedding
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Video = reader.result as string;
          
          // Create SVG with embedded video
          await createSVGWithEmbeddedVideo(base64Video);
          
          // Cleanup
          URL.revokeObjectURL(videoUrl);
        };
        reader.readAsDataURL(videoBlob);
      };

      // Start recording
      mediaRecorder.start();
      console.log(`🎬 Recording started for ${recordingDurationSeconds} seconds...`);
      
      // Show recording indicator
      const recordingIndicator = document.createElement('div');
      recordingIndicator.innerHTML = `
        <div style="
          position: fixed;
          top: 20px;
          right: 20px;
          background: red;
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          font-weight: bold;
          z-index: 9999;
          animation: blink 1s infinite;
        ">
          🔴 Recording... ${recordingDurationSeconds}s
        </div>
        <style>
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.5; }
          }
        </style>
      `;
      document.body.appendChild(recordingIndicator);

      // Stop recording after specified duration
      setTimeout(() => {
        mediaRecorder.stop();
        document.body.removeChild(recordingIndicator);
        console.log('⏹️ Recording stopped');
      }, recordingDurationSeconds * 1000);

    } catch (error) {
      console.error('❌ Video recording failed:', error);
      alert('Video recording not supported or permission denied. Please use Chrome/Edge and grant screen recording permission.');
    }

    // Helper function to create SVG with embedded video
    async function createSVGWithEmbeddedVideo(base64Video: string) {
      if (!svgRef.current) return;
      
      // Clone SVG for export
      const svgElement = svgRef.current;
      const svgClone = svgElement.cloneNode(true) as SVGElement;
      
      // Add XML namespaces
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
      svgClone.setAttribute('width', width.toString());
      svgClone.setAttribute('height', height.toString());
      svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
      
      // Remove grid for clean export
      const grid = svgClone.querySelector('.svg-grid');
      if (grid) grid.remove();
      
      // Create video element embedded in SVG
      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('x', '0');
      foreignObject.setAttribute('y', '0');
      foreignObject.setAttribute('width', width.toString());
      foreignObject.setAttribute('height', height.toString());
      
      const video = document.createElement('video');
      video.setAttribute('width', width.toString());
      video.setAttribute('height', height.toString());
      video.setAttribute('controls', 'true');
      video.setAttribute('autoplay', 'false');
      video.setAttribute('loop', 'true');
      video.src = base64Video;
      
      foreignObject.appendChild(video);
      
      // Add video as background layer
      svgClone.insertBefore(foreignObject, svgClone.firstChild);
      
      // Process and embed static SVG components as overlay
      const componentElements = svgClone.querySelectorAll('.svg-canvas-component');
      for (const element of Array.from(componentElements)) {
        const componentId = element.getAttribute('data-component-id');
        const canvasComponent = canvasComponents.find(c => c.id === componentId);
        
        if (canvasComponent) {
          try {
            const component = useAppStore.getState().availableComponents.find(c => c.id === canvasComponent.componentId);
            if (component?.svg) {
              const response = await fetch(component.svg);
              const svgContent = await response.text();
              
              const parser = new DOMParser();
              const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
              const originalSvg = svgDoc.documentElement;
              
              const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
              const compWidth = canvasComponent.width || 80;
              const compHeight = canvasComponent.height || 80;
              group.setAttribute('transform', `translate(${canvasComponent.x}, ${canvasComponent.y}) scale(${compWidth / 100}, ${compHeight / 100})`);
              group.setAttribute('data-component-name', canvasComponent.name);
              group.setAttribute('opacity', '0.8'); // Slightly transparent overlay
              
              Array.from(originalSvg.children).forEach(child => {
                const clonedChild = child.cloneNode(true);
                group.appendChild(clonedChild);
              });
              
              element.parentNode?.replaceChild(group, element);
            }
          } catch (error) {
            console.error('❌ Failed to embed SVG for component:', canvasComponent.name, error);
          }
        }
      }
      
      // Serialize and download
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgClone);
      
      // Create enhanced SVG with HTML wrapper for better browser compatibility
      const htmlWrapper = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Digital Twin Canvas with Video</title>
    <style>
        body { margin: 0; padding: 20px; background: #f0f0f0; font-family: Arial, sans-serif; }
        .container { max-width: ${width + 40}px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .title { text-align: center; color: #333; margin-bottom: 20px; }
        .description { text-align: center; color: #666; margin-bottom: 20px; }
        svg { border: 1px solid #ddd; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">🎥 Digital Twin Canvas Recording</h1>
        <p class="description">Interactive SVG with embedded video recording of animations</p>
        ${svgString}
        <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
            Generated by Digital Twin Designer • Contains embedded video and interactive SVG components
        </p>
    </div>
</body>
</html>`;
      
      const blob = new Blob([htmlWrapper], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `digital-twin-canvas-with-video-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('✅ SVG with embedded video exported successfully!');
    }
  }, [width, height, canvasComponents]);

  // Expose export functions globally for toolbar
  useEffect(() => {
    (window as any).exportCanvasToSVG = exportToSVG;
    (window as any).exportSVGWithVideo = exportSVGWithVideo;
    return () => {
      delete (window as any).exportCanvasToSVG;
      delete (window as any).exportSVGWithVideo;
    };
  }, [exportToSVG, exportSVGWithVideo]);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'component',
    drop: (item: { component: Component }, monitor) => {
      try {
        console.log('🎯 SVGCanvas DROP STARTED:', item.component.name);
        
        const didDrop = monitor.didDrop();
        console.log('🔧 Drop monitor check:', { didDrop });
        
        if (didDrop) {
          console.log('🚨 Early return - nested drop target handled this');
          return;
        }
        
        const offset = monitor.getClientOffset();
        console.log('🔧 Client offset:', offset);
        
        if (offset) {
          const svgElement = svgRef.current;
          if (svgElement) {
            const svgRect = svgElement.getBoundingClientRect();
            const x = offset.x - svgRect.left;
            const y = offset.y - svgRect.top;
            
            // Convert to SVG coordinates
            const scaleX = viewBox.width / svgRect.width;
            const scaleY = viewBox.height / svgRect.height;
            const svgX = viewBox.x + x * scaleX;
            const svgY = viewBox.y + y * scaleY;
            
            const snappedX = snapToGrid(Math.max(0, svgX));
            const snappedY = snapToGrid(Math.max(0, svgY));
            
            console.log('🎯 Dropping component:', item.component.name, 'snapped to grid:', { x: snappedX, y: snappedY });
            
            const newComponent: CanvasComponent = {
              id: `${item.component.id}-${Date.now()}`,
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
              width: gridSize * 4,
              height: gridSize * 4,
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
              zIndex: canvasComponents.length + 1
            };
            
            console.log('🔧 Adding component to store...', item.component.name);
            addCanvasComponent(newComponent);
            console.log('✅ Component successfully added to store!');
          }
        }
      } catch (error) {
        console.error('🚨 SVGCanvas DROP HANDLER ERROR:', error);
      }
    },
    collect: (monitor) => {
      const collected = {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
      console.log('🎯 SVGCanvas drop state:', collected);
      return collected;
    },
  });

  return (
    <div className="svg-canvas-container">
      <svg
        ref={(node) => {
          svgRef.current = node;
          drop(node);
        }}
        width="100%"
        height="100%"
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
        className="svg-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onWheel={handleWheel}
        style={{
          cursor: isPanning ? 'grabbing' : 'default',
          userSelect: 'none'
        }}
      >
        {/* Canvas background */}
        <rect
          className="canvas-background"
          x={viewBox.x}
          y={viewBox.y}
          width={viewBox.width}
          height={viewBox.height}
          fill="#ffffff"
          stroke="none"
        />
        
        {/* Grid */}
        <SVGGrid 
          viewBox={viewBox}
          gridSize={gridSize}
          visible={canvasSettings.showGrid}
        />
        
        {/* Components */}
        <g className="canvas-components">
          {canvasComponents.map((canvasComponent) => {
            const component = useAppStore.getState().availableComponents.find(c => c.id === canvasComponent.componentId);
            if (!component) {
              console.warn('⚠️ Component not found:', canvasComponent.componentId);
              return null;
            }
            
            // Reduced logging for performance
            // console.log('🎨 Rendering component:', canvasComponent.name);
            
            return (
              <SVGCanvasComponent
                key={canvasComponent.id}
                canvasComponent={canvasComponent}
                component={component}
                isSelected={selectedComponentIds.includes(canvasComponent.id)}
                snapToGrid={snapToGrid}
                onSelect={(multiSelect: boolean) => {
                  if (multiSelect) {
                    toggleComponentSelection(canvasComponent.id);
                  } else {
                    selectComponents([canvasComponent.id]);
                  }
                }}
                onUpdate={(updates: Partial<CanvasComponent>) => updateCanvasComponent(canvasComponent.id, updates)}
                onMultiUpdate={updateMultipleComponents}
                selectedComponents={canvasComponents.filter(c => selectedComponentIds.includes(c.id))}
              />
            );
          })}
        </g>
        
        {/* Selection rectangle - TODO */}
      </svg>
    </div>
  );
};
