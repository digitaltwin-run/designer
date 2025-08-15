# Digital Twin Designer

🎨 **Advanced React-based IDE for Digital Twin Component Design**

A powerful, modern web application for designing and managing digital twin components with native SVG canvas, drag-and-drop functionality, real-time manipulation, embedded animation support, and advanced export capabilities including video recording.

![Version](https://img.shields.io/badge/version-0.1.0-green)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)

## ✨ Features

### 🎯 Core Functionality
- **Native SVG Canvas**: High-performance rendering with direct DOM manipulation
- **Drag & Drop Interface**: Seamless component placement with grid snapping
- **Multi-Selection System**: Ctrl+click selection with group operations
- **Component Library**: 23+ animated SVG components with categories
- **Layers Panel**: Complete hierarchy management with z-order controls
- **Properties Panel**: Live editing with real-time canvas updates
- **Canvas Panning**: Smooth 60fps viewport navigation
- **Embedded Animations**: Native JavaScript animation support in SVG components

### 🚀 Advanced Features
- **SVG Export**: Download complete canvas as standalone SVG with embedded scripts
- **Video Export**: Record canvas animations and export as HTML with embedded video
- **Script Execution**: Native JavaScript animation execution within SVG components
- **Group Operations**: Multi-component selection, movement, and manipulation
- **Layer Management**: Visual hierarchy control with drag reordering
- **History System**: Full undo/redo with state restoration
- **Performance Optimized**: 60fps interactions with efficient DOM updates
- **Browser Recording**: Screen capture API integration for video export

## 🏗️ Architecture

### 🛠️ Technology Stack
- **Frontend**: React 19.1.1 + TypeScript 5.x
- **Build Tool**: Vite 6.x with HMR
- **State Management**: Zustand 5.0.7 with individual selectors
- **Canvas Rendering**: Native SVG with React DOM manipulation
- **Animation Support**: Embedded JavaScript execution in SVG components
- **Recording API**: MediaRecorder with Screen Capture API
- **Styling**: CSS Modules + custom SVG styling
- **Icons**: Lucide React 0.537.0

### 📁 Project Structure
```
src/
├── components/           # React components
│   ├── canvas/          # SVG Canvas system (SVGCanvas, SVGGrid, SVGCanvasComponent)
│   ├── layers/          # Layers panel for component hierarchy
│   ├── sidebar/         # Component library with categories
│   ├── toolbar/         # Export tools and actions
│   ├── properties/      # Live property editing
│   └── layout/          # Responsive layout system
├── store/               # Zustand store with optimized selectors
├── types/               # TypeScript interfaces and types
├── data/                # Component metadata and categories
├── hooks/               # Custom React hooks
├── utils/               # Utility functions and helpers
└── assets/              # Static assets and animated SVG files
public/assets/components/ # SVG component library (23+ components)
```

### 🔄 State Management

**Zustand Store Architecture:**
- `availableComponents`: SVG component library with categories (23+ components)
- `canvasComponents`: Active canvas components with animation state
- `selectedComponents`: Multi-selection system with group operations
- `history`: Undo/redo system with state restoration
- `layersVisible`: Layers panel visibility and controls
- `gridSize`: Canvas grid configuration (20px default)
- `actions`: Optimized component manipulation and export functions
- `export functions`: Global `exportCanvasToSVG()` and `exportSVGWithVideo()`

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with SVG and Screen Recording API support (Chrome/Edge recommended)

### ⚡ Installation

```bash
# Clone the repository
git clone https://github.com/digitaltwin-run/designer.git
cd designer

# Install dependencies
npm install

# Start development server
npm run dev
```

### 📝 Development Commands

```bash
# Development server with HMR
npm run dev

# Type checking and build
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview

# Export SVG (in browser console)
window.exportCanvasToSVG()

# Export with 10s video recording
window.exportSVGWithVideo(10)
```

## 🎨 Usage Guide

### 🖱️ Basic Operations

1. **Adding Components**:
   - Browse 23+ animated components in left sidebar
   - Filter by categories: Controls, Displays, Sensors, Actuators, etc.
   - Drag desired component onto SVG canvas
   - Component automatically snaps to 20px grid

2. **Multi-Selection System**:
   - Click component to select (visual highlight)
   - Ctrl+click for multiple component selection
   - Group operations: move selected components together
   - Grid snapping applies to all selected components

3. **Component Manipulation**:
   - **Move**: Drag selected components with grid snapping
   - **Group Move**: Multi-selected components move as a unit
   - **Layers**: Use Layers panel to manage z-order and visibility
   - **Properties**: Live editing with real-time canvas updates

4. **Advanced Features**:
   - **Animations**: JavaScript animations run natively in SVG components
   - **Export SVG**: Download complete canvas with embedded scripts
   - **Video Export**: Record 10s animation and download as HTML+video
   - **History**: Full undo/redo system with state restoration

5. **Layer Management**:
   - Open Layers panel in right sidebar
   - Drag to reorder component hierarchy
   - Toggle visibility and lock/unlock components
   - Synchronized selection between canvas and layers

### 🎯 Canvas Navigation

- **Panning**: Smooth 60fps viewport navigation with viewBox manipulation
- **Grid System**: 20px grid with visual snapping feedback
- **Export Controls**: Toolbar buttons for SVG and video export
- **Recording**: 10-second screen recording with visual indicator
- **Performance**: Native SVG rendering with direct DOM manipulation

### 🔍 Component Management

- **Categories**: Controls, Displays, Sensors, Actuators, Electronics, Computers
- **Animations**: LED blinking, valve operations, motor rotation
- **Properties**: Live editing of position, size, visibility, lock state
- **Layers Panel**: Visual hierarchy with z-index controls
- **Export Options**: SVG with scripts or HTML with embedded video

## 🧩 Component Development

### 📝 Creating New Components

1. **SVG Assets**: Add SVG files to `public/assets/components/`
2. **Metadata**: Update `src/data/components.ts` with component definition:

```typescript
{
  id: 'unique-id',
  name: 'Component Name',
  svg: '/assets/components/filename.svg',
  tags: ['category', 'keywords'],
  viewMode: 'grid' | 'list',
  properties: {
    // Editable properties
  }
}
```

### 🎨 SVG Requirements

- **Format**: Clean, optimized SVG with embedded JavaScript support
- **ViewBox**: Properly defined dimensions for scaling
- **Animations**: JavaScript `<script>` blocks for interactive behavior
- **Colors**: CSS-friendly color definitions with animation support
- **Performance**: Optimized for 60fps canvas rendering
- **Compatibility**: Native browser SVG support with script execution

## 🔧 API Reference

### 🚀 Export Functions

**Global functions available in browser console:**

```javascript
// Export canvas as SVG with embedded scripts
window.exportCanvasToSVG()
// Downloads: digital-twin-canvas.svg

// Export canvas with 10-second video recording  
window.exportSVGWithVideo(10)
// Downloads: digital-twin-canvas-with-video-YYYY-MM-DD.html
```

### 📊 Canvas Events

```javascript
// Component events
canvas.on('componentAdded', (component) => { ... })
canvas.on('componentMoved', (component) => { ... })
canvas.on('selectionChanged', (components) => { ... })

// Export events  
canvas.on('exportStarted', () => { ... })
canvas.on('exportCompleted', (file) => { ... })
```

### 🎛️ Store Actions

```javascript
// Component management
const { addCanvasComponent, updateComponent, deleteComponent } = useAppStore()

// Selection system
const { selectComponent, toggleSelection, clearSelection } = useAppStore()

// History system
const { undo, redo, history, historyIndex } = useAppStore()

// Export functions
const { exportToSVG, exportSVGWithVideo } = useAppStore()
```

## 🔧 Configuration

### ⚙️ Canvas Settings

```typescript
// src/store/useAppStore.ts
canvasSettings: {
  gridSize: 20,           // Grid unit size in pixels (native SVG)
  width: 1200,           // Canvas width
  height: 800,           // Canvas height  
  viewBox: { x, y, width, height }, // SVG viewBox for panning
  recordingDuration: 10  // Video recording duration in seconds
}
```

### 🎯 Component Properties

```typescript
interface CanvasComponent {
  id: string;
  componentId: string;    // Reference to library component
  name: string;
  x: number;             // Canvas position X
  y: number;             // Canvas position Y
  width: number;         // Component width
  height: number;        // Component height
  rotation: number;      // Rotation in degrees
  scaleX: number;        // Horizontal scale factor
  scaleY: number;        // Vertical scale factor
  opacity: number;       // Transparency (0-1)
  visible: boolean;      // Visibility toggle
  locked: boolean;       // Edit lock status
  properties: Record<string, any>; // Custom properties
  svg: string;           // SVG file path
  zIndex: number;        // Layer order
}
```

## 🐛 Troubleshooting

### 🚨 Common Issues

**Components not rendering:**
- Check SVG file paths in `public/assets/components/`
- Verify component metadata in `components.ts`
- Ensure proper TypeScript typing

**Drag & Drop not working:**
- Verify DndProvider is wrapping the app
- Check react-dnd dependencies
- Ensure drop targets are properly configured

**Canvas performance issues:**
- Reduce number of components
- Optimize SVG files
- Check for memory leaks in Konva

**State management errors:**
- Use Zustand devtools for debugging
- Check Immer middleware setup
- Verify action implementations

### 🔍 Development Tools

- **React DevTools**: Component inspection
- **Zustand DevTools**: State debugging  
- **Browser DevTools**: Performance profiling
- **TypeScript**: Static type checking

## 🤝 Contributing

### 📋 Development Workflow

1. **Fork** the repository
2. **Create** feature branch
3. **Implement** changes with tests
4. **Ensure** TypeScript compliance
5. **Submit** pull request

### 📏 Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Prettier**: Auto-formatting (if configured)
- **Component**: Functional components with hooks
- **State**: Use Zustand for global state
- **Styling**: CSS Modules + utility classes

## 📄 License

This project is part of the Digital Twin Run ecosystem. See project license for details.

---

**🔗 Related Projects:**
- [Digital Twin PWA](../pwa/) - Main application
- [Component Library](../components/) - SVG assets

**📧 Support:**
For issues and questions, please create GitHub issues or contact the development team.

---

*Built with ❤️ using React, TypeScript, and modern web technologies.*
