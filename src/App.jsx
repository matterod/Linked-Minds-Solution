import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="content-container">
        <h1>Linked Minds Solutions</h1>
        <button>Iniciar sesión</button>
      </div>
      <div className="giphy-container">
        <iframe 
          src="https://giphy.com/embed/U4FkC2VqpeNRHjTDQ5" 
          width="100%" 
          height="100%" 
          style={{ position: 'absolute', top: 0, left: 0 }} 
          frameBorder="0" 
          className="giphy-embed" 
          allowFullScreen>
        </iframe>
      </div>
    </div>
  );
}

export default App;
