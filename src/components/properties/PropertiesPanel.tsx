import React from 'react';
import './PropertiesPanel.css';

export const PropertiesPanel: React.FC = () => {
  return (
    <div className="properties-panel">
      <div className="properties-content">
        <h2 className="properties-title">Properties</h2>
        <div className="properties-form">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter component name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={3}
              className="form-textarea"
              placeholder="Enter component description"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select">
              <option>UI Components</option>
              <option>Form Elements</option>
              <option>Navigation</option>
              <option>Layout</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
