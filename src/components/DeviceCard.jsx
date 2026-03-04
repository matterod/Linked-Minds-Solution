import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../firebaseConfig';

const DeviceCard = ({ device, uid, isLegacy = false }) => {
    const [loading, setLoading] = useState(false);
    const [commandStatus, setCommandStatus] = useState('idle'); // 'idle' | 'sending' | 'success'
    const [heaterActive, setHeaterActive] = useState(false); // Tracks if the heater is logically ON

    // Destructure device props (normalize legacy vs dynamic)
    const name = device.name || 'Unknown Device';
    const type = device.type || 'generic';
    const state = device.state; // 1 or 2 (command in transit) or 0 (idle/acknowledged)
    const ack = device.ack;     // 1 (on) or 0 (off)
    const subtext = device.subtext || '';

    // Legacy Heater behavior:
    // - To turn ON:  send '1' → ESP32 processes and resets to '0'
    // - To turn OFF: send '2' → ESP32 processes and resets to '0'
    // When state goes back to '0' after sending, the command was acknowledged.
    useEffect(() => {
        if (isLegacy) {
            if (commandStatus === 'sending' && String(state) === '0') {
                // ESP32 acknowledged the command — flip the logical state
                setHeaterActive(prev => !prev);
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
            // If heater is OFF → send '1' to activate
            // If heater is ON  → send '2' to deactivate
            const command = heaterActive ? '2' : '1';
            set(ref(database, `users/${uid}/LedStatus`), command)
                .catch(() => setCommandStatus('idle'));
        } else {
            if (loading) return; // Block while pending ACK
            const newState = isOn ? 0 : 1;
            setLoading(true);
            set(ref(database, `users/${uid}/devices/${device.id}/state`), newState)
                .catch(() => setLoading(false));
        }
    };

    // Derive button label and colors for legacy heater
    const getLegacyButtonLabel = () => {
        if (commandStatus === 'sending') return 'Enviando...';
        if (commandStatus === 'success') return '¡Hecho!';
        return heaterActive ? 'Desactivar' : 'Activar';
    };

    const getLegacyButtonColor = () => {
        if (commandStatus === 'success') return '#10b981';  // green
        if (commandStatus === 'sending') return '#f59e0b';  // amber
        return heaterActive ? '#ef4444' : '#3b82f6';        // red when active, blue when inactive
    };

    const getLegacySubtext = () => {
        if (commandStatus === 'success') return heaterActive ? 'Calentador Encendido' : 'Calentador Apagado';
        if (commandStatus === 'sending') return 'Procesando...';
        return heaterActive ? 'Encendido' : 'Apagado';
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
                    <p>{subtext || (isLegacy ? getLegacySubtext() : (isOn ? 'Active' : 'Idle'))}</p>
                </div>
            </div>

            {isLegacy ? (
                <button
                    className={`pulse-button ${commandStatus === 'success' ? 'success' : ''} ${commandStatus === 'sending' ? 'sending' : ''} ${heaterActive ? 'active' : ''}`}
                    onClick={toggleDevice}
                    disabled={commandStatus !== 'idle'}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        border: 'none',
                        background: getLegacyButtonColor(),
                        color: 'white',
                        fontWeight: '600',
                        cursor: commandStatus === 'idle' ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        minWidth: '120px',
                        textAlign: 'center'
                    }}
                >
                    {getLegacyButtonLabel()}
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
