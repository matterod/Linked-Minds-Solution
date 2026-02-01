import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import DeviceCard from './DeviceCard';
import './Dashboard.css';
import { calculateBatteryPercentage } from '../utils/batteryCalculator';

// Material Symbols import (add this to index.html if not present, but for now we rely on user environment or substitute icons)
// For this environment, we'll assume text icons if font fails, but the CSS uses material icons classes.

const Dashboard = ({ user }) => {
    const [devices, setDevices] = useState({});
    const [legacyHeater, setLegacyHeater] = useState(null);
    const [temperature, setTemperature] = useState('--');

    // Initialize as null to hide by default
    const [systemData, setSystemData] = useState(null);
    const [batteryConfig, setBatteryConfig] = useState(null);
    const [batteryPercent, setBatteryPercent] = useState(0);

    useEffect(() => {
        if (!user) return;

        // 1. Listen to Dynamic Devices
        const devicesRef = ref(database, `users/${user.uid}/devices`);
        onValue(devicesRef, (snapshot) => {
            const val = snapshot.val();
            setDevices(val || {});
        });

        // 2. Listen to Legacy Heater (LedStatus)
        const heaterRef = ref(database, `users/${user.uid}/LedStatus`);
        onValue(heaterRef, (snapshot) => {
            setLegacyHeater(snapshot.val()); // "1" or "2"
        });

        // 3. Listen to Legacy Temperature
        const tempRef = ref(database, `users/${user.uid}/TemperatureReadings/current`);
        onValue(tempRef, (snapshot) => {
            const val = snapshot.val();
            setTemperature(typeof val === 'number' ? val.toFixed(1) : '--');
        });

        // 4. Listen to System Data (Optional)
        const systemRef = ref(database, `users/${user.uid}/system`);
        onValue(systemRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                setSystemData(data);
                if (data.batteryConfig) {
                    setBatteryConfig(data.batteryConfig);
                }
            } else {
                setSystemData(null);
            }
        });

    }, [user]);

    // Recalculate percent when voltage or config changes
    useEffect(() => {
        if (systemData && systemData.voltage) {
            // Default config if missing: Lead Acid, 24V (guessing based on previous mock)
            // Or safest is 12V Lead Acid default.
            const config = batteryConfig || { type: 'lead', nominal: 24 };
            const pct = calculateBatteryPercentage(parseFloat(systemData.voltage), config);
            setBatteryPercent(pct);
        }
    }, [systemData, batteryConfig]);

    if (!user) return <div className="dashboard-container">Loading...</div>;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-left">
                    <div className="logo-icon">
                        <span className="material-symbols-rounded">grid_view</span>
                    </div>
                    <div className="header-title">
                        <h1>Energy Hub</h1>
                        <div className="system-status">
                            <div className="status-dot"></div>
                            System Online
                        </div>
                    </div>
                </div>
                <div className="user-avatar">
                    <span className="material-symbols-rounded">person</span>
                </div>
            </header>

            {/* Energy Card - CONDITIONAL */}
            {systemData && systemData.voltage && (
                <div className="energy-card">
                    <div className="energy-header">
                        <span className="label-small">Storage System</span>
                        <span className="material-symbols-rounded battery-icon">battery_charging_full</span>
                    </div>
                    <div className="energy-value">{systemData.voltage}V</div>
                    <div className="energy-sub">
                        <span>State of Charge</span>
                        <span>{batteryPercent}%</span>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${batteryPercent}%` }}></div>
                    </div>
                </div>
            )}

            {/* Solar Pumps Section */}
            <div className="section-title">Solar Pumps</div>
            <div className="devices-list">
                {Object.entries(devices)
                    .filter(([_, dev]) => dev.type === 'pump')
                    .map(([key, dev]) => (
                        <DeviceCard
                            key={key}
                            uid={user.uid}
                            device={{ ...dev, id: key }}
                        />
                    ))}
                {/* Helper message if no pumps */}
                {Object.values(devices).filter(d => d.type === 'pump').length === 0 && (
                    <div style={{ color: '#9ca3af', fontSize: '12px', padding: '10px 0' }}>
                        No solar pumps detected.
                    </div>
                )}
            </div>

            {/* Heaters Section */}
            <div className="section-title">Heaters</div>
            <div className="devices-list">
                {/* Legacy Heater Card */}
                <DeviceCard
                    device={{
                        name: 'Heater #1',
                        type: 'heater',
                        state: legacyHeater, // "1" or "2"
                        subtext: `${temperature}°C`
                    }}
                    uid={user.uid}
                    isLegacy={true}
                />

                {/* Any dynamic Heaters could go here too */}
                {Object.entries(devices)
                    .filter(([_, dev]) => dev.type === 'heater')
                    .map(([key, dev]) => (
                        <DeviceCard
                            key={key}
                            uid={user.uid}
                            device={{ ...dev, id: key }}
                        />
                    ))}
            </div>

            {/* Generic Devices Section */}
            {Object.values(devices).some(d => d.type === 'generic') && (
                <>
                    <div className="section-title">Devices</div>
                    <div className="devices-list">
                        {Object.entries(devices)
                            .filter(([_, dev]) => dev.type === 'generic')
                            .map(([key, dev]) => (
                                <DeviceCard
                                    key={key}
                                    uid={user.uid}
                                    device={{ ...dev, id: key }}
                                />
                            ))}
                    </div>
                </>
            )}

            {/* Sensor Grid - CONDITIONAL */}
            {systemData && (systemData.backup || systemData.ambient) && (
                <div className="dual-grid">
                    {systemData.backup !== undefined && systemData.backup !== null && (
                        <div className={`stat-card ${systemData.backup ? 'warm' : ''}`}>
                            <div className="stat-icon" style={{ color: systemData.backup ? '#f59e0b' : '#9ca3af' }}>
                                <span className="material-symbols-rounded">bolt</span>
                            </div>
                            <div className="stat-label">Generador</div>
                            <div className="stat-value" style={{ fontSize: '18px' }}>
                                {systemData.backup ? 'ENCENDIDO' : 'APAGADO'}
                            </div>
                        </div>
                    )}

                    {systemData.ambient && (
                        <div className="stat-card warm">
                            <div className="stat-icon">
                                <span className="material-symbols-rounded">wb_sunny</span>
                            </div>
                            <div className="stat-label">Ambient</div>
                            <div className="stat-value">{systemData.ambient}°C</div>
                        </div>
                    )}
                </div>
            )}



            {/* Bottom Nav */}
            <div className="bottom-nav">
                <div className="nav-item active">
                    <span className="material-symbols-rounded">grid_view</span>
                </div>
                <div className="nav-item">
                    <span className="material-symbols-rounded">equalizer</span>
                </div>
                <div className="nav-item">
                    <span className="material-symbols-rounded">notifications</span>
                </div>
                <div className="nav-item">
                    <span className="material-symbols-rounded">settings</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
