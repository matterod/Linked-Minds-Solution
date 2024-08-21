import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebaseConfig';

function ControlPanel({ user }) {
  const [temperature, setTemperature] = useState(null);
  const [ledStatus, setLedStatus] = useState(null);

  useEffect(() => {
    if (user) {
      const uid = user.uid;

      // Referencia a la temperatura en Firebase
      const temperatureRef = ref(database, `users/${uid}/TemperatureReadings/current`);
      onValue(temperatureRef, (snapshot) => {
        const temp = snapshot.val();
        setTemperature(temp ? `${temp} °C` : 'No hay datos');
      });

      // Referencia al estado del LED en Firebase
      const ledStatusRef = ref(database, `users/${uid}/LedStatus`);
      onValue(ledStatusRef, (snapshot) => {
        setLedStatus(snapshot.val());
      });
    }
  }, [user]);

  const toggleLed = (status) => {
    const uid = user.uid;
    const ledStatusRef = ref(database, `users/${uid}/LedStatus`);
    set(ledStatusRef, status);
  };

  if (!user) {
    return <p>Inicia sesión para ver el panel de control.</p>;
  }

  return (
    <div>
      <p>Temperatura: {temperature}</p>
      <button onClick={() => toggleLed('1')}>
        {ledStatus === '1' ? 'Calentador Encendido' : 'Encender'}
      </button>
      <button onClick={() => toggleLed('2')}>
        {ledStatus === '2' ? 'Calentador Apagado' : 'Apagar'}
      </button>
    </div>
  );
}

export default ControlPanel;
