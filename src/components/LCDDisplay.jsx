import React, { useEffect, useState } from 'react';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import './LCDDisplay.css';

const LCDDisplay = ({ title, setUser }) => {
  const navigate = useNavigate();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsUserLoggedIn(true);
      }
    });
  }, [setUser]);

  const handleLogin = () => {
    if (isUserLoggedIn) {
      // Si el usuario ya está autenticado, redirigir al panel directamente
      navigate(`/panel/${auth.currentUser.uid}`);
    } else {
      // Si el usuario no está autenticado, proceder con el inicio de sesión
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          setUser(user);

          // Revisar si ya existe un ID único en la base de datos
          const userRef = ref(database, `users/${user.uid}/uniqueId`);
          const snapshot = await get(userRef);

          let uniqueId;
          if (snapshot.exists()) {
            uniqueId = snapshot.val();
          } else {
            uniqueId = uuidv4();
            await set(userRef, uniqueId);
          }

          // Redirigir al panel con el uniqueId
          navigate(`/panel/${uniqueId}`);
        })
        .catch((error) => {
          console.error('Error en la autenticación:', error);
        });
    }
  };

  return (
    <div className="lcd-container">
      <div className="lcd-screen">
        <div className="lcd-text-container">
          {title.split('').map((letter, index) => (
            <span key={index} className={`lcd-text letter-${index}`}>
              {letter}
            </span>
          ))}
        </div>
        <div className="auth-container">
          <button className="start-button" onClick={handleLogin}>
            Comenzar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LCDDisplay;
