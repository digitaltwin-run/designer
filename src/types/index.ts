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
  name: string;
  type: 'text' | 'number' | 'color' | 'boolean' | 'select';
  default: any;
  options?: any[];
  description?: string;
}

export interface CanvasComponent {
  id: string;
  componentId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  properties: Record<string, any>;
  svg: string;
  zIndex: number;
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

export interface ToolbarTool {
  id: string;
  name: string;
  icon: string;
  shortcut?: string;
  active: boolean;
}

export interface Selection {
  componentIds: string[];
  bounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface HistoryState {
  canvasComponents: CanvasComponent[];
  canvasSettings: CanvasSettings;
  timestamp: number;
  action?: string;
}

export interface AppState {
  // Components
  availableComponents: Component[];
  canvasComponents: CanvasComponent[];
  
  // Canvas
  canvasSettings: CanvasSettings;
  
  // Selection & Tools
  selection: Selection;
  selectedComponentIds: string[];
  selectedCanvasComponent: CanvasComponent | null;
  activeTool: string;
  tools: ToolbarTool[];
  
  // UI State
  sidebarVisible: boolean;
  propertiesVisible: boolean;
  componentListVisible: boolean;
  
  // History
  history: HistoryState[];
  historyIndex: number;
  
  // Search & Filter
  searchQuery: string;
  selectedCategory: string;
  
  // Drag & Drop
  isDragging: boolean;
  draggedComponent?: Component;
}

export type ViewMode = 'design' | 'preview' | 'code';
export type PanelPosition = 'left' | 'right' | 'bottom';
