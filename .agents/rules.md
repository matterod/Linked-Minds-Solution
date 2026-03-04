# Linked Minds Solutions - Project Context & Rules

## Project Overview
This is an **IoT web application** built with **React + Vite + TailwindCSS** that connects to **ESP32 microcontrollers** deployed in remote locations (rural areas, cabins, farms). Each ESP32 device communicates with **Firebase Realtime Database** to control physical equipment like water pumps, heaters, generators, and lights.

## Architecture
- **Frontend**: React SPA (Vite + TailwindCSS), hosted on Firebase Hosting
- **Backend**: Firebase Realtime Database (no server)
- **IoT Devices**: ESP32 microcontrollers using `FirebaseESP32` library
- **Auth**: Firebase Authentication with Google Sign-In
- **Data Flow**: Web App ↔ Firebase RTDB ↔ ESP32

## Tech Stack
- React 18+ with functional components and hooks
- Vite as bundler
- TailwindCSS for styling
- Firebase v9+ (modular SDK)
- React Router for navigation
- ESP32 Arduino (C++) for IoT firmware

## Important Rules

### Language & Style
- UI text and comments should be in **Spanish** (this app serves Spanish-speaking users in Argentina)
- Variable names and code should be in **English**
- Use functional React components and hooks (no class components)

### Firebase Database Structure
- All user data lives under `/users/{uid}/`
- Devices are at `/users/{uid}/devices/{deviceId}/`
- System data (voltage, battery, backup) at `/users/{uid}/system/`
- Legacy fields (`LedStatus`, `TemperatureReadings`) exist at user root for backward compatibility
- **ALWAYS** refer to `/docs/manual_database.md` for the full database schema

### Security — CRITICAL
- **NEVER** hardcode API keys, tokens, or secrets in source code
- All secrets MUST go in `.env` using `VITE_` prefix for Vite
- Reference secrets via `import.meta.env.VITE_*`
- The `.env` file is gitignored — only `.env.example` is committed
- The ESP32 `.ino` file uses placeholder values (e.g., `TU_FIREBASE_SECRET_OR_TOKEN`) — never replace with real values in the repo
- Firebase API keys in client code are semi-public by design, but should still use env vars

### ESP32 / IoT Patterns
- ESP32 devices authenticate using Firebase legacy tokens (bypasses RTDB rules)
- Device operational fields (`state`, `ack`, `lastConnection`) have `.write: true` in RTDB rules for ESP32 access
- Configuration fields (`name`, `type`) are only writable by the authenticated user
- The `ack` field confirms the ESP32 executed a command (1 = done, 0 = idle)
- Device types: `pump`, `heater`, `generic`

### State Management
- The `state` field is the **desired** state (set by user)
- The `ack` field is the **confirmed** state (set by ESP32)
- When `state !== ack`, the UI shows a loading/pending indicator
- Legacy heater uses a pulse pattern: user sets `LedStatus` to `"1"`, ESP32 resets to `"0"`

### Production Considerations
- This app has paying customers — **never make breaking changes** without confirming
- Always maintain backward compatibility with legacy fields
- Test RTDB rule changes carefully — the admin UID has special access
- The admin UID is hardcoded in RTDB rules (not in source code)

### File Organization
- `/src/firebaseConfig.js` — Firebase initialization (uses env vars)
- `/src/components/Dashboard.jsx` — Main device dashboard
- `/src/components/DeviceCard.jsx` — Reusable device toggle card
- `/src/components/ControlPanel.jsx` — Legacy control panel (older UI)
- `/src/components/LCDDisplay.jsx` — Landing page / login
- `/src/utils/batteryCalculator.js` — Battery percentage from voltage
- `/docs/manual_database.md` — Database schema documentation
- `/ESP32_Bomba.ino` — ESP32 pump controller firmware (template)
