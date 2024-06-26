import React from 'react';
import { Tag } from 'lucide-react';
import StatusIcon from './StatusIcon';

const PipelineStage = ({ name, status, environment, version, onClick, isSelected }) => (
  <div 
    className={`border border-gray-300 p-2 bg-white cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    onClick={onClick}
  >
    <div className="font-semibold text-sm">{name}</div>
    <div className="text-xs text-gray-600">{environment}</div>
    <div className="mt-2"><StatusIcon status={status} /></div>
    <div className="flex items-center mt-1 text-xs text-gray-500">
      <Tag size={12} className="mr-1" />
      {version}
    </div>
  </div>
);

export default PipelineStage;