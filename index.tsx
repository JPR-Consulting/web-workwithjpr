import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Steht schon ein vorgerenderter erster Bildschirm im Dokument, soll die H1 nach dem Mount
// sichtbar bleiben (kein erneutes Einblenden aus dem Verborgenen).
if (rootElement.firstElementChild) document.documentElement.dataset.shell = '1';

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
