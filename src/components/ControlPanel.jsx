import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebaseConfig';

function ControlPanel({ user }) {
  const [temperature, setTemperature] = useState(null);
  const [ledStatus, setLedStatus] = useState(null);
  const [externalTemp, setExternalTemp] = useState(null);

  useEffect(() => {
    if (user) {
      const uid = user.uid;

      // Referencias a Firebase Database
      const temperatureRef = ref(database, `users/${uid}/TemperatureReadings/current`);
      onValue(temperatureRef, (snapshot) => {
        const temp = snapshot.val();
        setTemperature(temp ? `${temp} °C` : 'No hay datos');
      });

      const ledStatusRef = ref(database, `users/${uid}/LedStatus`);
      onValue(ledStatusRef, (snapshot) => {
        const status = snapshot.val();
        if (status !== ledStatus) {  // Solo actualiza si el estado es diferente
          setLedStatus(status);
        }
      });

      // Llamada a la API de OpenWeatherMap para obtener la temperatura de Tolhuin
      const apiKey = 'bd17fa752df5f5edf80f0860a2f5dc4d';
      const city = 'Tolhuin';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          const temp = data.main.temp;
          setExternalTemp(`${temp} °C`);
        })
        .catch(err => console.error('Error fetching external temperature:', err));
    }
  }, [user, ledStatus]);  // Dependencias para evitar renderizados innecesarios

  // Actualizamos el estado del LED en Firebase solo si hay un cambio real
  const toggleLed = (status) => {
    if (ledStatus !== status) {
      const uid = user.uid;
      const ledStatusRef = ref(database, `users/${uid}/LedStatus`);
      set(ledStatusRef, status);  // Cambiamos el estado en Firebase
    }
  };

  if (!user) {
    return <p>Inicia sesión para ver el panel de control.</p>;
  }

  return (
    <div className="control-panel-container">
      <h2>Bienvenido, {user.displayName}!</h2>
      <p className="temperature-display">Temperatura Interior: {temperature}</p>
      <p className="temperature-display">Temperatura Exterior: {externalTemp}</p>
      
      <button 
        className={`control-button ${ledStatus === '1' ? 'button-on' : ''}`}
        onClick={() => toggleLed('1')}  // Solo cambia al hacer clic
      >
        {ledStatus === '1' ? 'Calentador Encendido' : 'Encender'}
      </button>
      
      <button 
        className={`control-button ${ledStatus === '2' ? 'button-off' : ''}`}
        onClick={() => toggleLed('2')}  // Solo cambia al hacer clic
      >
        {ledStatus === '2' ? 'Calentador Apagado' : 'Apagar'}
      </button>
    </div>
  );
}

export default ControlPanel;
