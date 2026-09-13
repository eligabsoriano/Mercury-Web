import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallbackTitle="Critical Application Failure"
      fallbackMessage="Mercury executive command center encountered an unhandled startup anomaly. Please reload the dashboard or check backend connectivity."
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
