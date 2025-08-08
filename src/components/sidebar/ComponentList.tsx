import React from 'react';
import { useAppStore } from "../../store/useAppStore";
import './ComponentList.css';

export const ComponentList: React.FC = () => {
  const availableComponents = useAppStore(state => state.availableComponents);
  const selection = useAppStore(state => state.selection);
  const selectComponents = useAppStore(state => state.selectComponents);

  // Group components by category 
  const componentsByCategory = availableComponents.reduce((acc, component) => {
    const category = component.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(component);
    return acc;
  }, {} as Record<string, typeof availableComponents>);

  return (
    <div className="component-list">
      <div className="component-list-header">
        <h2 className="component-list-title">Components</h2>
        <p className="component-list-description">Drag and drop components to the canvas</p>
      </div>
      
      <div className="component-categories">
        {Object.entries(componentsByCategory).map(([category, categoryComponents]) => (
          <div key={category} className="component-category">
            <h3 className="category-title">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            <div className="components-grid">
              {categoryComponents.map((component) => (
                <div
                  key={component.id}
                  className={`component-item ${
                    selection.componentIds.includes(component.id) ? 'selected' : ''
                  }`}
                  onClick={() => selectComponents([component.id])}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/reactflow', JSON.stringify(component));
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                >
                  <div className="component-content">
                    <div className="component-icon">
                      <img 
                        src={component.svg} 
                        alt={component.name} 
                        onError={(e) => {
                          // Fallback to a default icon if the SVG fails to load
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNMTkgM2gtMTRjLTEuMTA1IDAtMiAuODk1LTIgMnYxNGMwIDEuMTA1Ljg5NSAyIDIgMmgxNGMxLjEwNSAwIDItLjg5NSAyLTJ2LTE0YzAtMS4xMDUtLjg5NS0yLTItMnpNNS41IDcuNWgxM3Y5aC0xM3YtOXoiLz48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <span className="component-name">
                      {component.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
