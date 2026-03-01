import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../firebaseConfig';

const DeviceCard = ({ device, uid, isLegacy = false }) => {
    const [loading, setLoading] = useState(false);
    const [commandStatus, setCommandStatus] = useState('idle'); // 'idle' | 'sending' | 'success'

    // Destructure device props (normalize legacy vs dynamic)
    const name = device.name || 'Unknown Device';
    const type = device.type || 'generic';
    const state = device.state; // 1 (on) or 0 (off)
    const ack = device.ack;     // 1 (on) or 0 (off)
    const subtext = device.subtext || '';

    // Legacy Heater behavior (Pulse button)
    // Send "1" to turn on, ESP32 resets it to "0"
    useEffect(() => {
        if (isLegacy) {
            if (commandStatus === 'sending' && String(state) === '0') {
                setCommandStatus('success');
                setTimeout(() => setCommandStatus('idle'), 2500);
            }
        }
    }, [state, isLegacy, commandStatus]);

    // Determine if we are in a "sync" state for normal devices
    const isOn = isLegacy ? false : state === 1;
    const isAcked = isLegacy ? true : state === ack;

    // If not acked, we are "loading/pending"
    useEffect(() => {
        if (!isLegacy && isAcked) {
            setLoading(false);
        }
    }, [ack, state, isLegacy, isAcked]);

    const toggleDevice = () => {
        if (isLegacy) {
            if (commandStatus !== 'idle') return;
            setCommandStatus('sending');
            set(ref(database, `users/${uid}/LedStatus`), '1')
                .catch(() => setCommandStatus('idle'));
        } else {
            if (loading) return; // Block while pending ACK
            const newState = isOn ? 0 : 1;
            setLoading(true);
            set(ref(database, `users/${uid}/devices/${device.id}/state`), newState)
                .catch(() => setLoading(false));
        }
    };

    const IconType = () => {
        if (type === 'heater') return <span className="material-symbols-rounded">thermostat</span>;
        if (type === 'pump') return <span className="material-symbols-rounded">water_drop</span>;
        return <span className="material-symbols-rounded">power</span>;
    };

    return (
        <div className={`device-card`}>
            <div className="device-info">
                <div className={`device-icon ${type === 'heater' ? 'heater' : ''}`}>
                    <IconType />
                </div>
                <div className="device-text">
                    <h3>{name}</h3>
                    <p>{subtext || (isLegacy ? (commandStatus === 'success' ? 'Comando Recibido' : 'Listo') : (isOn ? 'Active' : 'Idle'))}</p>
                </div>
            </div>

            {isLegacy ? (
                <button
                    className={`pulse-button ${commandStatus === 'success' ? 'success' : ''} ${commandStatus === 'sending' ? 'sending' : ''}`}
                    onClick={toggleDevice}
                    disabled={commandStatus !== 'idle'}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        background: commandStatus === 'success' ? '#10b981' : (commandStatus === 'sending' ? '#f59e0b' : '#3b82f6'),
                        color: 'white',
                        fontWeight: '600',
                        cursor: commandStatus === 'idle' ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        minWidth: '100px',
                        textAlign: 'center'
                    }}
                >
                    {commandStatus === 'idle' && 'Activar'}
                    {commandStatus === 'sending' && 'Enviando...'}
                    {commandStatus === 'success' && '¡Hecho!'}
                </button>
            ) : (
                <div
                    className={`toggle-switch ${isOn ? 'active' : ''} ${loading ? 'loading' : ''}`}
                    onClick={toggleDevice}
                >
                    <div className="toggle-knob">
                        {loading && <div className="spinner"></div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceCard;
