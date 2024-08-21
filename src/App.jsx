import React, { useState } from 'react';
import Auth from './components/Auth';
import ControlPanel from './components/ControlPanel';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <div id="login-container">
          <h1>Inicia sesión</h1>
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
