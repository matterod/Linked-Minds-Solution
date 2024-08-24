import React, { useState } from 'react';
import './App.css';
import Auth from './components/Auth';
import ControlPanel from './components/ControlPanel';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LCDDisplay from './components/LCDDisplay';
import CircuitAnimation from './components/CircuitAnimation';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <div className="main-container">
              {/* Pantalla LCD con el título */}
              <LCDDisplay title="Linked Minds Solutions" />

              {/* Circuito animado */}
              <CircuitAnimation />

              {/* Componente de autenticación */}
              <Auth setUser={setUser} />
            </div>
          </div>
        } />
        <Route path="/panel/:uniqueId" element={
          <div className="App no-globe">
            <ControlPanel user={user} />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
