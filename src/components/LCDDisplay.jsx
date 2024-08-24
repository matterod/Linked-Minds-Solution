import React from 'react';
import './LCDDisplay.css'; // Archivo CSS para estilos específicos

const LCDDisplay = ({ title }) => {
  return (
    <div className="lcd-container">
      {/* Cable que conecta el LCD desde la parte inferior */}
      <div className="cable-lcd"></div>
      
      <div className="lcd-screen">
        {title.split('').map((letter, index) => (
          <span key={index} className={`lcd-text letter-${index}`}>
            {letter}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LCDDisplay;
