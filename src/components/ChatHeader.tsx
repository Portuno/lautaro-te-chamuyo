import { Menu } from "lucide-react";
import { useState } from "react";

const confianzaLevel = {
  actual: "Curiosidad", val: 1, max: 22, emoji: "🔥"
};

const ChatHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-[#2a1321ea] shadow backdrop-blur flex items-center px-3 py-2 md:px-8 md:py-4 border-b border-beige">
      {/* Avatar Lautaro */}
      <div className="flex items-center mr-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-coral via-vino to-terracota flex items-center justify-center text-2xl font-bold text-beige shadow-lg">
          🤵‍♂️
        </div>
        <span className="ml-3 font-quicksand text-2xl font-extrabold text-vino dark:text-beige tracking-tight select-none">Lautaro</span>
      </div>
      {/* Confianza */}
      <div className="flex items-center gap-2 ml-4 px-2 py-1 rounded-lg bg-sand/60 dark:bg-[#3b222b6e] text-vino dark:text-beige font-medium text-sm shadow">
        <span>Nivel de confianza:</span>
        <span className="font-bold">{confianzaLevel.actual}</span>
        <span className="">{confianzaLevel.val}/{confianzaLevel.max}</span>
        <span className="animate-pulse">{confianzaLevel.emoji}</span>
      </div>
      {/* Spacer */}
      <div className="flex-1" />
      {/* Hamburguesa menú (solo visual, funcionalidad a futuro) */}
      <button
        onClick={() => setOpen(o => !o)}
        className="ml-2 p-2 rounded-full hover:bg-coral/20 transition-colors flex items-center"
        aria-label="Abrir menú"
      >
        <Menu className="text-vino dark:text-beige" size={26} />
      </button>
      {/* Menú simulado */}
      {open && (
        <div className="absolute right-2 top-16 bg-beige rounded-lg shadow-lg py-2 px-5 text-vino dark:bg-[#37212c] dark:text-beige z-50 text-base animate-fade-in space-y-2">
          <div className="py-1 px-2 hover:bg-coral/10 rounded cursor-pointer">Configuración</div>
          <div className="py-1 px-2 hover:bg-coral/10 rounded cursor-pointer">Contacto</div>
          <div className="py-1 px-2 hover:bg-coral/10 rounded cursor-pointer">Cambiar tema</div>
        </div>
      )}
    </header>
  );
};

export default ChatHeader;
