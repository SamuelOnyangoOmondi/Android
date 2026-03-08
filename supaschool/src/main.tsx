
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// For detailed debugging
console.log("React version:", React.version);
// The client version of ReactDOM doesn't expose version in its types
// We'll remove this log or use a different approach
console.log("Main.tsx is executing");

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Root element not found");
  } else {
    console.log("Root element found, creating React root");
    
    // Basic rendering approach - simplest possible to rule out issues
    ReactDOM.createRoot(rootElement).render(<App />);
    
    console.log("React rendering completed");
  }
} catch (error) {
  console.error("Error during React initialization:", error);
}
