import React, { useState } from 'react';
import ArgoSyncViewWithPipelineDAG from './ArgoSyncViewWithPipelineDAG';
import FeedbackComponent from './FeedbackComponent';

function App() {
  return (
    <div className="App">
      <ArgoSyncViewWithPipelineDAG />
      <FeedbackComponent />
    </div>
  );
}

export default App;
