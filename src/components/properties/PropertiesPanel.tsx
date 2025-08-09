import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import './PropertiesPanel.css';

export const PropertiesPanel: React.FC = () => {
  const selectedCanvasComponent = useAppStore((state) => state.selectedCanvasComponent);
  const updateCanvasComponent = useAppStore((state) => state.updateCanvasComponent);
  const clearCanvasSelection = useAppStore((state) => state.clearCanvasSelection);
  
  if (!selectedCanvasComponent) {
    return (
      <div className="properties-panel">
        <div className="properties-content">
          <h2 className="properties-title">Properties</h2>
          <p style={{ color: '#666', textAlign: 'center', marginTop: '20px' }}>
            Select a component to edit its properties
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="properties-panel">
      <div className="properties-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="properties-title">Properties</h2>
          <button 
            onClick={clearCanvasSelection}
            style={{ 
              background: 'none', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ✕ Clear
          </button>
        </div>
        
        <div className="properties-form">
          <div className="form-group">
            <label className="form-label">Component ID</label>
            <input
              type="text"
              className="form-input"
              value={selectedCanvasComponent.id}
              readOnly
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={selectedCanvasComponent.name}
              onChange={(e) => updateCanvasComponent(selectedCanvasComponent.id, { name: e.target.value })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Position X</label>
            <input
              type="number"
              className="form-input"
              value={selectedCanvasComponent.x}
              onChange={(e) => updateCanvasComponent(selectedCanvasComponent.id, { x: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Position Y</label>
            <input
              type="number"
              className="form-input"
              value={selectedCanvasComponent.y}
              onChange={(e) => updateCanvasComponent(selectedCanvasComponent.id, { y: parseInt(e.target.value) || 0 })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Width</label>
            <input
              type="number"
              className="form-input"
              value={selectedCanvasComponent.width}
              onChange={(e) => updateCanvasComponent(selectedCanvasComponent.id, { width: parseInt(e.target.value) || 20 })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Height</label>
            <input
              type="number"
              className="form-input"
              value={selectedCanvasComponent.height}
              onChange={(e) => updateCanvasComponent(selectedCanvasComponent.id, { height: parseInt(e.target.value) || 20 })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Opacity</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="form-input"
              value={selectedCanvasComponent.opacity}
              onChange={(e) => updateCanvasComponent(selectedCanvasComponent.id, { opacity: parseFloat(e.target.value) })}
            />
            <span style={{ fontSize: '12px', color: '#666' }}>{selectedCanvasComponent.opacity}</span>
          </div>
          
          <div className="form-group">
            <label className="form-label">Visible</label>
            <input
              type="checkbox"
              checked={selectedCanvasComponent.visible}
              onChange={(e) => updateCanvasComponent(selectedCanvasComponent.id, { visible: e.target.checked })}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Locked</label>
            <input
              type="checkbox"
              checked={selectedCanvasComponent.locked}
              onChange={(e) => updateCanvasComponent(selectedCanvasComponent.id, { locked: e.target.checked })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
