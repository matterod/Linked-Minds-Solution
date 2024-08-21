import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

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

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
