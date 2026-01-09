/*
 * ESP32 Solar Pump Controller - Linked Minds Solutions
 * 
 * Logic:
 * 1. Connects to WiFi & Firebase.
 * 2. Listens to 'users/{USER_ID}/estadoBomba'.
 * 3. IF 1: Turns ON Relay (Continuous) -> Writes 'ack=1' to Firebase.
 * 4. IF 0: Turns OFF Relay -> Writes 'ack=0' to Firebase.
 * 5. Includes Watchdog & Auto-Reconnect.
 */

#include <WiFi.h>
#include <FirebaseESP32.h>
#include <esp_task_wdt.h>

// --- USER CONFIGURATION ---
#define WIFI_SSID "TU_WIFI_SSID"
#define WIFI_PASSWORD "TU_WIFI_PASSWORD"

// Firebase Config
#define FIREBASE_HOST "esp32rinconada-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "TU_FIREBASE_SECRET_OR_TOKEN"

// Client Owner ID
#define USER_UID "USER_UID_DEL_CLIENTE"

// Pins
const int RELAY_PIN = 26; // Adjust pin as needed

// Objects
FirebaseData firebaseData;
FirebaseConfig firebaseConfig;
FirebaseAuth firebaseAuth;

void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Start OFF

  // 0. Watchdog Timer (10 Seconds timeout)
  esp_task_wdt_init(10, true);
  esp_task_wdt_add(NULL);

  // 1. Connect to WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    esp_task_wdt_reset(); // Keep dog alive during connect
  }
  Serial.println("\nWiFi Connected");
  Serial.println(WiFi.localIP());

  // 2. Firebase Init
  firebaseConfig.host = FIREBASE_HOST;
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_AUTH;
  firebaseConfig.timeout.serverResponse = 10 * 1000;

  Firebase.begin(&firebaseConfig, &firebaseAuth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  // 1. Feed the Watchdog
  esp_task_wdt_reset();

  // 2. Auto-Reconnect WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Lost. Reconnecting...");
    WiFi.reconnect();
    return;
  }

  // 3. Main Logic
  if (Firebase.ready()) {
    String commandPath = "/users/" + String(USER_UID) + "/estadoBomba";
    String ackPath = "/users/" + String(USER_UID) + "/ack";

    // Read Command
    if (Firebase.getInt(firebaseData, commandPath)) {
      int command = firebaseData.intData();
      
      // Read current Ack state to avoid loops/excessive writes
      int currentAck = -1;
      FirebaseData ackData;
      if (Firebase.getInt(ackData, ackPath)) {
        currentAck = ackData.intData();
      }

      if (command == 1) {
        // TURN ON
        digitalWrite(RELAY_PIN, HIGH);
        
        // Confirm execution if not already confirmed
        if (currentAck != 1) {
             Serial.println("Command: ON -> Setting Relay HIGH -> Sending Ack 1");
             if(Firebase.setInt(firebaseData, ackPath, 1)) {
                 Serial.println("Ack sent success");
             }
        } else {
             // Already On and Acked, do nothing (Steady State)
        }

      } else {
        // TURN OFF
        digitalWrite(RELAY_PIN, LOW); // Ensure OFF if 0 or anything else
        
        // Confirm execution if not already confirmed
        if (currentAck != 0) {
             Serial.println("Command: OFF -> Setting Relay LOW -> Sending Ack 0");
             if(Firebase.setInt(firebaseData, ackPath, 0)) {
                 Serial.println("Ack sent success");
             }
        }
      }

    } else {
      Serial.print("Read Error: ");
      Serial.println(firebaseData.errorReason());
    }
  } else {
    Serial.println("Firebase not ready...");
  }
  
  delay(500); // 500ms Cycle
}
