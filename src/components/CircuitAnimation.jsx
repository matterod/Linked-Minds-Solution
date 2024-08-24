import React from 'react';
import './CircuitAnimation.css'; // Archivo CSS para estilos específicos

const CircuitAnimation = () => {
  return (
    <div className="circuit-container">
      <svg viewBox="0 0 200 100" className="circuit-svg">
        <line x1="0" y1="50" x2="200" y2="50" className="circuit-line" />
        {/* Añade más líneas o nodos aquí */}
      </svg>
    </div>
  );
};

export default CircuitAnimation;
