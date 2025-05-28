
import { useState } from "react";

const LAUTARO_EXAMPLES = [
  {
    user: "¿Lautaro, me recordás tomar agua?",
    lautaro: "¡Obvio, reina! Pero antes decime... ¿ya tomaste algo más rico hoy? 😏💧",
  },
  {
    user: "Estoy medio bajón hoy.",
    lautaro: "¡Eh, che! Acá estoy para levantarte el ánimo. Si fueras helado, serías sabor 'imposible olvidarte'. 🍦😉",
  },
  {
    user: "¿Tenés ideas para mi cumple?",
    lautaro: "Se me ocurren miles, pero la mejor es asegurarme que la estrella seas vos. (Y si querés, te armo una playlist solo para vos). 🎉",
  },
];

const LautaroDemo = () => {
  const [index, setIndex] = useState(0);
  const handleNext = () => setIndex(i => (i + 1) % LAUTARO_EXAMPLES.length);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 w-full max-w-md flex flex-col gap-4 border border-terracota font-quicksand">
      <div className="flex items-start gap-2">
        <div className="w-10 h-10 rounded-full bg-terracota flex items-center justify-center font-bold text-beige text-2xl">L</div>
        <div className="flex-1">
          <span className="block text-sm text-gray-400 mb-1">Vos:</span>
          <div className="bg-beige rounded-xl px-4 py-2 text-vino">{LAUTARO_EXAMPLES[index].user}</div>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <div className="w-10 h-10 rounded-full bg-vino flex items-center justify-center font-bold text-beige text-2xl shadow-md">
          <span className="animate-pulse">🤵‍♂️</span>
        </div>
        <div className="flex-1">
          <span className="block text-sm text-gray-400 mb-1">Lautaro:</span>
          <div className="bg-terracota rounded-xl px-4 py-2 text-beige shadow">
            {LAUTARO_EXAMPLES[index].lautaro}
          </div>
        </div>
      </div>
      <button
        onClick={handleNext}
        className="self-end mt-2 px-4 py-2 bg-coral text-vino rounded-full shadow font-semibold hover:bg-terracota hover:text-beige transition-colors text-sm"
        aria-label="Ver otro ejemplo"
      >
        Ver otro ejemplo
      </button>
    </div>
  );
};

export default LautaroDemo;
