import React from 'react';
import LaubotExample from '../components/LaubotExample';

const LaubotDemo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-beige to-sand">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-vino mb-4 font-quicksand">
            🤖 Laubot - Asistente Personal
          </h1>
          <p className="text-xl text-vino/80 max-w-2xl mx-auto">
            Bot inteligente con manejo de estados para integración con Google Calendar. 
            Perfecto para automatizar tu agenda personal.
          </p>
        </div>
        
        <LaubotExample />
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white/50 rounded-lg p-6 border border-vino/20">
            <h2 className="text-2xl font-bold text-vino mb-4">📖 Cómo usar en tu aplicación</h2>
            
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-vino mb-2">1. Hook básico:</h3>
                <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`import { useLaubot } from './hooks/useLaubot';

const MyComponent = () => {
  const { isLoading, authenticate, listEvents, events } = useLaubot();
  
  return (
    <div>
      <button onClick={authenticate}>Autenticar</button>
      <button onClick={() => listEvents()}>Ver eventos</button>
      {events.map(event => <div key={event.id}>{event.summary}</div>)}
    </div>
  );
};`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-vino mb-2">2. Instancia global (.use pattern):</h3>
                <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
{`import { laubot } from './hooks/useLaubot';

// En cualquier parte de tu app
const bot = laubot();

bot.authenticate();
bot.listEvents();

// Escuchar cambios
bot.subscribe((state) => {
  console.log('Estado del bot:', state);
});`}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold text-vino mb-2">3. Estados disponibles:</h3>
                <ul className="list-disc list-inside text-vino/80 space-y-1">
                  <li><code>idle</code> - En espera</li>
                  <li><code>authenticating</code> - Ejecutando get_credentials</li>
                  <li><code>authenticated</code> - Listo para usar</li>
                  <li><code>listing_events</code> - Ejecutando calendar.list_events</li>
                  <li><code>updating_event</code> - Ejecutando calendar.update_event</li>
                  <li><code>creating_event</code> - Ejecutando calendar.create_event</li>
                  <li><code>error</code> - Estado de error</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaubotDemo; 