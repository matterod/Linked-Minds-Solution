import React from 'react';
import './App.css';
import Globe from './components/Globe';

function App() {
  return (
    <div className="App">
      <div id="canvas-container">
        <Globe />
      </div>
      <div className="intro-container">
        <h1>Linked Minds Solutions</h1>
        <button>Iniciar sesión</button>
      </div>
    </div>
  );
}

export default App;
