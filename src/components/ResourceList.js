import React from 'react';
import StatusIcon from './StatusIcon';

const ResourceList = ({ resources, showDiff, onToggleDiff }) => (
  <div className="mt-2 space-y-2 max-h-96 overflow-y-auto">
    {resources.map((resource, index) => (
      <div key={index} className="border rounded p-2">
        <div className="flex justify-between items-center">
          <span className="font-medium">{resource.kind}/{resource.name}</span>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded mr-2 text-sm ${
              resource.status === 'Synced' ? 'bg-green-100 text-green-700' : 
              resource.status === 'OutOfSync' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              <StatusIcon status={resource.status} />
              <span className="ml-1">{resource.status}</span>
            </span>
            {resource.diff && (
              <button 
                onClick={() => onToggleDiff(index)} 
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                {showDiff === index ? 'Hide Diff' : 'Show Diff'}
              </button>
            )}
          </div>
        </div>
        {showDiff === index && resource.diff && (
          <pre className="mt-2 p-2 bg-gray-100 text-sm overflow-x-auto whitespace-pre-wrap">
            {resource.diff}
          </pre>
        )}
        {resource.status === 'Failed' && (
          <div className="mt-2">
            <a href={resource.logLink} className="text-blue-500 hover:underline text-sm" target="_blank" rel="noopener noreferrer">View Logs</a>
            <p className="text-red-500 mt-1 text-sm">{resource.failureCause}</p>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default ResourceList;