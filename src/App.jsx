import React, { useState } from 'react';
import './App.css';
import Globe from './components/Globe';
import Auth from './components/Auth'; 
import ControlPanel from './components/ControlPanel';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function Home({ setUser }) {
  return (
    <div className="intro-container">
      <h1>Linked Minds Solutions</h1>
      <Auth setUser={setUser} />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Ruta para la página de inicio con el Globe */}
        <Route path="/" element={
          <div className="App">
            <div id="canvas-container">
              <Globe />
            </div>
            <Home setUser={setUser} />
          </div>
        } />

        {/* Ruta para el panel sin el Globe */}
        <Route path="/panel" element={
          <div className="App no-globe">
            <ControlPanel user={user} />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
