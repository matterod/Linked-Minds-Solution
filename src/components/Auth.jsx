import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { database } from '../firebaseConfig';
import { v4 as uuidv4 } from 'uuid'; // Usar uuid para generar ID únicos

function Auth({ setUser }) {
  const navigate = useNavigate();

  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        setUser(user);

        // Revisar si ya existe un ID único en la base de datos
        const userRef = ref(database, `users/${user.uid}/uniqueId`);
        const snapshot = await get(userRef);

        let uniqueId;
        if (snapshot.exists()) {
          uniqueId = snapshot.val(); // Si existe, usar el ID existente
        } else {
          uniqueId = uuidv4(); // Si no existe, generar un nuevo ID
          await set(userRef, uniqueId); // Guardar el nuevo ID en la base de datos
        }

        // Redirigir al panel con el uniqueId
        navigate(`/panel/${uniqueId}`);
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
