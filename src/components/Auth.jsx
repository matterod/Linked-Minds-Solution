import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Auth({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        navigate('/panel');
      })
      .catch((error) => {
        console.error('Error en la autenticación:', error);
      });
  };

  return (
    <div className="main-container">
      <h2 className="main-title">Linked Minds Solutions</h2>
      <button className="start-button" onClick={handleLogin}>
        Comenzar
      </button>
    </div>
  );
}

export default Auth;
