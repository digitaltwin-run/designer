import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { AppState, Component, CanvasComponent, CanvasSettings, Selection, HistoryState, ToolbarTool } from '../types';

const initialCanvasSettings: CanvasSettings = {
  width: 1200,
  height: 800,
  backgroundColor: '#ffffff',
  showGrid: true,
  gridSize: 20,
  gridColor: '#f1f5f9',
  snapToGrid: true,
  zoom: 1,
  panX: 0,
  panY: 0,
};

const initialTools: ToolbarTool[] = [
  { id: 'select', name: 'Select', icon: 'MousePointer', active: true },
  { id: 'pan', name: 'Pan', icon: 'Hand', active: false },
  { id: 'zoom', name: 'Zoom', icon: 'ZoomIn', active: false },
];

interface AppStore extends AppState {
  // Actions
  loadComponents: (components: Component[]) => void;
  addComponentToCanvas: (component: Component, position: { x: number; y: number }) => void;
  addCanvasComponent: (canvasComponent: CanvasComponent) => void;
  removeComponentFromCanvas: (componentId: string) => void;
  updateCanvasComponent: (componentId: string, updates: Partial<CanvasComponent>) => void;
  
  // Selection
  selectComponents: (componentIds: string[]) => void;
  clearSelection: () => void;
  toggleComponentSelection: (componentId: string) => void;
  selectCanvasComponent: (componentId: string) => void;
  clearCanvasSelection: () => void;
  
  // Canvas
  updateCanvasSettings: (settings: Partial<CanvasSettings>) => void;
  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  
  // Tools
  setActiveTool: (toolId: string) => void;
  
  // UI
  toggleSidebar: () => void;
  toggleProperties: () => void;
  toggleComponentList: () => void;
  
  // Search & Filter
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  
  // History
  saveToHistory: (action: string) => void;
  undo: () => void;
  redo: () => void;
  
  // Drag & Drop
  setDragging: (isDragging: boolean, component?: Component) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    immer((set) => ({
      // Initial State
      availableComponents: [],
      canvasComponents: [],
      selectedComponentIds: [],
      selectedCanvasComponent: null,
      canvasSettings: initialCanvasSettings,
      selection: { componentIds: [] },
      tools: initialTools,
      activeTool: 'select',
      sidebarVisible: true,
      propertiesVisible: true,
      componentListVisible: false,
      
      // Search & Filter
      searchQuery: '',
      selectedCategory: 'all',
      
      // History
      history: [],
      historyIndex: -1,
      
      // Search & Filter
      searchQuery: '',
      selectedCategory: 'all',
      
      // History - fix HistoryState type
      history: { past: [], future: [], present: null },
      historyIndex: -1,
      
      // Drag & Drop
      isDragging: false,
      draggedComponent: undefined,

      // Actions
      loadComponents: (components) =>
        set((state) => {
          state.availableComponents = components;
        }),

      addComponentToCanvas: (component, position) =>
        set((state) => {
          const newComponent: CanvasComponent = {
            id: `${component.id}_${Date.now()}`,
            componentId: component.id,
            name: component.name,
            x: position.x,
            y: position.y,
            width: 100,
            height: 100,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            visible: true,
            locked: false,
            properties: {},
            svg: component.svg,
            zIndex: state.canvasComponents.length,
          };
          state.canvasComponents.push(newComponent);
          state.selection.componentIds = [newComponent.id];
        }),

      removeComponentFromCanvas: (componentId) =>
        set((state) => {
          state.canvasComponents = state.canvasComponents.filter((c: CanvasComponent) => c.id !== componentId);
          state.selection.componentIds = state.selection.componentIds.filter((id: string) => id !== componentId);
        }),

      updateCanvasComponent: (componentId, updates) =>
        set((state) => {
          const component = state.canvasComponents.find((c: CanvasComponent) => c.id === componentId);
          if (component) {
            Object.assign(component, updates);
          }
        }),

      // Selection
      selectComponents: (componentIds) =>
        set((state) => {
          state.selection.componentIds = componentIds;
        }),

      clearSelection: () =>
        set((state) => {
          state.selection.componentIds = [];
          state.selection.bounds = undefined;
        }),

      toggleComponentSelection: (componentId) =>
        set((state) => {
          const currentSelection = state.selection.componentIds;
          if (currentSelection.includes(componentId)) {
            state.selection.componentIds = currentSelection.filter((id: string) => id !== componentId);
          } else {
            state.selection.componentIds = [...currentSelection, componentId];
          }
        }),

      // Canvas
      updateCanvasSettings: (settings) =>
        set((state) => {
          Object.assign(state.canvasSettings, settings);
        }),

      setZoom: (zoom) =>
        set((state) => {
          state.canvasSettings.zoom = Math.max(0.1, Math.min(5, zoom));
        }),

      setPan: (panX, panY) =>
        set((state) => {
          state.canvasSettings.panX = panX;
          state.canvasSettings.panY = panY;
        }),

      // Tools
      setActiveTool: (toolId) =>
        set((state) => {
          state.activeTool = toolId;
        }),

      // Selection Actions
      selectCanvasComponent: (componentId: string) => {
        set((state) => {
          const component = state.canvasComponents.find(c => c.id === componentId);
          state.selectedCanvasComponent = component || null;
          state.propertiesVisible = true; // Auto-show properties when selecting
        });
      },
      
      clearCanvasSelection: () => {
        set((state) => {
          state.selectedCanvasComponent = null;
        });
      },
      
      selectComponents: (componentIds: string[]) => {
        set((state) => {
          state.selection.componentIds = componentIds;
        });
      },
      
      clearSelection: () => {
        set((state) => {
          state.selection.componentIds = [];
        });
      },
      
      toggleComponentSelection: (componentId: string) => {
        set((state) => {
          const index = state.selection.componentIds.indexOf(componentId);
          if (index > -1) {
            state.selection.componentIds.splice(index, 1);
          } else {
            state.selection.componentIds.push(componentId);
          }
        });
      },
      
      // UI
      toggleSidebar: () => set((state) => ({ sidebarVisible: !state.sidebarVisible })),
      toggleProperties: () => set((state) => ({ propertiesVisible: !state.propertiesVisible })),
      toggleComponentList: () => set((state) => ({ componentListVisible: !state.componentListVisible })),
      
      // Search & Filter
      setSearchQuery: (query) =>
        set((state) => {
          state.searchQuery = query;
        }),

      setSelectedCategory: (category) =>
        set((state) => {
          state.selectedCategory = category;
        }),

      // History
      saveToHistory: (action) =>
        set((state) => {
          const currentState: HistoryState = {
            canvasComponents: JSON.parse(JSON.stringify(state.canvasComponents)),
            canvasSettings: JSON.parse(JSON.stringify(state.canvasSettings)),
            timestamp: Date.now(),
            action,
          };
          
          // Remove any future history if we're not at the end
          state.history = state.history.slice(0, state.historyIndex + 1);
          state.history.push(currentState);
          state.historyIndex = state.history.length - 1;
          
          // Limit history size
          if (state.history.length > 100) {
            state.history = state.history.slice(-50);
            state.historyIndex = state.history.length - 1;
          }
        }),

      undo: () =>
        set((state) => {
          if (state.historyIndex > 0) {
            state.historyIndex--;
            const historyState = state.history[state.historyIndex];
            state.canvasComponents = JSON.parse(JSON.stringify(historyState.canvasComponents));
            state.canvasSettings = JSON.parse(JSON.stringify(historyState.canvasSettings));
          }
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            state.historyIndex++;
            const historyState = state.history[state.historyIndex];
            state.canvasComponents = JSON.parse(JSON.stringify(historyState.canvasComponents));
            state.canvasSettings = JSON.parse(JSON.stringify(historyState.canvasSettings));
          }
        }),

      // Drag & Drop
      setDragging: (isDragging, component) =>
        set((state) => {
          state.isDragging = isDragging;
          state.draggedComponent = component;
        }),

      // Canvas Components
      addCanvasComponent: (canvasComponent: CanvasComponent) =>
        set((state) => {
          state.canvasComponents.push(canvasComponent);
          console.log('✅ Added canvas component:', canvasComponent.id, 'Total:', state.canvasComponents.length);
        }),
    })),
    { name: 'digital-twin-designer' }
  )
);
