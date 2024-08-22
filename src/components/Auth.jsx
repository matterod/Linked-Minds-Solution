import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

function Auth({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        console.log('Usuario autenticado:', result.user.uid);
        navigate('/panel'); // Redirigir a la ruta del panel
      })
      .catch((error) => {
        console.error('Error en la autenticación:', error);
      });
  };

  return (
    <div className="auth-buttons">
      <button onClick={handleLogin}>Comenzar</button>
    </div>
  );
}

export default Auth;
