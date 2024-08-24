import React from 'react';
import './PowerButton.css'; // Archivo CSS para estilos específicos

const PowerButton = ({ onClick }) => {
  return (
    <button className="start-button" onClick={onClick}>
      Comenzar
    </button>
  );
};

export default PowerButton;
