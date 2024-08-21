import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyANGLfDfRnsIfN3k-COWI22Y0bi8emK4Os",
  authDomain: "esp32rinconada.firebaseapp.com",
  databaseURL: "https://esp32rinconada-default-rtdb.firebaseio.com",
  projectId: "esp32rinconada",
  storageBucket: "esp32rinconada.appspot.com",
  messagingSenderId: "82707406557",
  appId: "1:82707406557:web:62f5993a30a39b7f130534",
  measurementId: "G-84QEWN29ZH"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const database = getDatabase(app);

export { app, auth, provider, database };
