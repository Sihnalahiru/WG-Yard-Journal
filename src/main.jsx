import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');

function showBootError(message) {
  if (!rootElement) return;
  rootElement.innerHTML = `
    <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f8fafc;font-family:Arial,sans-serif">
      <section style="max-width:560px;width:100%;background:#fff;border:1px solid #fecaca;border-radius:20px;padding:24px;box-shadow:0 12px 30px #0f172a12">
        <h1 style="margin:0 0 10px;color:#991b1b;font-size:20px">WG Yard Journal could not start</h1>
        <p style="color:#475569;font-size:14px;line-height:1.6">A startup error occurred. Your saved journal data has not been cleared. Please copy the error below and share it for diagnosis.</p>
        <pre style="white-space:pre-wrap;overflow-wrap:anywhere;background:#f1f5f9;padding:12px;border-radius:10px;color:#991b1b;font-size:12px">${String(message || 'Unknown startup error').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}</pre>
        <button onclick="location.reload()" style="width:100%;padding:12px;border:0;border-radius:10px;background:#991b1b;color:#fff;font-weight:700">Reload App</button>
      </section>
    </main>`;
}

window.addEventListener('error', (event) => {
  showBootError(event.error?.stack || event.message || 'Uncaught browser error');
});

window.addEventListener('unhandledrejection', (event) => {
  showBootError(event.reason?.stack || event.reason?.message || event.reason || 'Unhandled promise rejection');
});

if (!rootElement) {
  showBootError('The HTML page does not contain an element with id="root".');
} else {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    showBootError(error?.stack || error?.message || error);
  }
}
