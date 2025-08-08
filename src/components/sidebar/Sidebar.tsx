import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ComponentItem } from './ComponentItem';
import { Search, Filter, Grid, List } from 'lucide-react';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  const { 
    availableComponents,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory
  } = useAppStore(state => ({
    availableComponents: state.availableComponents,
    searchQuery: state.searchQuery,
    selectedCategory: state.selectedCategory,
    setSearchQuery: state.setSearchQuery,
    setSelectedCategory: state.setSelectedCategory,
  }));

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(['all']);
    availableComponents.forEach(component => {
      if (component.category) {
        cats.add(component.category);
      }
    });
    return Array.from(cats);
  }, [availableComponents]);

  // Filter components
  const filteredComponents = useMemo(() => {
    return availableComponents.filter(component => {
      // Category filter
      if (selectedCategory !== 'all' && component.category !== selectedCategory) {
        return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          component.name.toLowerCase().includes(query) ||
          component.description.toLowerCase().includes(query) ||
          component.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [availableComponents, selectedCategory, searchQuery]);

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h2 className="sidebar-title">Components</h2>
        
        {/* Search */}
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Controls */}
        <div className="controls">
          {/* Category Filter */}
          <div className="filter-section">
            <Filter className="filter-icon" />
            <select
              value={selectedCategory || 'all'}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              onClick={() => setViewMode('grid')}
              className={`view-button ${viewMode === 'grid' ? 'active' : 'inactive'}`}
              title="Grid View"
            >
              <Grid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`view-button ${viewMode === 'list' ? 'active' : 'inactive'}`}
              title="List View"
            >
              <List />
            </button>
          </div>
        </div>
      </div>

      {/* Components List */}
      <div className="components-container">
        {filteredComponents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-text">No components found</p>
            {searchQuery && (
              <p className="empty-state-subtext">Try adjusting your search terms</p>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'components-grid' : 'components-list'}>
            {filteredComponents.map((component) => (
              <ComponentItem
                key={component.id}
                component={component}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-stats">
          {filteredComponents.length} of {availableComponents.length} components
        </div>
      </div>
    </div>
  );
};
