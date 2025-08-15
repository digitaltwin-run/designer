import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Eye, EyeOff, Lock, Unlock, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import './LayersPanel.css';

interface LayersPanelProps {
  className?: string;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({ className = '' }) => {
  const canvasComponents = useAppStore((state) => state.canvasComponents);
  const selectedComponentIds = useAppStore((state) => state.selection.componentIds);
  const selectComponents = useAppStore((state) => state.selectComponents);
  const toggleComponentSelection = useAppStore((state) => state.toggleComponentSelection);
  const updateCanvasComponent = useAppStore((state) => state.updateCanvasComponent);
  const removeComponentFromCanvas = useAppStore((state) => state.removeComponentFromCanvas);

  // Sort components by zIndex (highest first = top layer)
  const sortedComponents = [...canvasComponents].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  const handleLayerClick = (componentId: string, ctrlKey: boolean) => {
    if (ctrlKey) {
      toggleComponentSelection(componentId);
    } else {
      selectComponents([componentId]);
    }
  };

  const toggleVisibility = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const component = canvasComponents.find(c => c.id === componentId);
    if (component) {
      updateCanvasComponent(componentId, { visible: !component.visible });
    }
  };

  const toggleLock = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const component = canvasComponents.find(c => c.id === componentId);
    if (component) {
      updateCanvasComponent(componentId, { locked: !component.locked });
    }
  };

  const deleteComponent = (componentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeComponentFromCanvas(componentId);
  };

  const moveLayer = (componentId: string, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const component = canvasComponents.find(c => c.id === componentId);
    if (!component) return;

    const currentZIndex = component.zIndex || 0;
    const newZIndex = direction === 'up' ? currentZIndex + 1 : currentZIndex - 1;
    
    // Ensure zIndex doesn't go below 0
    if (newZIndex >= 0) {
      updateCanvasComponent(componentId, { zIndex: newZIndex });
    }
  };

  return (
    <div className={`layers-panel ${className}`}>
      <div className="layers-header">
        <h3>🗂️ Layers</h3>
        <span className="layers-count">{canvasComponents.length}</span>
      </div>

      <div className="layers-list">
        {sortedComponents.length === 0 ? (
          <div className="layers-empty">
            <p>No components on canvas</p>
            <small>Drag components from the sidebar</small>
          </div>
        ) : (
          sortedComponents.map((component) => {
            const isSelected = selectedComponentIds.includes(component.id);
            
            return (
              <div
                key={component.id}
                className={`layer-item ${isSelected ? 'selected' : ''} ${!component.visible ? 'hidden' : ''} ${component.locked ? 'locked' : ''}`}
                onClick={(e) => handleLayerClick(component.id, e.ctrlKey || e.metaKey)}
              >
                <div className="layer-content">
                  <div className="layer-info">
                    <div className="layer-name" title={component.name}>
                      {component.name}
                    </div>
                    <div className="layer-details">
                      <span className="layer-position">
                        x: {Math.round(component.x)}, y: {Math.round(component.y)}
                      </span>
                      <span className="layer-z-index">z: {component.zIndex || 0}</span>
                    </div>
                  </div>
                  
                  <div className="layer-controls">
                    {/* Move Up/Down */}
                    <button
                      className="layer-control-btn"
                      onClick={(e) => moveLayer(component.id, 'up', e)}
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      className="layer-control-btn"
                      onClick={(e) => moveLayer(component.id, 'down', e)}
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    
                    {/* Visibility Toggle */}
                    <button
                      className={`layer-control-btn ${component.visible ? 'active' : 'inactive'}`}
                      onClick={(e) => toggleVisibility(component.id, e)}
                      title={component.visible ? 'Hide' : 'Show'}
                    >
                      {component.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    
                    {/* Lock Toggle */}
                    <button
                      className={`layer-control-btn ${component.locked ? 'active' : 'inactive'}`}
                      onClick={(e) => toggleLock(component.id, e)}
                      title={component.locked ? 'Unlock' : 'Lock'}
                    >
                      {component.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                    
                    {/* Delete */}
                    <button
                      className="layer-control-btn danger"
                      onClick={(e) => deleteComponent(component.id, e)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="layers-footer">
        <small>
          {selectedComponentIds.length > 0 && (
            `${selectedComponentIds.length} selected`
          )}
        </small>
      </div>
    </div>
  );
};
