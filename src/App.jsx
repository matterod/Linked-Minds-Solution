import React, { useState } from 'react';
import Auth from './components/Auth';
import ControlPanel from './components/ControlPanel';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <div id="welcome-container">
          <h1>Bienvenido a World Things Control</h1>
          <p>Con esta página, puedes controlar tus dispositivos IoT de forma remota y segura. Por favor, inicia sesión con Google para continuar.</p>
          <Auth setUser={setUser} />
        </div>
      ) : (
        <div id="control-container">
          <ControlPanel user={user} />
        </div>
      )}
    </div>
  );
}

export default App;
