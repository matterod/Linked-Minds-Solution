import React from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';  // Asegúrate de que la ruta esté correcta

function Auth({ setUser }) {
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
        console.log("Sesión cerrada correctamente");
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
