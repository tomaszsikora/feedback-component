import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Pipeline from './components/Pipeline';
import PhaseDetails from './components/PhaseDetails';

const ArgoSyncViewWithPipelineDAG = () => {
  const [selectedStage, setSelectedStage] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: {
      Running: false,
      Succeeded: false,
      Failed: false,
      'Not Started': false,
      Canceled: false
    }
  });

  const pipelines = [
    {
      id: 1,
      name: 'Production',
      status: 'Succeeded',
      trigger: 'Manual',
      lastRun: '2023-06-25 10:30 AM',
      stages: [
        {
          id: 1,
          name: 'Build',
          status: 'Succeeded',
          environment: 'CI',
          version: 'v1.0.5',
          duration: '5m 30s',
          parallelGroup: 0,
          region: 'us-west-2'
        },
        {
          id: 2,
          name: 'Unit Tests',
          status: 'Succeeded',
          environment: 'CI',
          version: 'v1.0.5',
          duration: '3m 45s',
          parallelGroup: 1,
          region: 'us-west-2'
        },
        {
          id: 3,
          name: 'Integration Tests',
          status: 'Succeeded',
          environment: 'CI',
          version: 'v1.0.5',
          duration: '7m 20s',
          parallelGroup: 1,
          region: 'us-west-2'
        },
        {
          id: 4,
          name: 'Deploy to Production',
          status: 'Succeeded',
          environment: 'Production',
          version: 'v1.0.5',
          duration: '10m 15s',
          parallelGroup: 2,
          region: 'us-west-2'
        },
        {
          id: 5,
          name: 'Smoke Tests',
          status: 'Succeeded',
          environment: 'Production',
          version: 'v1.0.5',
          duration: '3m 45s',
          parallelGroup: 3,
          region: 'us-west-2'
        }
      ]
    },
    {
      id: 2,
      name: 'Staging',
      status: 'Running',
      trigger: 'Automatic',
      lastRun: '2023-06-25 11:45 AM',
      stages: [
        {
          id: 6,
          name: 'Build',
          status: 'Succeeded',
          environment: 'CI',
          version: 'v1.0.6',
          duration: '4m 50s',
          parallelGroup: 0,
          region: 'us-east-1'
        },
        {
          id: 7,
          name: 'Unit Tests',
          status: 'Succeeded',
          environment: 'CI',
          version: 'v1.0.6',
          duration: '3m 30s',
          parallelGroup: 1,
          region: 'us-east-1'
        },
        {
          id: 8,
          name: 'Integration Tests',
          status: 'Running',
          environment: 'CI',
          version: 'v1.0.6',
          duration: '6m 20s',
          parallelGroup: 1,
          region: 'us-east-1'
        },
        {
          id: 9,
          name: 'Deploy to Staging',
          status: 'Not Started',
          environment: 'Staging',
          version: 'v1.0.6',
          duration: 'N/A',
          parallelGroup: 2,
          region: 'us-east-1'
        }
      ]
    }
  ];

  const handleStageClick = (stageId) => {
    setSelectedStage(stageId === selectedStage ? null : stageId);
  };

  const handleFilterChange = (type, value, checked) => {
    if (type === 'search') {
      setFilters(prev => ({ ...prev, search: value }));
    } else if (type === 'status') {
      setFilters(prev => ({
        ...prev,
        status: { ...prev.status, [value]: checked }
      }));
    } else if (type === 'clear') {
      setFilters({
        search: '',
        status: Object.keys(filters.status).reduce((acc, key) => ({ ...acc, [key]: false }), {})
      });
    }
  };

  const filteredPipelines = useMemo(() => {
    return pipelines.filter(pipeline => {
      const searchMatch = pipeline.name.toLowerCase().includes(filters.search.toLowerCase());
      const statusFilterActive = Object.values(filters.status).some(v => v);
      const statusMatch = !statusFilterActive || filters.status[pipeline.status];
      return searchMatch && statusMatch;
    });
  }, [pipelines, filters]);

  const selectedStageDetails = useMemo(() => {
    for (const pipeline of pipelines) {
      const stage = pipeline.stages.find(s => s.id === selectedStage);
      if (stage) {
        return { ...stage, pipelineName: pipeline.name };
      }
    }
    return null;
  }, [pipelines, selectedStage]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar filters={filters} onFilterChange={handleFilterChange} />
        <div className="flex-1 p-4 overflow-auto bg-gray-50">
          <h1 className="text-2xl font-bold mb-6">Pipelines</h1>
          {filteredPipelines.map(pipeline => (
            <Pipeline 
              key={pipeline.id}
              pipeline={pipeline}
              onStageClick={handleStageClick}
              selectedStage={selectedStage}
            />
          ))}
          {selectedStageDetails && (
            <PhaseDetails 
              stage={selectedStageDetails}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ArgoSyncViewWithPipelineDAG;