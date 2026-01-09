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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsUserLoggedIn(true);
      }
    });
  }, [setUser]);

  const handleLogin = () => {
    if (isUserLoggedIn) {
      navigate(`/panel/${auth.currentUser.uid}`);
    } else {
      signInWithPopup(auth, provider)
        .then(async (result) => {
          const user = result.user;
          setUser(user);

          const userRef = ref(database, `users/${user.uid}/uniqueId`);
          const snapshot = await get(userRef);

          let uniqueId;
          if (snapshot.exists()) {
            uniqueId = snapshot.val();
          } else {
            uniqueId = uuidv4();
            await set(userRef, uniqueId);
          }

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
        <h1 className="lcd-title">{title}</h1>
        <div className="subtitle">IoT Control System</div>

        <div className="auth-container">
          <button className="start-button" onClick={handleLogin}>
            {isUserLoggedIn ? 'Ingresar al Panel' : 'Conectar con Google'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LCDDisplay;
