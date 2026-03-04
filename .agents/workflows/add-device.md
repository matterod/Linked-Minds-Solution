---
description: How to add a new ESP32 device type to the system
---

# Add a New Device Type

1. **Define the device in Firebase RTDB** at `users/{uid}/devices/{newDeviceId}`:
   - `name`: Human readable name (e.g., "Luces Jardín")
   - `type`: Must be one of `pump`, `heater`, or `generic` (or add new type to RTDB rules)
   - `state`: `0` (starts OFF)
   - `ack`: `0` (no confirmation yet)

2. **If adding a new device type** (beyond pump/heater/generic):
   - Update RTDB security rules to allow the new type in the `.validate` rule
   - Update `DeviceCard.jsx` icon mapping in the `IconType` component
   - Update `Dashboard.jsx` to add a section for the new type

3. **Flash the ESP32** with the firmware:
   - Copy `ESP32_Bomba.ino` as a template
   - Change `DEVICE_ID`, `DEVICE_NAME`, and `USER_UID`
   - Set real WiFi and Firebase credentials (never commit these!)
   - Upload via Arduino IDE or PlatformIO

4. **Reference**: See `/docs/manual_database.md` for the full database schema.
