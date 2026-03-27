import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 
import './index.css';
import { AuthProvider } from './App'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* You must wrap App here so useAuth works inside App */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);