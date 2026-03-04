import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const ADMIN_EMAIL = 'mateorodriguezz579@gmail.com';

const AdminPanel = ({ user }) => {
    const navigate = useNavigate();
    const [allUsers, setAllUsers] = useState(null);
    const [expandedUsers, setExpandedUsers] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || user.email !== ADMIN_EMAIL) return;

        const usersRef = ref(database, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const val = snapshot.val();
            setAllUsers(val || {});
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (!user) {
        return (
            <div className="admin-container">
                <div className="access-denied">
                    <span className="material-symbols-rounded">lock</span>
                    <h2>No Autenticado</h2>
                    <p>Iniciá sesión primero.</p>
                    <button className="admin-back-btn" onClick={() => navigate('/')}>
                        Ir al Inicio
                    </button>
                </div>
            </div>
        );
    }

    if (user.email !== ADMIN_EMAIL) {
        return (
            <div className="admin-container">
                <div className="access-denied">
                    <span className="material-symbols-rounded">shield</span>
                    <h2>Acceso Denegado</h2>
                    <p>No tenés permisos de administrador.</p>
                    <button className="admin-back-btn" onClick={() => navigate('/')}>
                        Volver
                    </button>
                </div>
            </div>
        );
    }

    const toggleExpand = (uid) => {
        setExpandedUsers(prev => ({ ...prev, [uid]: !prev[uid] }));
    };

    // --- Firebase Write Helpers ---
    const setLedStatus = (uid, value) => {
        set(ref(database, `users/${uid}/LedStatus`), String(value));
    };

    const setDeviceField = (uid, deviceId, field, value) => {
        set(ref(database, `users/${uid}/devices/${deviceId}/${field}`), value);
    };

    const getDeviceIcon = (type) => {
        if (type === 'pump') return 'water_drop';
        if (type === 'heater') return 'thermostat';
        return 'power';
    };

    const getInitials = (uid) => {
        return uid.substring(0, 2).toUpperCase();
    };

    return (
        <div className="admin-container">
            {/* Header */}
            <header className="admin-header">
                <div className="admin-header-left">
                    <div className="admin-logo">
                        <span className="material-symbols-rounded">admin_panel_settings</span>
                    </div>
                    <div className="admin-header-title">
                        <h1>Admin Panel</h1>
                        <div className="admin-badge">
                            <span className="material-symbols-rounded" style={{ fontSize: '12px' }}>verified</span>
                            Superadmin
                        </div>
                    </div>
                </div>
                <button className="admin-back-btn" onClick={() => navigate('/')}>
                    <span className="material-symbols-rounded" style={{ fontSize: '16px' }}>arrow_back</span>
                    Volver
                </button>
            </header>

            {/* Loading */}
            {loading && (
                <div className="admin-loading">
                    <div className="spinner-large"></div>
                    <span>Cargando usuarios...</span>
                </div>
            )}

            {/* No Users */}
            {!loading && (!allUsers || Object.keys(allUsers).length === 0) && (
                <div className="admin-empty">No hay usuarios en la base de datos.</div>
            )}

            {/* User Cards */}
            {!loading && allUsers && Object.entries(allUsers).map(([uid, userData]) => {
                const isExpanded = expandedUsers[uid];
                const devices = userData.devices || {};
                const system = userData.system || {};
                const ledStatus = userData.LedStatus;
                const tempCurrent = userData.TemperatureReadings?.current;

                return (
                    <div key={uid} className="admin-user-card">
                        {/* Collapsed Header */}
                        <div className="user-card-header" onClick={() => toggleExpand(uid)}>
                            <div className="user-card-info">
                                <div className="user-card-avatar">{getInitials(uid)}</div>
                                <div className="user-card-meta">
                                    <h3>Usuario</h3>
                                    <p>{uid}</p>
                                </div>
                            </div>
                            <span className={`material-symbols-rounded expand-icon ${isExpanded ? 'open' : ''}`}>
                                expand_more
                            </span>
                        </div>

                        {/* Expanded Body */}
                        {isExpanded && (
                            <div className="user-card-body">

                                {/* System Info */}
                                {(system.voltage !== undefined || system.backup !== undefined || system.ambient !== undefined) && (
                                    <div className="admin-section">
                                        <div className="admin-section-title">Sistema</div>
                                        <div className="admin-system-grid">
                                            {system.voltage !== undefined && (
                                                <div className="admin-stat">
                                                    <div className="admin-stat-label">Voltaje</div>
                                                    <div className="admin-stat-value">{system.voltage}V</div>
                                                </div>
                                            )}
                                            {system.backup !== undefined && (
                                                <div className="admin-stat">
                                                    <div className="admin-stat-label">Generador</div>
                                                    <div className="admin-stat-value">
                                                        {system.backup ? '🟢 ON' : '⚫ OFF'}
                                                    </div>
                                                </div>
                                            )}
                                            {system.ambient !== undefined && (
                                                <div className="admin-stat">
                                                    <div className="admin-stat-label">Ambiente</div>
                                                    <div className="admin-stat-value">{system.ambient}°C</div>
                                                </div>
                                            )}
                                            {tempCurrent !== undefined && (
                                                <div className="admin-stat">
                                                    <div className="admin-stat-label">Temp. Heater</div>
                                                    <div className="admin-stat-value">{tempCurrent}°C</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Legacy Heater */}
                                {ledStatus !== undefined && (
                                    <div className="admin-section">
                                        <div className="admin-section-title">Calentador Legacy</div>
                                        <div className="admin-legacy-row">
                                            <div className="admin-legacy-info">
                                                <div className="admin-legacy-icon">
                                                    <span className="material-symbols-rounded">thermostat</span>
                                                </div>
                                                <div>
                                                    <div className="admin-legacy-text">Heater #1</div>
                                                    <div className="admin-legacy-status">
                                                        LedStatus: <strong>{ledStatus}</strong>
                                                        {tempCurrent !== undefined && ` · ${tempCurrent}°C`}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="admin-actions">
                                                <button className="admin-btn activate" onClick={() => setLedStatus(uid, '1')}>
                                                    1 (ON)
                                                </button>
                                                <button className="admin-btn deactivate" onClick={() => setLedStatus(uid, '2')}>
                                                    2 (OFF)
                                                </button>
                                                <button className="admin-btn reset" onClick={() => setLedStatus(uid, '0')}>
                                                    0 (Reset)
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Devices */}
                                {Object.keys(devices).length > 0 && (
                                    <div className="admin-section">
                                        <div className="admin-section-title">Dispositivos</div>
                                        {Object.entries(devices).map(([devId, dev]) => (
                                            <div key={devId} className="admin-device-row">
                                                <div className="admin-device-info">
                                                    <div className={`admin-device-icon ${dev.type || 'generic'}`}>
                                                        <span className="material-symbols-rounded">
                                                            {getDeviceIcon(dev.type)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="admin-device-name">
                                                            {dev.name || devId}
                                                        </div>
                                                        <div className="admin-device-id">
                                                            {devId} · state:{dev.state ?? '?'} · ack:{dev.ack ?? '?'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="admin-actions">
                                                    <button
                                                        className={`admin-btn ${dev.state === 1 ? 'state-on' : 'state-off'}`}
                                                        onClick={() => setDeviceField(uid, devId, 'state', dev.state === 1 ? 0 : 1)}
                                                    >
                                                        State: {dev.state ?? 0}
                                                    </button>
                                                    <button
                                                        className={`admin-btn ${dev.ack === 1 ? 'state-on' : 'state-off'}`}
                                                        onClick={() => setDeviceField(uid, devId, 'ack', dev.ack === 1 ? 0 : 1)}
                                                    >
                                                        Ack: {dev.ack ?? 0}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* No data message */}
                                {Object.keys(devices).length === 0 && ledStatus === undefined && !system.voltage && (
                                    <div className="admin-empty" style={{ padding: '20px' }}>
                                        Este usuario no tiene dispositivos ni datos de sistema.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AdminPanel;
