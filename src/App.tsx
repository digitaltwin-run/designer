import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MainLayout } from './components/layout/MainLayout';
import { useAppStore } from './store/useAppStore';
import { availableComponents } from './data/components';

function App() {
  console.log('🚀 App component rendering with MainLayout...');
  
  const loadComponents = useAppStore(state => state.loadComponents);
  
  // Load components on app initialization
  useEffect(() => {
    console.log('📦 Loading available components...', availableComponents.length);
    loadComponents(availableComponents);
  }, [loadComponents]);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ 
        width: '100vw', 
        height: '100vh',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}>
        <MainLayout />
      </div>
    </DndProvider>
  );
}

export default App;
