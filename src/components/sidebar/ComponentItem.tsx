import React from 'react';
import { useDrag } from 'react-dnd';
import type { Component } from '../../types';
import './ComponentItem.css';

interface ComponentItemProps {
  component: Component;
  viewMode: 'grid' | 'list';
}

export const ComponentItem: React.FC<ComponentItemProps> = ({ component, viewMode }) => {
  // Reduced logging for performance

  const [{ isDragging }, drag] = useDrag({
    type: 'component',
    item: { component },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Reduced logging for performance

  // Bridge react-dnd drag ref to a typed React ref callback
  const dragRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node) drag(node);
  }, [drag]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fn = (window as unknown as { placeComponentAtCanvasCenter?: (component: Component) => void }).placeComponentAtCanvasCenter;
    if (typeof fn === 'function') {
      fn(component);
    } else {
      console.warn('placeComponentAtCanvasCenter is not available');
    }
  };

  // If invalid component data, render fallback but do not skip hooks
  const invalid = !component || !component.id || !component.name;

  if (viewMode === 'list') {
    return (
      <div
        ref={dragRef}
        className={`component-item-list ${
          isDragging ? 'dragging' : ''
        }`}
        data-testid="sidebar-item"
        data-component-id={component.id}
        data-testid-item={`sidebar-item-${component.id}`}
        draggable
        onDoubleClick={handleDoubleClick}
      >
        {/* Invalid fallback */}
        {invalid ? (
          <div className="component-error">Invalid component: {component?.id || 'no-id'}</div>
        ) : (
        // SVG Preview
        <div className="component-preview-list">
          <img
            src={component.svg}
            alt={component.name}
            onError={(e) => {
              // Fallback to placeholder if SVG fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `<div class="component-placeholder-content">${component.id}</div>`;
              }
            }}
          />
        </div>)}

        {/* Component Info */}
        <div className="component-info-list">
          <h4 className="component-name-list">{component.name}</h4>
          <p className="component-description-list">{component.description || component.category}</p>
        </div>

        {/* Tags */}
        {component.tags && component.tags.length > 0 && (
          <div className="component-tags-list">
            <span className="component-tag-list">
              {component.tags[0]}
              {component.tags.length > 1 && ` +${component.tags.length - 1}`}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Grid view
  return (
    <div
      ref={dragRef}
      className={`component-item-grid ${
        isDragging ? 'dragging' : ''
      }`}
      data-testid="sidebar-item"
      data-component-id={component.id}
      data-testid-item={`sidebar-item-${component.id}`}
      draggable
      onDoubleClick={handleDoubleClick}
    >
      {/* Invalid fallback or SVG Preview */}
      {invalid ? (
        <div className="component-error">Invalid component: {component?.id || 'no-id'}</div>
      ) : (
        <div className="component-preview-grid">
          <img
            src={component.svg}
            alt={component.name}
            onError={(e) => {
              // Fallback to placeholder if SVG fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="component-placeholder">
                    <div class="component-placeholder-content">
                      <div class="component-placeholder-icon"></div>
                      ${component.id}
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>
      )}

      {/* Component Info */}
      <div className="component-info-grid">
        <h4 className="component-name-grid">{component.name}</h4>
        
        {/* Description */}
        {component.description && (
          <p className="component-description-grid">{component.description}</p>
        )}

        {/* Category & Tags */}
        <div className="component-meta-grid">
          {component.category && (
            <span className="component-category-grid">
              {component.category}
            </span>
          )}
          
          {component.tags && component.tags.length > 0 && (
            <div className="component-tag-count">
              {component.tags.length} tag{component.tags.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Hover overlay for drag indication */}
      <div className="component-hover-overlay">
        <div className="component-drag-indicator">
          Drag to canvas
        </div>
      </div>
    </div>
  );
};
