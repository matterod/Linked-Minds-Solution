import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

function Auth({ setUser }) {
  const provider = new GoogleAuthProvider();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);
        console.log("Usuario autenticado con UID:", result.user.uid);
      })
      .catch((error) => {
        console.error("Error en la autenticación:", error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <div>
      <button onClick={handleLogin}>Iniciar sesión con Google</button>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

export default Auth;
