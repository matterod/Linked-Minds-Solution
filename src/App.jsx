import React from 'react';
import './App.css';
import Globe from './components/Globe'; // Asegúrate de la ruta correcta

function App() {
  return (
    <div className="App">
      <div className="content-container">
        <h1>Linked Minds Solutions</h1>
        <button>Iniciar sesión</button>
      </div>
      <Globe />
    </div>
  );
}

export default App;
