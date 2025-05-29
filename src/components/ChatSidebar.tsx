
const ChatSidebar = () => {
  // Visible en desktop o cuando esté expandido (modo futuro)
  return (
    <aside className="hidden md:flex flex-col w-80 bg-gradient-to-b from-beige/90 to-[#ffe9d6cc] dark:from-[#1b1014] dark:to-[#442134] shadow-xl border-r border-beige/60 p-6 min-h-screen">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-coral via-vino to-terracota flex items-center justify-center text-3xl font-bold text-beige shadow-lg mb-2">
          🤵‍♂️
        </div>
        <div className="font-quicksand text-lg font-bold text-vino dark:text-beige">Lautaro</div>
        <div className="mt-2 text-sm text-vino/80 dark:text-beige/80 opacity-80">Tu asistente con alma</div>
      </div>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide font-bold text-vino/60 mb-2">Vínculo</div>
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-terracota">Curiosidad</span>
          <span className="text-sm text-vino/70">1/22</span>
          <span className="animate-pulse">🔥</span>
        </div>
        <div className="w-full h-2 rounded-full bg-beige border mt-1">
          <div className="h-2 rounded-full bg-vino transition-all" style={{width: "6%"}} />
        </div>
      </div>
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide font-bold text-vino/60 mb-2">Estilo de Lautaro</div>
        <div className="flex gap-2">
          <span className="bg-coral/30 py-1 px-3 rounded-full font-medium text-sm text-vino">Amable</span>
          <span className="bg-sand/80 py-1 px-3 rounded-full font-medium text-sm text-vino/60">Formal</span>
          <span className="bg-sand/80 py-1 px-3 rounded-full font-medium text-sm text-vino/60">Divertido</span>
          <span className="bg-sand/80 py-1 px-3 rounded-full font-medium text-sm text-vino/60">Tierno</span>
        </div>
        <div className="text-xs uppercase tracking-wide font-bold text-vino/60 mt-4 mb-2">Intensidad chamuyo</div>
        <div className="flex gap-2">
          <span className="bg-vino/10 py-1 px-3 rounded-full font-medium text-sm text-vino">Nada</span>
          <span className="bg-coral/30 py-1 px-3 rounded-full font-medium text-sm text-vino/80">Suave</span>
          <span className="bg-sand/80 py-1 px-3 rounded-full font-medium text-sm text-vino/60">Alto Voltaje</span>
        </div>
      </div>
      {/* Interacciones clave simuladas */}
      <div>
        <div className="text-xs uppercase tracking-wide font-bold text-vino/60 mb-2">Tus últimas interacciones</div>
        <ul className="text-vino/90 dark:text-beige text-sm space-y-1">
          <li>✔️ Reunión agendada para el jueves</li>
          <li>✏️ Nota guardada: “Recordar turno…”</li>
          <li>💬 Frase guardada: “Te lo vas a olvidar, ¿querés que moleste?”</li>
        </ul>
      </div>
    </aside>
  );
};
export default ChatSidebar;
