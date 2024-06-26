import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Settings, Clock, Play } from 'lucide-react';

const StageStatus = ({ status }) => {
  const colors = {
    Succeeded: 'bg-green-500',
    Running: 'bg-blue-500',
    'Not Started': 'bg-gray-300',
    Failed: 'bg-red-500'
  };

  return (
    <div className={`w-4 h-4 rounded-full ${colors[status] || 'bg-gray-500'}`}></div>
  );
};

const PipelineStage = ({ stage, onClick, isSelected }) => (
  <div 
    className={`flex flex-col items-center cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-70'} hover:opacity-100`}
    onClick={() => onClick(stage.id)}
  >
    <StageStatus status={stage.status} />
    <div className="text-xs mt-1 text-center">{stage.name}</div>
  </div>
);

const Pipeline = ({ pipeline, onStageClick, selectedStage }) => {
  const [expanded, setExpanded] = useState(true);

  // Group stages by their parallel execution groups
  const stageGroups = pipeline.stages.reduce((groups, stage) => {
    const group = stage.parallelGroup || 0;
    if (!groups[group]) groups[group] = [];
    groups[group].push(stage);
    return groups;
  }, {});

  return (
    <div className="mb-4 border rounded shadow-sm">
      <div 
        className="bg-gray-100 p-2 flex justify-between items-center cursor-pointer" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <StageStatus status={pipeline.status} />
          <span className="font-medium ml-2">{pipeline.name}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-1" />
          <span className="mr-4">Last run: {pipeline.lastRun}</span>
          <span className="mr-4">Trigger: {pipeline.trigger}</span>
          <button className="mr-2 p-1 rounded hover:bg-gray-200">
            <Play size={16} />
          </button>
          <button className="mr-2 p-1 rounded hover:bg-gray-200">
            <Settings size={16} />
          </button>
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>
      {expanded && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center">
            {Object.values(stageGroups).map((group, groupIndex) => (
              <React.Fragment key={groupIndex}>
                <div className="flex flex-col">
                  {group.map((stage, stageIndex) => (
                    <PipelineStage
                      key={stage.id}
                      stage={stage}
                      onClick={onStageClick}
                      isSelected={selectedStage === stage.id}
                    />
                  ))}
                </div>
                {groupIndex < Object.values(stageGroups).length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 mx-2 self-center"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;