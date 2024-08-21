import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebaseConfig';

// Usa `db` en tu componente


function ControlPanel({ user }) {
  const [temperature, setTemperature] = useState(null);
  const [ledStatus, setLedStatus] = useState(null);

  useEffect(() => {
    if (user) {
      const uid = user.uid;

      const temperatureRef = ref(db, `users/${uid}/TemperatureReadings/current`);
      const ledStatusRef = ref(db, `users/${uid}/LedStatus`);

      onValue(temperatureRef, (snapshot) => {
        setTemperature(snapshot.val() || "No hay datos");
      });

      onValue(ledStatusRef, (snapshot) => {
        setLedStatus(snapshot.val());
      });
    }
  }, [user]);

  const handleTurnOn = () => {
    if (user) {
      set(ref(db, `users/${user.uid}/LedStatus`), "1");
    }
  };

  const handleTurnOff = () => {
    if (user) {
      set(ref(db, `users/${user.uid}/LedStatus`), "2");
    }
  };

  return (
    <div>
      <h1>Bienvenido, {user.displayName}</h1>
      <p>Temperatura: {temperature} °C</p>
      <div id="button-container1">
        <button onClick={handleTurnOn} className={ledStatus === "1" ? "on" : "off"}>
          {ledStatus === "1" ? "Calentador Encendido" : "Encender"}
        </button>
        <button onClick={handleTurnOff} className={ledStatus === "2" ? "on" : "off"}>
          {ledStatus === "2" ? "Calentador Apagado" : "Apagar"}
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
