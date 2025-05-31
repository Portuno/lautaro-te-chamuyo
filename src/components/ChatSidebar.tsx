import { Lock, Settings, X } from "lucide-react";
import { useChatConfig, type ConversationStyle } from "@/hooks/useChatConfig";
import { useState } from "react";

interface StyleConfig {
  name: string;
  unlockLevel: number;
  emoji: string;
}

const ChatSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Usar el contexto de configuración del chat
  const { 
    config, 
    setStyle, 
    setChamuyoIntensity, 
    isStyleUnlocked, 
    getMaxChamuyoIntensity 
  } = useChatConfig();
  
  const conversationStyles: Record<ConversationStyle, StyleConfig> = {
    amable: { name: "Amable", unlockLevel: 1, emoji: "😊" },
    formal: { name: "Formal", unlockLevel: 3, emoji: "🎩" },
    divertido: { name: "Divertido", unlockLevel: 4, emoji: "😄" },
    tierno: { name: "Tierno", unlockLevel: 8, emoji: "🥰" }
  };

  const handleStyleChange = (style: ConversationStyle) => {
    setStyle(style);
  };

  const handleChamuyoChange = (value: number) => {
    setChamuyoIntensity(value);
  };

  const getChamuyoLabel = (intensity: number) => {
    if (intensity === 0) return "nada";
    if (intensity <= 10) return "suave";
    if (intensity <= 30) return "medio";
    if (intensity <= 60) return "picante";
    return "alto voltaje";
  };

  const maxIntensity = getMaxChamuyoIntensity();

  const SidebarContent = () => (
    <>
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
          <span className="text-sm text-vino/70">{config.userLevel}/22</span>
          <span className="animate-pulse">🔥</span>
        </div>
        <div className="w-full h-2 rounded-full bg-beige border mt-1">
          <div className="h-2 rounded-full bg-vino transition-all" style={{width: "6%"}} />
        </div>
      </div>
      
      {/* Estilos de conversación interactivos */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide font-bold text-vino/60 mb-3">Estilo de Lautaro</div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(conversationStyles).map(([key, styleConfig]) => {
            const isSelected = config.style === key;
            const isAvailable = isStyleUnlocked(key as ConversationStyle);
            
            return (
              <div key={key} className="relative group">
                <button
                  onClick={() => handleStyleChange(key as ConversationStyle)}
                  disabled={!isAvailable}
                  className={`
                    relative py-2 px-3 rounded-lg font-medium text-sm transition-all duration-200 w-full
                    ${isAvailable 
                      ? (isSelected 
                          ? "bg-coral/40 text-vino border-2 border-coral shadow-md transform scale-105" 
                          : "bg-sand/60 text-vino hover:bg-coral/20 border border-sand")
                      : "bg-gray-200/40 text-gray-600 cursor-not-allowed backdrop-blur-[1px] border border-gray-300/30"
                    }
                  `}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span className={isAvailable ? "" : "filter grayscale opacity-70"}>{styleConfig.emoji}</span>
                    <span className="truncate">{styleConfig.name}</span>
                    {!isAvailable && (
                      <Lock className="w-3 h-3 absolute top-1 right-1 text-gray-500" />
                    )}
                  </div>
                  {!isAvailable && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                      <span className="text-xs bg-gray-600 text-white px-1 rounded text-[10px]">
                        Nv.{styleConfig.unlockLevel}
                      </span>
                    </div>
                  )}
                </button>
                
                {/* Tooltip on hover for locked styles */}
                {!isAvailable && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                    <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      Se desbloquea en nivel {styleConfig.unlockLevel}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Intensidad del chamuyo con slider mejorado */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wide font-bold text-vino/60 mb-3">
          Intensidad del chamuyo
        </div>
        <div className="space-y-4">
          {/* Slider Container */}
          <div className="relative px-1">
            {/* Track */}
            <div className="relative h-3 bg-gradient-to-r from-beige/60 to-sand/60 rounded-full shadow-inner border border-sand/30">
              {/* Progress */}
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-coral/70 to-coral rounded-full transition-all duration-300 ease-out shadow-sm"
                style={{ width: `${config.chamuyoIntensity}%` }}
              />
              
              {/* Limit marker */}
              <div 
                className="absolute top-0 h-full w-0.5 bg-terracota/60 rounded-full"
                style={{ left: `${maxIntensity}%` }}
              />
              
              {/* Thumb */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-coral rounded-full shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:border-terracota"
                style={{ left: `calc(${config.chamuyoIntensity}% - 10px)` }}
              />
            </div>
            
            {/* Hidden input */}
            <input
              type="range"
              min={0}
              max={100}
              value={config.chamuyoIntensity}
              onChange={(e) => handleChamuyoChange(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: 10 }}
            />
          </div>
          
          {/* Labels and current value */}
          <div className="flex justify-between items-center text-xs text-vino/70">
            <span className="font-medium">0%</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-coral/15 rounded-full text-vino font-semibold">
                {config.chamuyoIntensity}%
              </span>
              <span className="text-coral font-medium">
                {getChamuyoLabel(config.chamuyoIntensity)}
              </span>
            </div>
            <span className="font-medium">100%</span>
          </div>
          
          {/* Info card for level 1 */}
          {config.userLevel === 1 && (
            <div className="text-xs text-vino/70 bg-gradient-to-r from-beige/50 to-sand/30 rounded-lg p-3 border border-sand/40">
              <div className="flex items-center gap-2">
                <span className="text-amber-500">💡</span>
                <span>
                  <span className="font-semibold">Nivel básico:</span> máximo {maxIntensity}% de intensidad
                </span>
              </div>
              <div className="mt-1 text-[11px] text-vino/60">
                Subí de nivel para desbloquear más chamuyo
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interacciones clave simuladas */}
      <div>
        <div className="text-xs uppercase tracking-wide font-bold text-vino/60 mb-2">Tus últimas interacciones</div>
        <ul className="text-vino/90 dark:text-beige text-sm space-y-1">
          <li>✔️ Reunión agendada para el jueves</li>
          <li>✏️ Nota guardada: "Recordar turno…"</li>
          <li>💬 Frase guardada: "Te lo vas a olvidar, ¿querés que moleste?"</li>
        </ul>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-20 left-4 z-40 p-2 bg-coral text-vino rounded-full shadow-lg hover:bg-coral/80 transition-colors"
        aria-label="Abrir configuración"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-80 bg-gradient-to-b from-beige/90 to-[#ffe9d6cc] dark:from-[#1b1014] dark:to-[#442134] shadow-xl border-r border-beige/60 p-6 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative w-80 max-w-[90vw] bg-gradient-to-b from-beige/95 to-[#ffe9d6f0] dark:from-[#1b1014] dark:to-[#442134] shadow-xl p-6 overflow-y-auto">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-vino hover:bg-coral/20 rounded-full transition-colors"
              aria-label="Cerrar configuración"
            >
              <X className="w-5 h-5" />
            </button>
            
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSidebar;
