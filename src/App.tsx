import { MainLayout } from './components/layout/MainLayout';

function App() {
  console.log('🚀 App component rendering with MainLayout...');
  
  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <MainLayout />
    </div>
  );
}

export default App;
