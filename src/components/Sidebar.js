import React from 'react';

const Sidebar = ({ filters, onFilterChange }) => (
  <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
    <h2 className="font-bold mb-2">Filters</h2>
    <button className="text-blue-500 mb-4 hover:underline" onClick={() => onFilterChange('clear')}>Clear All</button>
    
    <div className="mb-4">
      <h3 className="font-semibold mb-2">SEARCH</h3>
      <input 
        type="text" 
        className="w-full border p-1" 
        value={filters.search} 
        onChange={(e) => onFilterChange('search', e.target.value)} 
        placeholder="Filter pipelines..."
      />
    </div>
    
    <div>
      <h3 className="font-semibold mb-2">STATUS</h3>
      {['Running', 'Succeeded', 'Failed', 'Not Started', 'Canceled'].map(status => (
        <label key={status} className="flex items-center mb-2">
          <input 
            type="checkbox" 
            className="mr-2"
            checked={filters.status[status]}
            onChange={(e) => onFilterChange('status', status, e.target.checked)}
          />
          {status}
        </label>
      ))}
    </div>
  </div>
);

export default Sidebar;