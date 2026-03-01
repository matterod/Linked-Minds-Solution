import React, { useEffect, useState } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useParams } from 'react-router-dom';
import './ControlPanel.css';

function ControlPanel({ user }) {
  const { uniqueId } = useParams();
  const [temperature, setTemperature] = useState(null);
  const [ledStatus, setLedStatus] = useState(null);
  const [externalTemp, setExternalTemp] = useState(null);
  const [heaterCommandStatus, setHeaterCommandStatus] = useState('idle');


  // New State for Solar Pump
  const [pumpStatus, setPumpStatus] = useState(null); // null = not present/loading
  const [pumpAck, setPumpAck] = useState(null);
  const [hasPump, setHasPump] = useState(false);

  useEffect(() => {
    if (user) {
      // 1. Heating System Listeners (Legacy/Standard)
      const temperatureRef = ref(database, `users/${user.uid}/TemperatureReadings/current`);
      const ledStatusRef = ref(database, `users/${user.uid}/LedStatus`);

      onValue(temperatureRef, (snapshot) => {
        const temp = snapshot.val();
        if (typeof temp === 'number') {
          // Adjust for sensor offset if needed, or display raw
          setTemperature(temp.toFixed(1));
        } else {
          setTemperature('--');
        }
      });

      onValue(ledStatusRef, (snapshot) => {
        setLedStatus(snapshot.val());
      });

      // 2. Solar Pump Listener (Feature Flag)
      const pumpRef = ref(database, `users/${user.uid}/estadoBomba`);
      onValue(pumpRef, (snapshot) => {
        const val = snapshot.val();
        if (val !== null && val !== undefined) {
          setHasPump(true);
          setPumpStatus(val);
        } else {
          setHasPump(false);
        }
      });

      const ackRef = ref(database, `users/${user.uid}/ack`);
      onValue(ackRef, (snapshot) => {
        setPumpAck(snapshot.val());
      });

      // 3. External Weather API
      const apiKey = 'bd17fa752df5f5edf80f0860a2f5dc4d';
      const city = 'Tolhuin';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.main) {
            setExternalTemp(Math.round(data.main.temp));
          }
        })
        .catch(err => console.error('External Temp Error:', err));
    }
  }, [user]);

  useEffect(() => {
    // LedStatus: '1' sent by us to turn on, ESP32 resets it to '0'
    if (heaterCommandStatus === 'sending' && String(ledStatus) === '0') {
      setHeaterCommandStatus('success');
      setTimeout(() => setHeaterCommandStatus('idle'), 2500);
    }
  }, [ledStatus, heaterCommandStatus]);

  const triggerHeater = () => {
    if (!user || heaterCommandStatus !== 'idle') return;
    setHeaterCommandStatus('sending');
    set(ref(database, `users/${user.uid}/LedStatus`), '1').catch(() => {
      setHeaterCommandStatus('idle');
    });
  };

  const setPumpState = (status) => {
    if (!user || !hasPump) return;
    // Set command (1 or 0)
    set(ref(database, `users/${user.uid}/estadoBomba`), status);
  };

  if (!user) {
    return <div className="loading-screen">Cargando...</div>;
  }

  return (
    <div className="control-panel-container">
      <header className="panel-header">
        <h2 className="welcome-text">Hola, {user.displayName || 'Usuario'}</h2>
        <div className="connection-status">
          <span className={`status-indicator ${temperature !== '--' ? 'status-on' : 'status-off'}`}></span>
          {temperature !== '--' ? 'Sistema Conectado' : 'Desconectado'}
        </div>
      </header>

      <div className="device-grid">
        {/* Card 1: Heating Control (Cabin) */}
        <div className="device-card">
          <div className="card-title">
            🔥 Calefacción Cabaña
          </div>

          <div className="temp-display">
            <div className="temp-row">
              <span className="temp-label">Interior</span>
              <span className={`temp-value ${parseFloat(temperature) < 10 ? 'cold' : 'hot'}`}>
                {temperature}°C
              </span>
            </div>
            <div className="temp-row">
              <span className="temp-label">Exterior (Tolhuin)</span>
              <span className="temp-value cold">
                {externalTemp !== null ? `${externalTemp}°C` : '--'}
              </span>
            </div>
          </div>

          <div className="control-group" style={{ justifyContent: 'center' }}>
            <button
              className={`btn-control`}
              style={{
                width: '100%',
                maxWidth: '250px',
                background: heaterCommandStatus === 'success' ? '#10b981' : (heaterCommandStatus === 'sending' ? '#f59e0b' : '#3b82f6'),
                color: 'white',
                opacity: 1,
                border: 'none',
                transition: 'all 0.3s ease',
                cursor: heaterCommandStatus === 'idle' ? 'pointer' : 'default'
              }}
              disabled={heaterCommandStatus !== 'idle'}
              onClick={triggerHeater}
            >
              {heaterCommandStatus === 'idle' && 'Enviar Comando'}
              {heaterCommandStatus === 'sending' && 'Enviando...'}
              {heaterCommandStatus === 'success' && '¡Comando Recibido!'}
            </button>
          </div>
        </div>

        {/* Card 2: Solar Pump (Conditional) */}
        {hasPump && (
          <div className="device-card">
            <div className="card-title">
              💧 Bomba Solar
            </div>

            <div className="pump-toggle-container">
              <div className={`pump-status-text ${pumpStatus === 1 ? 'pump-active' : 'pump-inactive'}`}>
                {pumpStatus === 1 ? 'Bomba Prendida' : 'Bomba Apagada'}
              </div>

              <div className="pump-controls">
                <div className="pump-button-group">
                  <button
                    className={`btn-control btn-on`}
                    style={{ opacity: pumpStatus === 1 ? 1 : 0.5 }}
                    onClick={() => setPumpState(1)}
                  >
                    Activar
                  </button>
                  <div className={`status-led ${pumpStatus === 1 && pumpAck === 1 ? 'led-green' : ''}`}></div>
                </div>

                <div className="pump-button-group">
                  <button
                    className={`btn-control btn-off`}
                    style={{ opacity: pumpStatus === 0 ? 1 : 0.5 }}
                    onClick={() => setPumpState(0)}
                  >
                    Apagar
                  </button>
                  <div className={`status-led ${pumpStatus === 0 && pumpAck === 0 ? 'led-red' : ''}`}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ControlPanel;
