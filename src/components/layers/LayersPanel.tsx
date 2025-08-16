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
  const gridSize = useAppStore((state) => state.canvasSettings.gridSize);

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

  // ----- Size controls (px / %) -----
  const clampSize = (v: number) => Math.max(20, Math.round(v));
  const snapToGrid = (v: number) => Math.round(v / gridSize) * gridSize;

  const mergeAndUpdateProperties = (componentId: string, merge: (props: Record<string, any>) => Record<string, any>) => {
    const component = canvasComponents.find(c => c.id === componentId);
    if (!component) return;
    const nextProps = merge({ ...(component.properties || {}) });
    updateCanvasComponent(componentId, { properties: nextProps });
  };

  const getBaseSize = (componentId: string) => {
    const component = canvasComponents.find(c => c.id === componentId);
    const currentW = component?.width ?? 80;
    const currentH = component?.height ?? 80;
    const base = (component?.properties as any)?.baseSize as { width: number; height: number } | undefined;
    return base || { width: currentW, height: currentH };
  };

  const setDimUnit = (componentId: string, dim: 'width' | 'height', unit: 'px' | '%') => {
    const component = canvasComponents.find(c => c.id === componentId);
    mergeAndUpdateProperties(componentId, (props) => {
      const keyUnit = dim === 'width' ? 'widthUnit' : 'heightUnit';
      const keyPercent = dim === 'width' ? 'widthPercent' : 'heightPercent';
      const next: any = { ...props, [keyUnit]: unit };
      if (unit === '%') {
        const base = props.baseSize || getBaseSize(componentId);
        next.baseSize = base;
        const currentVal = dim === 'width' ? (component?.width ?? 80) : (component?.height ?? 80);
        const baseVal = dim === 'width' ? (base.width || 80) : (base.height || 80);
        const pct = Math.max(1, Math.round((currentVal / baseVal) * 100));
        next[keyPercent] = pct;
      }
      return next;
    });
  };

  const resetBaseSize = (componentId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const component = canvasComponents.find(c => c.id === componentId);
    if (!component) return;
    mergeAndUpdateProperties(componentId, (props) => ({
      ...props,
      baseSize: { width: component.width ?? 80, height: component.height ?? 80 },
      widthPercent: 100,
      heightPercent: 100,
    }));
  };

  const resetPosition = (componentId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateCanvasComponent(componentId, { x: 0, y: 0 } as any);
  };

  const resetSize = (componentId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const component = canvasComponents.find(c => c.id === componentId);
    if (!component) return;
    const base = getBaseSize(componentId);
    const snappedW = Math.max(20, snapToGrid(base.width || 80));
    const snappedH = Math.max(20, snapToGrid(base.height || 80));
    updateCanvasComponent(componentId, { width: snappedW, height: snappedH } as any);
    mergeAndUpdateProperties(componentId, (props) => {
      const widthUnit: 'px' | '%' = props.widthUnit === '%' ? '%' : 'px';
      const heightUnit: 'px' | '%' = props.heightUnit === '%' ? '%' : 'px';
      return {
        ...props,
        baseSize: base,
        widthPercent: widthUnit === '%' ? 100 : (props.widthPercent ?? 100),
        heightPercent: heightUnit === '%' ? 100 : (props.heightPercent ?? 100),
      } as any;
    });
  };

  const adjustSizeByPercent = (componentId: string, deltaPercent: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const component = canvasComponents.find(c => c.id === componentId);
    if (!component) return;
    const props: any = component.properties || {};
    const base = getBaseSize(componentId);

    // Width
    const widthUnit: 'px' | '%' = props.widthUnit === '%' ? '%' : 'px';
    if (widthUnit === '%') {
      const currentWPercent = props.widthPercent ?? Math.max(1, Math.round(((component.width || 80) / (base.width || 80)) * 100));
      const newWPercent = Math.max(10, Math.min(500, currentWPercent + deltaPercent));
      setDimPercent(componentId, 'width', newWPercent);
    } else {
      const newW = Math.max(20, snapToGrid((component.width || 80) * (1 + deltaPercent / 100)));
      updateCanvasComponent(componentId, { width: newW } as any);
    }

    // Height
    const heightUnit: 'px' | '%' = props.heightUnit === '%' ? '%' : 'px';
    if (heightUnit === '%') {
      const currentHPercent = props.heightPercent ?? Math.max(1, Math.round(((component.height || 80) / (base.height || 80)) * 100));
      const newHPercent = Math.max(10, Math.min(500, currentHPercent + deltaPercent));
      setDimPercent(componentId, 'height', newHPercent);
    } else {
      const newH = Math.max(20, snapToGrid((component.height || 80) * (1 + deltaPercent / 100)));
      updateCanvasComponent(componentId, { height: newH } as any);
    }
  };

  const setDimPercent = (componentId: string, dim: 'width' | 'height', percent: number) => {
    const base = getBaseSize(componentId);
    const baseVal = dim === 'width' ? (base.width || 80) : (base.height || 80);
    const rawVal = clampSize(baseVal * (percent / 100));
    const snappedVal = Math.max(20, snapToGrid(rawVal));
    updateCanvasComponent(componentId, { [dim]: snappedVal } as any);
    const effectivePercent = Math.max(1, Math.round((snappedVal / baseVal) * 100));
    mergeAndUpdateProperties(componentId, (props) => ({
      ...props,
      baseSize: base,
      [dim === 'width' ? 'widthPercent' : 'heightPercent']: effectivePercent,
      [dim === 'width' ? 'widthUnit' : 'heightUnit']: '%',
    } as any));
  };

  const setPxDimension = (componentId: string, dim: 'width' | 'height', value: number) => {
    const v = clampSize(value || 0);
    const snapped = Math.max(20, snapToGrid(v));
    updateCanvasComponent(componentId, { [dim]: snapped } as any);
    mergeAndUpdateProperties(componentId, (props) => ({
      ...props,
      [dim === 'width' ? 'widthUnit' : 'heightUnit']: 'px',
    }));
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
                    {/* Size controls */}
                    <div className="layer-size-controls" onClick={(e) => e.stopPropagation()}>
                      {(() => {
                        const props: any = component.properties || {};
                        const widthUnit: 'px' | '%' = props.widthUnit === '%' ? '%' : 'px';
                        const heightUnit: 'px' | '%' = props.heightUnit === '%' ? '%' : 'px';
                        const widthPercent = props.widthPercent ?? 100;
                        const heightPercent = props.heightPercent ?? 100;
                        const base = getBaseSize(component.id);
                        const wPctStep = Math.max(1, Math.round((gridSize / (base.width || 80)) * 100));
                        const hPctStep = Math.max(1, Math.round((gridSize / (base.height || 80)) * 100));
                        return (
                          <>
                            <div className="size-row">
                              <span className="size-label">W</span>
                              {widthUnit === 'px' ? (
                                <input
                                  type="number"
                                  className="size-input"
                                  value={Math.round(component.width ?? 80)}
                                  onChange={(e) => setPxDimension(component.id, 'width', parseFloat(e.target.value))}
                                  min={20}
                                  step={gridSize}
                                />
                              ) : (
                                <>
                                  <input
                                    type="number"
                                    className="size-input"
                                    value={Math.round(widthPercent)}
                                    onChange={(e) => setDimPercent(component.id, 'width', parseFloat(e.target.value) || 0)}
                                    min={10}
                                    max={500}
                                    step={wPctStep}
                                  />
                                  <span className="size-suffix">%</span>
                                </>
                              )}
                              <select
                                className="size-unit-select"
                                value={widthUnit}
                                onChange={(e) => setDimUnit(component.id, 'width', e.target.value as 'px' | '%')}
                              >
                                <option value="px">px</option>
                                <option value="%">%</option>
                              </select>
                            </div>
                            <div className="size-row">
                              <span className="size-label">H</span>
                              {heightUnit === 'px' ? (
                                <input
                                  type="number"
                                  className="size-input"
                                  value={Math.round(component.height ?? 80)}
                                  onChange={(e) => setPxDimension(component.id, 'height', parseFloat(e.target.value))}
                                  min={20}
                                  step={gridSize}
                                />
                              ) : (
                                <>
                                  <input
                                    type="number"
                                    className="size-input"
                                    value={Math.round(heightPercent)}
                                    onChange={(e) => setDimPercent(component.id, 'height', parseFloat(e.target.value) || 0)}
                                    min={10}
                                    max={500}
                                    step={hPctStep}
                                  />
                                  <span className="size-suffix">%</span>
                                </>
                              )}
                              <select
                                className="size-unit-select"
                                value={heightUnit}
                                onChange={(e) => setDimUnit(component.id, 'height', e.target.value as 'px' | '%')}
                              >
                                <option value="px">px</option>
                                <option value="%">%</option>
                              </select>
                            </div>
                            <div className="size-percent-row">
                              <button className="size-reset-btn" title="Set base to current" onClick={(e) => resetBaseSize(component.id, e)}>Set base</button>
                              <div className="size-base">Base: {Math.round(base.width)}×{Math.round(base.height)}</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  
                  <div className="layer-controls">
                    {/* Size adjust and reset controls */}
                    <button
                      className="layer-control-btn"
                      onClick={(e) => adjustSizeByPercent(component.id, -10, e)}
                      title="-10% size"
                    >
                      -10%
                    </button>
                    <button
                      className="layer-control-btn"
                      onClick={(e) => adjustSizeByPercent(component.id, 10, e)}
                      title="+10% size"
                    >
                      +10%
                    </button>
                    <button
                      className="layer-control-btn"
                      onClick={(e) => resetSize(component.id, e)}
                      title="Reset size to base"
                    >
                      Reset size
                    </button>
                    <button
                      className="layer-control-btn"
                      onClick={(e) => resetPosition(component.id, e)}
                      title="Reset position to (0,0)"
                    >
                      Reset pos
                    </button>
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
