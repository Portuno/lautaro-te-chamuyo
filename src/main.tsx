import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado: ', registration);
        
        // Verificar si hay actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                console.log('Nueva versión de la app disponible');
                if (confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Detectar cuando la app es instalable
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  
  // Opcionalmente mostrar un botón de instalación personalizado
  console.log('App es instalable');
});

// Detectar cuando la app fue instalada
window.addEventListener('appinstalled', (evt) => {
  console.log('App instalada exitosamente');
});
