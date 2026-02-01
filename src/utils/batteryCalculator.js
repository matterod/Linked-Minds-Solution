/**
 * Calculate battery percentage based on voltage and chemistry.
 * 
 * @param {number} voltage - Current battery voltage (e.g., 25.6)
 * @param {object} config - Configuration object { type: 'lead' | 'lifepo4', nominal: 12 | 24 | 48 }
 * @returns {number} - Estimated percentage (0-100)
 */
export const calculateBatteryPercentage = (voltage, config) => {
    if (!voltage || !config) return 0;

    // Normalize voltage to 12V scale for simpler calculation tables
    // E.g. if 24V system, divide by 2. If 48V, divide by 4.
    const nominal = config.nominal || 12; // Default to 12V if missing
    const factor = nominal / 12;
    const v12 = voltage / factor; // Normalized 12V voltage

    const type = config.type || 'lead'; // Default to lead acid

    if (type === 'lifepo4') {
        // LiFePO4 Curve (Approximate for 12V pack - 4 cells)
        // 100% ~ 13.6V (Resting) - 14.6V (Charging)
        // 90%  ~ 13.4V
        // 70%  ~ 13.2V
        // 40%  ~ 13.1V
        // 20%  ~ 12.9V
        // 0%   ~ 10.0V (Cutoff)
        if (v12 >= 13.6) return 100;
        if (v12 >= 13.4) return 99; // Top end drops fast
        if (v12 >= 13.3) return 90;
        if (v12 >= 13.2) return 70;
        if (v12 >= 13.1) return 40;
        if (v12 >= 13.0) return 30;
        if (v12 >= 12.8) return 20;
        if (v12 >= 12.0) return 10; // Low knee
        return 0;
    }

    // Lead Acid Open Circuit Voltage (Approx)
    // 100% : 12.7V+
    // 90%  : 12.5V
    // 80%  : 12.42V
    // 70%  : 12.32V
    // 60%  : 12.20V
    // 50%  : 12.06V
    // 40%  : 11.9V
    // 30%  : 11.75V
    // 20%  : 11.58V
    // 10%  : 11.31V
    // 0%   : 10.5V
    else {
        if (v12 >= 12.7) return 100;
        if (v12 >= 12.5) return 90;
        if (v12 >= 12.42) return 80;
        if (v12 >= 12.32) return 70;
        if (v12 >= 12.20) return 60;
        if (v12 >= 12.06) return 50;
        if (v12 >= 11.90) return 40;
        if (v12 >= 11.75) return 30;
        if (v12 >= 11.58) return 20;
        if (v12 >= 11.31) return 10;
        return 0;
    }
};
