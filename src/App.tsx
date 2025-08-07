import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useAppStore } from './store/useAppStore';
import { MainLayout } from './components/layout/MainLayout';
import type { Component } from './types';

function App() {
  const loadComponents = useAppStore(state => state.loadComponents);

  useEffect(() => {
    // Load components from public assets
    const loadComponentsData = async () => {
      try {
        const response = await fetch('/assets/components.json');
        const data = await response.json();
        
        // Transform data to match our Component interface
        const components: Component[] = Object.entries(data).map(([id, component]: [string, any]) => ({
          id,
          name: component.name || id,
          category: component.category || 'uncategorized',
          description: component.description || '',
          svg: `/assets/components/${id}.svg`,
          tags: component.tags || [],
          version: component.version || '1.0.0',
          author: component.author,
          license: component.license,
          parameters: component.parameters || [],
        }));
        
        loadComponents(components);
        console.log(`🎨 Loaded ${components.length} components`);
      } catch (error) {
        console.error('Failed to load components:', error);
      }
    };

    loadComponentsData();
  }, [loadComponents]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full h-full">
        <MainLayout />
      </div>
    </DndProvider>
  );
}

export default App;
