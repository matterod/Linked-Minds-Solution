import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth'; // Solo importa lo que necesitas
import { auth, provider } from '../firebaseConfig'; // Trae los módulos desde tu archivo de configuración

function Auth({ setUser }) {
  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user); // Guarda el usuario autenticado
        console.log('Usuario autenticado:', result.user.uid);
      })
      .catch((error) => {
        console.error('Error en la autenticación:', error);
      });
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null); // Limpia el usuario al cerrar sesión
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
