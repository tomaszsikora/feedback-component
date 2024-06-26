import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'Completed':
    case 'Succeeded':
    case 'Synced':
      return <CheckCircle className="text-green-500" />;
    case 'Failed':
    case 'OutOfSync':
      return <XCircle className="text-red-500" />;
    case 'Running':
    case 'InProgress':
      return <Clock className="text-blue-500 animate-spin" />;
    case 'NotStarted':
    case 'Pending':
      return <AlertCircle className="text-gray-300" />;
    default:
      return <AlertCircle className="text-gray-500" />;
  }
};

export default StatusIcon;