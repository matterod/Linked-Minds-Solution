import React, { useState } from 'react';
import './App.css';
import Globe from './components/Globe';
import Auth from './components/Auth'; // Asegúrate de importar el componente Auth

function App() {
  const [user, setUser] = useState(null); // Estado para el usuario autenticado

  return (
    <div className="App">
      <div id="canvas-container">
        <Globe />
      </div>
      <div className="intro-container">
        <h1>Linked Minds Solutions</h1>
        {user ? (
          <p>Bienvenido, {user.displayName}</p> // Muestra el nombre del usuario autenticado
        ) : (
          <Auth setUser={setUser} /> // Muestra los botones de inicio de sesión si el usuario no está autenticado
        )}
      </div>
    </div>
  );
}

export default App;
