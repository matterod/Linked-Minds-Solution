import React, { useState } from 'react';
import './App.css';
import Auth from './components/Auth';
import ControlPanel from './components/ControlPanel';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <Auth setUser={setUser} />
          </div>
        } />
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
