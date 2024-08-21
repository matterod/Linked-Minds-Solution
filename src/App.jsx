import React, { useState } from 'react';
import Auth from './components/Auth';
import ControlPanel from './components/ControlPanel';
import './App.css'; // Asegúrate de definir tus estilos aquí.

function App() {
  const [user, setUser] = useState(null);
  const [introVisible, setIntroVisible] = useState(true);

  const handleStart = () => {
    setIntroVisible(false); // Ocultar la introducción y mostrar la autenticación
  };

  return (
    <div className="App">
      {introVisible ? (
        <div className="intro-container">
          <h1>Bienvenido a Linked Minds Solutions</h1>
          <p>Nos especializamos en soluciones IoT innovadoras para conectar el mundo de manera eficiente.</p>
          <button onClick={handleStart}>Comenzar</button>
        </div>
      ) : (
        <div>
          <Auth setUser={setUser} />
          <ControlPanel user={user} />
        </div>
      )}
    </div>
  );
}

export default App;
