import React, { useEffect, useState } from 'react';
import logo from '../assets/Logo.png';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { auth, provider, database } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import './LCDDisplay.css';

const LCDDisplay = ({ title, setUser }) => {
  const navigate = useNavigate();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsUserLoggedIn(true);
      }
    });
  }, [setUser]);

  // Initial Theme Check and Toggle logic
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

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
    <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 transition-colors duration-300 font-display w-full min-h-screen">
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="material-icons-round text-white">grid_view</span>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight">Control <span className="text-primary">Hub</span></span>
              <div className="flex items-center space-x-1.5 leading-none mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">System Online</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600 dark:text-slate-400">
            <a className="hover:text-primary transition-colors" href="#features">Características</a>
            <a className="hover:text-primary transition-colors" href="#energy">Energía Solar</a>
            <a className="hover:text-primary transition-colors" href="#devices">Dispositivos</a>
            <button
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:scale-110 transition-transform"
              onClick={toggleTheme}
            >
              {darkMode ? (
                <span className="material-icons-round text-sm">light_mode</span>
              ) : (
                <span className="material-icons-round text-sm">dark_mode</span>
              )}
            </button>
            <button
              onClick={handleLogin}
              className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-full shadow-lg shadow-primary/25 transition-all active:scale-95"
            >
              {isUserLoggedIn ? 'Ir al Panel' : 'Iniciar Sesión'}
            </button>
          </div>
        </div>
      </nav>

      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="material-icons-round text-sm">bolt</span>
              <span>Automatización inteligente</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Controla lo que quieras, <span className="text-primary">donde quieras.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Gestiona bombas solares, sistemas de calefacción y circuitos de energía desde una interfaz accesible desde cualquier lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLogin}
                className="bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center space-x-3 transition-all transform hover:-translate-y-1"
              >
                <span className="font-bold text-lg">{isUserLoggedIn ? 'Ir al Panel de Control' : 'Iniciar Sesión'}</span>
                <span className="material-icons-round">arrow_forward</span>
              </button>
              <a className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-8 py-4 rounded-2xl flex items-center justify-center space-x-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all" href="#features">
                <span className="font-bold text-lg">Ver Demo</span>
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="relative z-10 bg-card-light dark:bg-card-dark p-6 rounded-[2rem] shadow-2xl border border-slate-200/50 dark:border-slate-700/50 transform rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                    <span className="material-icons-round text-primary text-sm">analytics</span>
                  </div>
                  <span className="font-bold text-slate-400 text-xs uppercase tracking-widest">Storage System</span>
                </div>
                <span className="material-icons-round text-primary">battery_charging_full</span>
              </div>
              <div className="mb-10">
                <div className="text-6xl font-extrabold text-slate-900 dark:text-white mb-4">26.4V</div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">State of Charge</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">100%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-full rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center text-primary">
                      <span className="material-icons-round">water_drop</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm">Bomba Cerca</div>
                      <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider">• Offline (211m)</div>
                    </div>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 bg-primary/10 border border-primary/20 rounded-2xl">
                  <span className="material-icons-round text-amber-500 mb-2">bolt</span>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Generador</div>
                  <div className="text-xl font-extrabold text-primary">ENCENDIDO</div>
                </div>
              </div>
            </div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </header>

      <section className="py-24 bg-white dark:bg-slate-900/50" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ecosistema Conectado</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Diseñado para entornos rurales y urbanos que requieren un monitoreo constante y fiable de sus recursos energéticos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all group">
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-primary text-3xl">solar_power</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Gestión Solar</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Visualiza el rendimiento de tus paneles en tiempo real y gestiona el excedente de energía de forma inteligente.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all group">
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-primary text-3xl">thermostat</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Climatización Smart</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Controla calefactores y sistemas de refrigeración basándote en la temperatura ambiente y la disponibilidad eléctrica.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all group">
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-primary text-3xl">sensors</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Sensores LoraWAN</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Conectividad de largo alcance para dispositivos remotos, como bombas de agua en perímetros lejanos.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all group">
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-primary text-3xl">system_update</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Actualizaciones OTA</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Tus dispositivos ESP32 se mantienen siempre al día con actualizaciones automáticas sin cables.
              </p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all group">
              <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-md mb-6 group-hover:scale-110 transition-transform">
                <span className="material-icons-round text-primary text-3xl">rule</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Reglas Inteligentes</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Próximamente: Configura temporizadores y condiciones. "Si la batería baja del 20%, apagar luces".
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 overflow-hidden" id="devices">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
                  </pattern>
                </defs>
                <rect fill="url(#grid)" height="100%" width="100%"></rect>
              </svg>
            </div>
            <div className="relative z-10 lg:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Toma el control total desde cualquier lugar.</h2>
              <p className="text-blue-100 text-lg">
                La app está optimizada para escritorio y dispositivos móviles, permitientedote encender luces, bombas o generadores con un solo toque.
              </p>
              <div className="pt-6">
                <button
                  onClick={handleLogin}
                  className="bg-white text-primary px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-colors shadow-2xl"
                >
                  Empieza gratis ahora
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative z-10 grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                <span className="material-icons-round text-white mb-2">lightbulb</span>
                <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Luces</div>
                <div className="text-white font-bold text-xl">Sala de Control</div>
                <div className="mt-4 flex justify-end">
                  <div className="w-10 h-5 bg-emerald-400 rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 mt-8">
                <span className="material-icons-round text-white mb-2">settings_input_component</span>
                <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Circuito</div>
                <div className="text-white font-bold text-xl">Inversor AC</div>
                <div className="mt-4 flex justify-end">
                  <div className="w-10 h-5 bg-white/20 rounded-full relative">
                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="material-icons-round text-white text-sm">grid_view</span>
                </div>
                <span className="text-xl font-extrabold tracking-tight">Control <span className="text-primary">Hub</span></span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                La solución integral para la gestión de infraestructuras IoT y energía solar distribuida. Tecnología robusta para un futuro sostenible.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-6">Navegación</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">Inicio</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Dispositivos</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Soporte</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Documentación API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Social</h4>
              <ul className="space-y-4 text-slate-500 dark:text-slate-400 text-sm">
                <li><a className="hover:text-primary transition-colors" href="#">Twitter</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">GitHub</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>© 2024 Control Hub IoT Solutions. Todos los derechos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a className="hover:text-slate-600 dark:hover:text-slate-200" href="#">Privacidad</a>
              <a className="hover:text-slate-600 dark:hover:text-slate-200" href="#">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LCDDisplay;
