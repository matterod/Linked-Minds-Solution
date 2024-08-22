import React from 'react';
import './App.css';
import Globe from './components/Globe';

function App() {
  return (
    <div className="App">
      <Globe />
      <div className="content-container">
        <h1>Linked Minds Solutions</h1>
        <button>Iniciar sesión</button>
      </div>
    </div>
  );
}

export default App;
