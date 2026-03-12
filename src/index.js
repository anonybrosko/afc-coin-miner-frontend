import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';
import { GameProvider } from './GameProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GameProvider>
    <App />
  </GameProvider>
);
