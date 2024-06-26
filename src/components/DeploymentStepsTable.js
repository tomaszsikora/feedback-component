import React from 'react';
import StatusIcon from './StatusIcon';

const DeploymentStepsTable = ({ steps, selectedStep, onStepClick }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left">Step</th>
          <th className="px-4 py-2 text-left">Started</th>
          <th className="px-4 py-2 text-left">Completed</th>
          <th className="px-4 py-2 text-left">Duration</th>
          <th className="px-4 py-2 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {steps.map((step, index) => (
          <tr 
            key={index} 
            className={`border-b border-gray-200 cursor-pointer ${selectedStep === index ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
            onClick={() => onStepClick(index)}
          >
            <td className="px-4 py-2 font-medium">{step.name}</td>
            <td className="px-4 py-2">{step.started || 'N/A'}</td>
            <td className="px-4 py-2">{step.completed || 'N/A'}</td>
            <td className="px-4 py-2">{step.duration || 'N/A'}</td>
            <td className="px-4 py-2">
              <div className="flex items-center">
                <StatusIcon status={step.status} />
                <span className="ml-2">{step.status}</span>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default DeploymentStepsTable;