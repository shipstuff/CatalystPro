import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element from our HTML template
const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

// Create React root and render the app
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 