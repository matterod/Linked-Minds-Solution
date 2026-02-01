import React, { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../firebaseConfig';

const DeviceCard = ({ device, uid, isLegacy = false }) => {
    const [loading, setLoading] = useState(false);

    // Destructure device props (normalize legacy vs dynamic)
    const name = device.name || 'Unknown Device';
    const type = device.type || 'generic';
    const state = device.state; // 1 (on) or 0 (off)
    const ack = device.ack;     // 1 (on) or 0 (off)
    const subtext = device.subtext || '';

    // Determine if we are in a "sync" state
    // Legacy: 'LedStatus' uses "1"/"2" strings. Dynamic: 1/0 numbers.
    const isOn = isLegacy ? state === '1' : state === 1;
    const isAcked = isLegacy ? true : state === ack;

    // If not acked, we are "loading/pending"
    useEffect(() => {
        if (isAcked) {
            setLoading(false);
        }
    }, [ack, state, isLegacy, isAcked]);

    const toggleDevice = () => {
        if (loading) return; // Block while pending ACK

        const newState = isOn ? 0 : 1;
        setLoading(true);

        if (isLegacy) {
            // Legacy "LedStatus" uses '1' for ON, '2' for OFF
            const legacyVal = newState === 1 ? '1' : '2';
            set(ref(database, `users/${uid}/LedStatus`), legacyVal)
                .catch(() => setLoading(false));
        } else {
            // Dynamic Device
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
                    <p>{subtext || (isOn ? 'Active' : 'Idle')}</p>
                </div>
            </div>

            <div
                className={`toggle-switch ${isOn ? 'active' : ''} ${loading ? 'loading' : ''}`}
                onClick={toggleDevice}
            >
                <div className="toggle-knob">
                    {loading && !isLegacy && <div className="spinner"></div>}
                </div>
            </div>
        </div>
    );
};

export default DeviceCard;
