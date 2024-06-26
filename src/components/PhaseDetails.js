import React, { useState, useMemo } from 'react';
import { StopCircle, RotateCcw } from 'lucide-react';
import DeploymentStepsTable from './DeploymentStepsTable';
import ResourceList from './ResourceList';
import StatusIcon from './StatusIcon';

const PhaseDetails = ({ stage }) => {
  const [selectedStep, setSelectedStep] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
  const [showDiff, setShowDiff] = useState(null);

  const isDeployStage = stage.name.toLowerCase().includes('deploy');

  const deploymentSteps = useMemo(() => {
    if (!isDeployStage) return [];

    let steps = [
      { name: 'Pre-deploy Job', status: 'Not Started', started: null, completed: null, duration: null, details: { jobName: 'Database Migration', status: 'Not Started' } },
      { name: 'Create Infrastructure', status: 'Not Started', started: null, completed: null, duration: null, details: { resources: [{ type: 'database', name: 'Redis Cluster', status: 'Not Started' }, { type: 'iam', name: 'IAM Role', status: 'Not Started' }] } },
      { name: 'Deploy Resources', status: 'Not Started', started: null, completed: null, duration: null, details: { resources: stage.resources || [] } },
      { name: 'Smoke Tests', status: 'Not Started', started: null, completed: null, duration: null, details: null },
      { name: 'Post-deploy Job', status: 'Not Started', started: null, completed: null, duration: null, details: { jobName: 'Cache Warm-up', status: 'Not Started' } },
    ];

    if (stage.status === 'Succeeded') {
      steps = steps.map(step => ({
        ...step,
        status: 'Completed',
        started: '2023-06-22 10:00:00',
        completed: '2023-06-22 10:10:00',
        duration: '10m 00s'
      }));
    } else if (stage.status === 'Running') {
      steps[0].status = 'Completed';
      steps[0].started = '2023-06-22 10:00:00';
      steps[0].completed = '2023-06-22 10:02:30';
      steps[0].duration = '2m 30s';
      steps[1].status = 'Running';
      steps[1].started = '2023-06-22 10:02:31';
    }

    return steps;
  }, [stage, isDeployStage]);

  const mockResources = [
    { kind: 'Deployment', name: 'frontend', status: 'Synced' },
    { kind: 'Service', name: 'frontend-svc', status: 'Synced' },
    { kind: 'ConfigMap', name: 'frontend-config', status: 'OutOfSync', diff: `
  configmap/frontend-config:
    1,5c1,5
    < apiVersion: v1
    < kind: ConfigMap
    < metadata:
    <   name: frontend-config
    <   namespace: default
    ---
    > apiVersion: v1
    > kind: ConfigMap
    > metadata:
    >   name: frontend-config
    >   namespace: production
    7c7
    <   API_URL: "http://api.example.com"
    ---
    >   API_URL: "https://api.production.example.com"
    ` },
    { kind: 'Secret', name: 'frontend-secrets', status: 'Synced' },
    { kind: 'Ingress', name: 'frontend-ingress', status: 'OutOfSync', diff: `
  ingress/frontend-ingress:
    10c10
    <     host: example.com
    ---
    >     host: www.example.com
    ` },
  ];

  if (!isDeployStage) {
    return (
      <div className="mt-4 bg-white border border-gray-300 rounded p-4">
        <h2 className="text-xl font-bold mb-2">{stage.name}</h2>
        <p className="text-gray-600">Detailed information for this stage type is not implemented.</p>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-600">
            Pipeline: {stage.pipelineName}
          </h3>
          <h3 className="font-semibold text-gray-600 mt-2">
            Version: {stage.version}
          </h3>
          <div className="mt-2">
            Status: <StatusIcon status={stage.status} /> {stage.status}
          </div>
          {stage.duration && (
            <div className="mt-2">
              Duration: {stage.duration}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white border border-gray-300 rounded">
      <div className="bg-gray-100 px-4 py-2 font-semibold border-b border-gray-300">
        DEPLOY DETAILS
      </div>
      <div className="p-4">
        <div className="flex border-b mb-4">
          <button className="py-2 px-4 border-b-2 border-blue-500 font-semibold">
            {stage.name} IN {stage.region ? stage.region.toUpperCase() : stage.environment.toUpperCase()}
          </button>
        </div>
        <div className="flex">
          <div className="w-1/2 pr-2">
            <h3 className="font-semibold text-gray-600 mb-2">Deployment Steps</h3>
            <DeploymentStepsTable 
              steps={deploymentSteps} 
              selectedStep={selectedStep} 
              onStepClick={setSelectedStep}
            />
          </div>
          <div className="w-1/2 pl-2">
            <h3 className="font-semibold text-gray-600 mb-2">Step Details</h3>
            <div className="border-b mb-4">
              <button 
                className={`py-2 px-4 ${activeTab === 'status' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                onClick={() => setActiveTab('status')}
              >
                Status
              </button>
              <button 
                className={`py-2 px-4 ${activeTab === 'results' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                onClick={() => setActiveTab('results')}
              >
                Detailed Results
              </button>
            </div>
            <div className="p-4 rounded bg-gray-50">
              {activeTab === 'status' && selectedStep !== null && (
                <>
                  <h4 className="font-semibold mb-2">{deploymentSteps[selectedStep].name}</h4>
                  <p>Execution Status: {deploymentSteps[selectedStep].status}</p>
                  <div className="mt-4 space-x-2">
                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                      <StopCircle className="inline-block mr-1" size={16} />
                      Stop
                    </button>
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                      <RotateCcw className="inline-block mr-1" size={16} />
                      Rollback
                    </button>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-semibold">Parameters:</h5>
                    <label className="flex items-center mt-2">
                      <input type="checkbox" className="mr-2" /> Force
                    </label>
                    <label className="flex items-center mt-2">
                      <input type="checkbox" className="mr-2" /> Re-create
                    </label>
                  </div>
                  {deploymentSteps[selectedStep].events && (
                    <div className="mt-4">
                      <h5 className="font-semibold">Events:</h5>
                      <pre className="mt-2 p-2 bg-gray-100 text-sm overflow-x-auto">
                        {deploymentSteps[selectedStep].events}
                      </pre>
                    </div>
                  )}
                </>
              )}
              {activeTab === 'results' && (
                <ResourceList 
                  resources={mockResources} 
                  showDiff={showDiff}
                  onToggleDiff={(index) => setShowDiff(showDiff === index ? null : index)}
                />
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold text-gray-600">
            Pipeline: {stage.pipelineName}
          </h3>
          <h3 className="font-semibold text-gray-600 mt-2">
            Version: {stage.version}
          </h3>
          <div className="mt-2">
            Overall Status: <StatusIcon status={stage.status} /> {stage.status}
          </div>
          {stage.duration && (
            <div className="mt-2">
              Duration: {stage.duration}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhaseDetails;