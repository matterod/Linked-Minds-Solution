import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import './ControlPanel.css';

function ControlPanel({ user }) {
  const { uniqueId } = useParams(); // Obtener el uniqueId desde la URL
  const [temperature, setTemperature] = useState(null);
  const [ledStatus, setLedStatus] = useState(null);
  const [externalTemp, setExternalTemp] = useState(null);

  useEffect(() => {
    if (user && uniqueId) {
      // Referencias a Firebase Database usando el uniqueId
      const temperatureRef = ref(database, `users/${user.uid}/TemperatureReadings/current`);
      onValue(temperatureRef, (snapshot) => {
        const temp = snapshot.val();
        if (typeof temp === 'number') {
          const ajustada = temp - 4;
          setTemperature(`${ajustada.toFixed(1)} °C`);
        } else {
          setTemperature('No hay datos');
        }
      });



      const ledStatusRef = ref(database, `users/${user.uid}/LedStatus`);
      onValue(ledStatusRef, (snapshot) => {
        setLedStatus(snapshot.val());
      });

      // Llamada a la API de OpenWeatherMap para obtener la temperatura de Tolhuin
      const apiKey = 'bd17fa752df5f5edf80f0860a2f5dc4d';
      const city = 'Tolhuin';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const ajustada = Math.round(data.main.temp - 2);
          setExternalTemp(`${ajustada} °C`);
        })
        .catch(err => console.error('Error fetching external temperature:', err));

    }
  }, [user, uniqueId]);

  const toggleLed = (status) => {
    const uid = user.uid;
    const ledStatusRef = ref(database, `users/${uid}/LedStatus`);
    set(ledStatusRef, status);
  };

  if (!user) {
    return <p>Inicia sesión para ver el panel de control.</p>;
  }

  return (
    <div className={`control-panel-container ${ledStatus === '2' ? 'off' : ''}`}>
      <h2 className={ledStatus === '2' ? 'off' : ''}>Bienvenido, {user.displayName}!</h2>
      <p className={`temperature-display ${ledStatus === '2' ? 'off' : ''}`}>
        Temperatura Interior: <span className="temperature-value">{temperature}</span>
      </p>
      <p className={`temperature-display ${ledStatus === '2' ? 'off' : ''}`}>
        Temperatura Exterior: <span className="temperature-value">{externalTemp}</span>
      </p>
      
      <button 
        className={`control-button ${ledStatus === '1' ? 'button-on' : 'off'}`}
        onClick={() => toggleLed('1')}
      >
        Encender
      </button>
      
      <button 
        className={`control-button ${ledStatus === '2' ? 'button-off' : 'off'}`}
        onClick={() => toggleLed('2')}
      >
        Apagar
      </button>
    </div>
  );
}

export default ControlPanel;
