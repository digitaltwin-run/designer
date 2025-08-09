# Digital Twin Designer

🎨 **Advanced React-based IDE for Digital Twin Component Design**

A powerful, modern web application for designing and managing digital twin components with intuitive drag-and-drop functionality, real-time canvas manipulation, and comprehensive property management.

![Version](https://img.shields.io/badge/version-0.0.0-blue)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)

## ✨ Features

### 🎯 Core Functionality
- **Drag & Drop Interface**: Seamless component placement from sidebar to canvas
- **Grid-Based Canvas**: Snap-to-grid functionality with visible grid lines
- **Real-time Manipulation**: Move, resize, rotate, and scale components
- **Component Library**: Comprehensive SVG component collection
- **Properties Panel**: Live editing of component properties and metadata
- **Selection System**: Multi-select and individual component selection
- **Canvas Panning**: Right-click drag viewport navigation

### 🔧 Advanced Features
- **Proportional Resizing**: Aspect-ratio preservation during scaling
- **Grid Snapping**: Automatic alignment to grid increments
- **Visual Feedback**: Real-time hover states and selection outlines
- **Component Categories**: Organized sidebar with search and filtering
- **Responsive Layout**: Adaptive UI for different screen sizes
- **State Persistence**: Robust state management with Zustand

## 🏗️ Architecture

### 🛠️ Technology Stack
- **Frontend**: React 19.1.1 + TypeScript 5.x
- **Build Tool**: Vite 6.x with HMR
- **State Management**: Zustand 5.0.7 with Immer
- **Canvas Rendering**: React-Konva 19.0.7 + Konva 9.3.22
- **Drag & Drop**: React-DnD 16.0.1 with HTML5 Backend
- **Styling**: CSS Modules + Tailwind utilities
- **Icons**: Lucide React 0.537.0

### 📁 Project Structure
```
src/
├── components/           # React components
│   ├── canvas/          # Canvas and rendering logic
│   ├── sidebar/         # Component library and search
│   ├── toolbar/         # Tool selection and actions
│   ├── properties/      # Property editing panels
│   └── layout/          # Layout and navigation
├── store/               # Zustand store and state management
├── types/               # TypeScript type definitions
├── data/                # Static data and component metadata
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── assets/              # Static assets and SVG files
```

### 🔄 State Management

**Zustand Store Architecture:**
- `availableComponents`: SVG component library metadata
- `canvasComponents`: Active components on canvas
- `canvasSettings`: Grid, zoom, and canvas configuration
- `selection`: Component selection state
- `ui`: Interface state (panels, dialogs, etc.)
- `actions`: Component manipulation and canvas operations

## 🚀 Getting Started

### 📋 Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with Canvas support

### ⚡ Installation

```bash
# Clone the repository
git clone <repository-url>
cd designer

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🏃‍♂️ Development Commands

```bash
# Development server with HMR
npm run dev

# Type checking and build
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## 🎨 Usage Guide

### 🖱️ Basic Operations

1. **Adding Components**:
   - Browse component library in left sidebar
   - Drag desired component onto canvas
   - Component automatically snaps to grid

2. **Selecting Components**:
   - Click component to select
   - Ctrl+click for multi-selection
   - Selection outline and resize handles appear

3. **Moving Components**:
   - Drag selected components
   - Automatic grid snapping
   - Real-time position feedback

4. **Resizing Components**:
   - Use corner handles for proportional scaling
   - Use edge handles for aspect-independent resizing
   - Shift+drag for constrained proportions

5. **Editing Properties**:
   - Select component
   - Use properties panel on right
   - Live updates reflected on canvas

### 🎯 Canvas Navigation

- **Panning**: Right-click + drag to move viewport
- **Grid Toggle**: Show/hide grid lines
- **Zoom**: Mouse wheel (planned feature)
- **Selection**: Marquee selection (planned feature)

### 🔍 Component Management

- **Search**: Filter components by name or tag
- **Categories**: Browse by component type
- **Properties**: Edit colors, text, dimensions
- **Metadata**: View component information

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

- **Format**: Clean, optimized SVG
- **ViewBox**: Properly defined dimensions
- **Colors**: Use CSS-friendly color definitions
- **Text**: Editable text elements with IDs
- **Size**: Reasonable dimensions for canvas use

## 🔧 Configuration

### ⚙️ Canvas Settings

```typescript
// src/store/useAppStore.ts
canvasSettings: {
  gridSize: 20,           // Grid unit size in pixels
  showGrid: true,         // Grid visibility
  width: 800,            // Canvas width
  height: 600,           // Canvas height
  backgroundColor: '#f8f9fa'
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
