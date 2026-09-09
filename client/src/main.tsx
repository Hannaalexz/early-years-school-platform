import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.js';
import { AuthProvider } from './context/AuthContext.js';
import { SchoolProvider } from './context/SchoolContext.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SchoolProvider>
        <App />
      </SchoolProvider>
    </AuthProvider>
  </React.StrictMode>
);
