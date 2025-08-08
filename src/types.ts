export interface Component {
  id: string;
  name: string;
  category: string;
  description: string;
  svg: string;
  tags: string[];
  version: string;
  author?: string;
  license?: string;
  parameters?: ComponentParameter[];
}

export interface ComponentParameter {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'color' | 'array' | 'object';
  defaultValue?: any;
  description?: string;
  required?: boolean;
  options?: { label: string; value: any }[];
  children?: ComponentParameter[];
}

export interface CanvasComponent extends Omit<Component, 'parameters'> {
  x: number;
  y: number;
  width?: number;
  height?: number;
  rotation?: number;
  zIndex: number;
  selected?: boolean;
  data: Record<string, any>;
  parameters?: Record<string, any>;
}

export interface CanvasSettings {
  width: number;
  height: number;
  backgroundColor: string;
  showGrid: boolean;
  gridSize: number;
  gridColor: string;
  snapToGrid: boolean;
  zoom: number;
  panX: number;
  panY: number;
}

export interface Selection {
  componentIds: string[];
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface HistoryState {
  past: AppState[];
  future: AppState[];
  present: AppState;
}

export interface ToolbarTool {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export interface AppState {
  // Components
  availableComponents: Component[];
  canvasComponents: CanvasComponent[];
  
  // Selection
  selection: Selection;
  
  // Canvas
  canvasSettings: CanvasSettings;
  
  // Tools
  tools: ToolbarTool[];
  activeTool: string;
  
  // UI State
  sidebarVisible: boolean;
  propertiesVisible: boolean;
  componentListVisible: boolean;
  
  // Search & Filter
  searchQuery: string;
  selectedCategory: string;
  
  // History
  history: HistoryState;
  
  // Drag & Drop
  isDragging: boolean;
  draggingComponent: Component | null;
}
