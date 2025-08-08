import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MousePointer, Hand, ZoomIn, Square, Circle, Move, RotateCw, Copy, Trash2, Undo, Redo, Save, Download, Settings } from 'lucide-react';
import './Toolbar.css';

const iconMap = {
  MousePointer, Hand, ZoomIn, Square, Circle, Move, RotateCw, Copy, Trash2, Undo, Redo, Save, Download, Settings
};

export const Toolbar: React.FC = () => {
  const { 
    tools, 
    activeTool, 
    setActiveTool,
    undo,
    redo,
    history,
    historyIndex,
    toggleSidebar,
    toggleProperties,
    toggleComponentList
  } = useAppStore(state => ({
    tools: state.tools,
    activeTool: state.activeTool,
    setActiveTool: state.setActiveTool,
    undo: state.undo,
    redo: state.redo,
    history: state.history,
    historyIndex: state.historyIndex,
    toggleSidebar: state.toggleSidebar,
    toggleProperties: state.toggleProperties,
    toggleComponentList: state.toggleComponentList,
  }));

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="toolbar">
      {/* Left Section - Logo */}
      <div className="toolbar-left">
        <div className="toolbar-logo">
          <div className="logo-icon">
            <Square />
          </div>
          <h1 className="logo-title">Digital Twin Designer</h1>
        </div>
      </div>

      {/* Center Section - Tools */}
      <div className="toolbar-center">
        {/* Primary Tools */}
        <div className="tool-group">
          {tools.map((tool) => {
            const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || MousePointer;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`tool-button ${activeTool === tool.id ? 'active' : 'inactive'}`}
                title={tool.name}
              >
                <IconComponent />
              </button>
            );
          })}
        </div>

        {/* Separator */}
        <div className="toolbar-separator" />

        {/* History Tools */}
        <div className="history-tools">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="action-button"
            title="Undo"
          >
            <Undo />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="action-button"
            title="Redo"
          >
            <Redo />
          </button>
        </div>

        {/* Separator */}
        <div className="toolbar-separator" />

        {/* Action Tools */}
        <div className="action-tools">
          <button
            className="action-button"
            title="Save"
          >
            <Save />
          </button>
          <button
            className="action-button"
            title="Export"
          >
            <Download />
          </button>
        </div>
      </div>

      {/* Right Section - View Controls */}
      <div className="toolbar-right">
        <button
          onClick={toggleSidebar}
          className="view-button"
        >
          Components
        </button>
        <button
          onClick={toggleComponentList}
          className="view-button"
        >
          Layers
        </button>
        <button
          onClick={toggleProperties}
          className="view-button"
        >
          Properties
        </button>
        <button
          className="settings-button"
          title="Settings"
        >
          <Settings />
        </button>
      </div>
    </div>
  );
};
