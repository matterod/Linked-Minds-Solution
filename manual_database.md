# Manual de Base de Datos y Configuración - Energy Hub

Este documento explica cómo configurar la base de datos de Firebase para agregar dispositivos, configurar baterías y ver el estado del generador en la aplicación web.

## Estructura General

Toda la información vive dentro de la carpeta de tu usuario (`users/{UID}`).

### 1. Baterías (Configuración)

Para que el porcentaje de batería sea exacto, debes especificar qué tipo de baterías tienes y su voltaje total.

**Ruta en DB:** `users/{UID}/system/batteryConfig`

| Campo     | Valores Posibles      | Descripción |
| :--- | :--- | :--- |
| `type` | `"lead"` o `"lifepo4"` | `"lead"` = Plomo-Ácido (Gel/AGM)<br>`"lifepo4"` = Litio (LFP/Li-ion) |
| `nominal` | `12`, `24`, `48` | El voltaje nominal de tu banco de baterías. |

**Ejemplo (Litio 24V):**
Crear carpeta `batteryConfig` dentro de `system` y agregar:
- `type`: "lifepo4"
- `nominal`: 24

> **Nota:** Si no creas esta configuración, el sistema asume por defecto **Plomo 12V**.

---

### 2. Generador / Backup

El generador aparece automáticamente en el panel si existe su dato de estado.

**Ruta en DB:** `users/{UID}/system/backup`

- **Valor `1`** (o `true`): Muestra **ENCENDIDO** (Icono Naranja).
- **Valor `0`** (o `false`): Muestra **APAGADO** (Icono Gris).
- **Borrar/Null**: La tarjeta desaparece de la pantalla.

---

### 3. Dispositivos (Bombas y Calefactores)

Los dispositivos que controlas (como bombas solares) viven en la carpeta `devices`.

**Ruta en DB:** `users/{UID}/devices/{DEVICE_ID}`

Para agregar un nuevo dispositivo, simplemente crea una carpeta con un ID único (ej. `bombaJardin`) y ponle estos datos:

| Campo | Valor | Descripción |
| :--- | :--- | :--- |
| `name` | "Bomba Jardín" | Nombre que se ve en la pantalla. |
| `type` | `"pump"`, `"heater"`, `"generic"` | `"pump"`=Gota, `"heater"`=Termómetro, `"generic"`=Botón Power |
| `state` | `0` o `1` | El estado deseado (0=Apagar, 1=Prender). |
| `ack` | `0` o `1` | Confirmación del dispositivo. |

**Ejemplo para agregar Dispositivo Genérico (Luces/Aspiradora):**
1. Ve a `users/{UID}/devices`.
2. Crea `lucesJardin`.
3. Adentro poné:
   - `name`: "Luces Jardín"
   - `type`: "generic"
   - `state`: 0
   - `ack`: 0

---

### 4. Sensores y Energía (Lectura)

Estos valores los escribe el ESP32 o se simulan manualmente:

- **Voltaje**: `users/{UID}/system/voltage` (Ej: `25.4`) -> Esto mueve la barra de carga.
- **Ambiente**: `users/{UID}/system/ambient` (Ej: `32`) -> Muestra la temperatura ambiente.

---
**Resumen de Rutas:**
- `.../system/batteryConfig` -> Configuración (Manual)
- `.../system/backup` -> Estado Generador (Auto/Manual)
- `.../system/voltage` -> Voltaje Baterías (Lectura)
- `.../devices/` -> Tus dispositivos controlables.
