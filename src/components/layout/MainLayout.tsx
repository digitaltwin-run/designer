import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Toolbar } from '../toolbar/Toolbar';
import { Sidebar } from '../sidebar/Sidebar';
import { SVGCanvas } from '../canvas/SVGCanvas';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { ComponentList } from '../sidebar/ComponentList';
import { LayersPanel } from '../layers/LayersPanel';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  // Use individual selectors to avoid object recreation and infinite re-render
  const sidebarVisible = useAppStore(state => state.sidebarVisible);
  const propertiesVisible = useAppStore(state => state.propertiesVisible);
  const componentListVisible = useAppStore(state => state.componentListVisible);
  const layersVisible = useAppStore(state => state.layersVisible || true); // Default to visible

  return (
    <div className="main-layout">
      {/* Top Toolbar */}
      <div className="toolbar-container">
        <Toolbar />
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Left Sidebar - Components Library */}
        {sidebarVisible && (
          <div className="sidebar-left">
            <Sidebar />
          </div>
        )}

        {/* Center - Canvas Area */}
        <div className="canvas-container">
          <SVGCanvas />
        </div>

        {/* Right Panel - Properties, Component List & Layers */}
        <div className="right-panel">
          {/* Layers Panel */}
          {layersVisible && (
            <div className="layers-panel-container">
              <LayersPanel />
            </div>
          )}
          
          {/* Component List Panel */}
          {componentListVisible && (
            <div className="component-list-panel">
              <ComponentList />
            </div>
          )}

          {/* Properties Panel */}
          {propertiesVisible && (
            <div className="properties-panel">
              <PropertiesPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
