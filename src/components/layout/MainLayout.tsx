import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Toolbar } from '../toolbar/Toolbar';
import { Sidebar } from '../sidebar/Sidebar';
import { Canvas } from '../canvas/Canvas';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { ComponentList } from '../sidebar/ComponentList';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const { 
    sidebarVisible, 
    propertiesVisible, 
    componentListVisible 
  } = useAppStore(state => ({
    sidebarVisible: state.sidebarVisible,
    propertiesVisible: state.propertiesVisible,
    componentListVisible: state.componentListVisible,
  }));

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
          <Canvas />
        </div>

        {/* Right Panel - Properties & Component List */}
        <div className="right-panel">
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
