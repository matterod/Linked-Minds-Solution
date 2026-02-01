import React, { useEffect, useState } from 'react';
import logo from '../assets/Logo.png';
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
      if (auth.currentUser) {
        navigate(`/panel/${auth.currentUser.uid}`);
      }
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
    <div className="login-container">
      <div className="login-content">
        <div className="logo-section">
          <div className="logo-wrapper">
            {/* Use the img tag if you have the file, or a placeholder icon if the file is missing/ugly. 
                    Based on the user screen, it's a purple molecule icon. 
                    We'll try to use the imported logo, assuming it matches the user's intent, 
                    or fallback to a nice icon if it fails visually (but we can't see that). 
                    Let's stick to the image provided. 
                */}
            <img src={logo} alt="Linked Mind" className="app-logo" />
          </div>
          <h1 className="app-title">Linked Mind</h1>
          <div className="title-underline"></div>
          <p className="app-subtitle">INDUSTRIAL ECOSYSTEM</p>
        </div>

        <div className="action-section">
          <button className="login-btn" onClick={handleLogin}>
            {isUserLoggedIn ? 'Ir al Panel' : 'Iniciar Sesión'}
            <span className="material-symbols-rounded">arrow_forward</span>
          </button>

          <div className="version-info">
            VERSION 2.0
          </div>

          <div className="footer-links">
            <span>Soporte</span>
            <span className="dot">•</span>
            <span>Privacidad</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCDDisplay;
