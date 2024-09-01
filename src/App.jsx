import React, { useState } from 'react';
import './App.css';
import ControlPanel from './components/ControlPanel';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LCDDisplay from './components/LCDDisplay';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <div className="App">
              <div className="main-container">
                <LCDDisplay title="Linked Minds Solutions" setUser={setUser} />
              </div>
            </div>
          } 
        />
        <Route 
          path="/panel/:uniqueId" 
          element={<ControlPanel user={user} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
