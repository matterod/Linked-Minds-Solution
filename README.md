# Control de ESP32 y Calefacción Remota con LoRa

Este proyecto consiste en una página web que permite controlar múltiples ESP32 con distintas funciones, a través de comunicación **LoRa**, especialmente diseñada para aplicaciones en zonas rurales sin acceso a Internet. La página es sencilla, intuitiva y ofrece la posibilidad de manejar dispositivos remotos, como la calefacción de una cabaña en el campo, desde cualquier parte del mundo.

## Funcionalidades Principales

- **Control de calefacción remota**: Un ESP32 está ubicado en una zona rural sin acceso a Internet, conectado a la calefacción de una cabaña. La página permite controlar la temperatura de esta cabaña en tiempo real desde cualquier lugar del mundo. Esto es especialmente útil en **zonas frías** como **Tierra del Fuego**, donde las temperaturas invernales pueden llegar a bajo cero y hay nevadas frecuentes.
  
- **Comunicación LoRa**: El sistema se compone de dos ESP32:
  1. **ESP32 con conexión a Internet y LoRa**: Envía las órdenes a través de LoRa.
  2. **ESP32 remoto**: Está en la zona rural, recibe las órdenes y controla la calefacción o cualquier otro dispositivo conectado.

- **Control de varios dispositivos**: Además de la calefacción, la página tiene la capacidad de controlar **sensores** y **dispositivos** mediante **radiofrecuencia**, lo que permite una amplia gama de aplicaciones, como el monitoreo de condiciones ambientales o la activación de otros aparatos electrónicos.

- **Sistema de autenticación**: Cada ESP32 está asociado a una dirección de correo electrónico específica, de modo que **solo el dueño** de cada dispositivo puede acceder a su información y controlarlo.

## Simplicidad del Diseño

La página ha sido diseñada con la **simplicidad** en mente. A pesar de controlar múltiples dispositivos y tener una infraestructura robusta con LoRa y ESP32, la interfaz es extremadamente fácil de usar. El objetivo es que cualquier persona, sin importar su nivel técnico, pueda:

- **Controlar la calefacción o cualquier dispositivo** sin configuraciones complicadas.
- Tener una experiencia fluida y directa, con botones simples para encender o apagar dispositivos y ajustar la temperatura.

## Casos de Uso

- **Control de calefacción en cabañas de zonas rurales**: Ideal para lugares remotos sin conexión estable a Internet.
- **Monitoreo y control de sensores**: Permite la conexión de múltiples sensores en zonas rurales para medir temperatura, humedad, o cualquier otra condición.
- **Control de dispositivos por radiofrecuencia**: Desde luces hasta electrodomésticos, todos controlados remotamente.

## ¿Por qué es tan sencilla?

La clave del éxito de esta página es su **minimalismo**. Hemos optado por eliminar cualquier complicación innecesaria, centrándonos en que la funcionalidad sea **directa y eficiente**. El sistema está pensado para que el usuario tenga control total desde una interfaz limpia y clara, permitiéndole gestionar sus dispositivos sin dificultades técnicas.

---

Este proyecto es ideal para personas que necesitan controlar dispositivos remotos en lugares sin acceso a Internet, y que buscan una solución confiable, simple y eficiente para manejar dispositivos de manera remota y segura.
