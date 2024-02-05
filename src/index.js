import React from 'react';
import { createRoot } from 'react-dom/client'; // Import for React 18's new root API
import './index.css'; // Global styles for your app
import App from './App'; // Import the App component
import reportWebVitals from './reportWebVitals'; // Optional: For measuring performance

// Polyfills or other initializations can go here
// For example, if you need to polyfill 'Buffer' for use with Solana's web3.js in the browser:
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const container = document.getElementById('root'); // Get the root DOM element
const root = createRoot(container); // Create a root instance with the container

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: reportWebVitals can be used to log performance metrics
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
