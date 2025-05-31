import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Laugh, 
  Flame, 
  Share2, 
  RefreshCw, 
  Trophy, 
  Copy, 
  Target, 
  Shuffle, 
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Bot,
  Frown,
  Users,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Importar los nuevos componentes
import SocialShareModal from "./SocialShareModal";
import UserRankingSystem from "./UserRankingSystem";
import ChamuyoChallenge from "./ChamuyoChallenge";

// Tipos mejorados
interface Frase {
  id: number;
  texto: string;
  reacciones: { love: number; laugh: number; fire: number; cringe: number };
  autor: string;
  mood?: "tierno" | "picaro" | "existencial" | "libre";
  esDesafio?: boolean;
  fechaCreacion: Date;
}

type MoodType = "tierno" | "picaro" | "existencial" | "libre";
type SortType = "mas-votadas" | "nuevas" | "random";

// Datos iniciales ampliados
const FRASES_INICIALES: Frase[] = [
  {
    id: 1,
    texto: "No sos mi tipo. Sos mi excepción.",
    reacciones: { love: 142, laugh: 23, fire: 89, cringe: 12 },
    autor: "Lautaro",
    mood: "picaro",
    fechaCreacion: new Date('2024-01-15')
  },
  {
    id: 2,
    texto: "Hoy me organizaste la agenda... ¿y si mañana me organizás el corazón?",
    reacciones: { love: 98, laugh: 45, fire: 67, cringe: 8 },
    autor: "Usuario",
    mood: "tierno",
    fechaCreacion: new Date('2024-01-14')
  },
  {
    id: 3,
    texto: "Decime qué tarea querés que agende y de paso te agendo a vos en mi vida.",
    reacciones: { love: 76, laugh: 34, fire: 92, cringe: 15 },
    autor: "Lautaro",
    mood: "picaro",
    fechaCreacion: new Date('2024-01-13')
  },
  {
    id: 4,
    texto: "¿Por qué será que cuando estás cerca, hasta mis notificaciones se quedan en silencio?",
    reacciones: { love: 156, laugh: 12, fire: 134, cringe: 3 },
    autor: "Usuario",
    mood: "existencial",
    fechaCreacion: new Date('2024-01-12')
  },
  {
    id: 5,
    texto: "Si fueras un recordatorio, serías el único que nunca querría posponer.",
    reacciones: { love: 89, laugh: 28, fire: 73, cringe: 5 },
    autor: "Lautaro",
    mood: "tierno",
    fechaCreacion: new Date('2024-01-11')
  },
  {
    id: 6,
    texto: "Tu sonrisa con alfajor debe ser la combinación perfecta de dulzura.",
    reacciones: { love: 67, laugh: 45, fire: 23, cringe: 8 },
    autor: "Usuario",
    mood: "tierno",
    esDesafio: true,
    fechaCreacion: new Date('2024-01-10')
  }
];

const FRASES_MUTANTES = {
  tierno: [
    "No sé si sos mi destino, pero tengo ganas de procrastinar con vos.",
    "Si fueras una notificación, serías la única que me haría sonreír.",
    "Tu sonrisa es más efectiva que cualquier algoritmo de motivación."
  ],
  picaro: [
    "¿Será que necesito actualizarte en mi sistema operativo del corazón?",
    "Sos como el modo avión: cuando estás activado, todo lo demás desaparece.",
    "Si fueras un bug, serías el único que no querría arreglar."
  ],
  existencial: [
    "¿Por qué será que antes de conocerte no sabía que me faltaba algo?",
    "Tu ausencia es el único lag que me molesta en la vida.",
    "¿Será que el amor es el único virus que no quiero eliminar?"
  ]
};

const DESAFIOS_SEMANALES = [
  { palabra: "alfajor", descripcion: "Chamuyá con la palabra alfajor" },
  { palabra: "café", descripcion: "Conquistá usando café como inspiración" },
  { palabra: "lluvia", descripción: "Enamorá con la magia de la lluvia" },
  { palabra: "domingo", descripción: "Hacé que los domingos sean especiales" }
];

// Datos de usuarios simulados para el ranking
const USUARIOS_SIMULADOS = [
  { nombre: "María", puntos: 1250, frasesCreadas: 23, reaccionesTotales: 456, nivel: "Poeta del Corazón", insignias: ["viral", "maestro_tierno", "consistente"], posicion: 1 },
  { nombre: "Carlos", puntos: 890, frasesCreadas: 18, reaccionesTotales: 234, nivel: "Maestro del Verso", insignias: ["picaro_profesional", "popular"], posicion: 2 },
  { nombre: "Ana", puntos: 670, frasesCreadas: 15, reaccionesTotales: 189, nivel: "Maestro del Verso", insignias: ["filosofo", "primera_frase"], posicion: 3 },
  { nombre: "Usuario", puntos: 340, frasesCreadas: 8, reaccionesTotales: 67, nivel: "Chamuyero Novato", insignias: ["primera_frase"], posicion: 7 },
];

const LaboratorioChamuyo = () => {
  const [frases, setFrases] = useState<Frase[]>(FRASES_INICIALES);
  const [nuevaFrase, setNuevaFrase] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [esAnonimo, setEsAnonimo] = useState(false);
  const [moodSeleccionado, setMoodSeleccionado] = useState<MoodType>("libre");
  const [sortType, setSortType] = useState<SortType>("mas-votadas");
  const [showPreview, setShowPreview] = useState(false);
  const [showSocialCard, setShowSocialCard] = useState<string | null>(null);
  const [desafioActual] = useState(() => 
    DESAFIOS_SEMANALES[Math.floor(Math.random() * DESAFIOS_SEMANALES.length)]
  );
  const [fraseMutada, setFraseMutada] = useState("");
  const [moodMutante, setMoodMutante] = useState<MoodType>("tierno");
  const [showLautaroSuggestion, setShowLautaroSuggestion] = useState(false);
  const [activeTab, setActiveTab] = useState("laboratorio");
  const [showSocialShare, setShowSocialShare] = useState<{frase: string; autor: string; reacciones?: any; mood?: string} | null>(null);

  // Generar frase mutante inicial
  useEffect(() => {
    mutarFrase();
  }, []);

  // Mostrar sugerencia de Lautaro después de inactividad
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!nuevaFrase.trim()) {
        setShowLautaroSuggestion(true);
      }
    }, 30000); // 30 segundos

    return () => clearTimeout(timer);
  }, [nuevaFrase]);

  const handleReaccion = (fraseId: number, tipo: keyof Frase['reacciones']) => {
    setFrases(frases.map(frase => 
      frase.id === fraseId 
        ? { ...frase, reacciones: { ...frase.reacciones, [tipo]: frase.reacciones[tipo] + 1 }}
        : frase
    ));
  };

  const handleEnviarFrase = () => {
    if (nuevaFrase.trim().length >= 10) {
      const nuevaFraseObj: Frase = {
        id: frases.length + 1,
        texto: nuevaFrase,
        reacciones: { love: 0, laugh: 0, fire: 0, cringe: 0 },
        autor: esAnonimo ? "Anónimo" : nombreUsuario || "Usuario",
        mood: moodSeleccionado !== "libre" ? moodSeleccionado : undefined,
        esDesafio: nuevaFrase.toLowerCase().includes(desafioActual.palabra),
        fechaCreacion: new Date()
      };
      setFrases([nuevaFraseObj, ...frases]);
      setNuevaFrase("");
      setShowPreview(false);
    }
  };

  const mutarFrase = () => {
    const frasesMood = FRASES_MUTANTES[moodMutante];
    const nuevaFrase = frasesMood[Math.floor(Math.random() * frasesMood.length)];
    setFraseMutada(nuevaFrase);
  };

  const cambiarMoodMutante = () => {
    const moods: MoodType[] = ["tierno", "picaro", "existencial"];
    const currentIndex = moods.indexOf(moodMutante);
    const nextMood = moods[(currentIndex + 1) % moods.length];
    setMoodMutante(nextMood);
    
    // Auto-mutar con el nuevo mood
    setTimeout(() => {
      const frasesMood = FRASES_MUTANTES[nextMood];
      const nuevaFrase = frasesMood[Math.floor(Math.random() * frasesMood.length)];
      setFraseMutada(nuevaFrase);
    }, 300);
  };

  const copyToClipboard = (texto: string) => {
    navigator.clipboard.writeText(texto);
    // Mostrar feedback visual
  };

  const getSortedFrases = () => {
    let sortedFrases = [...frases];
    
    switch (sortType) {
      case "mas-votadas":
        return sortedFrases.sort((a, b) => 
          (b.reacciones.love + b.reacciones.fire) - (a.reacciones.love + a.reacciones.fire)
        );
      case "nuevas":
        return sortedFrases.sort((a, b) => 
          b.fechaCreacion.getTime() - a.fechaCreacion.getTime()
        );
      case "random":
        return sortedFrases.sort(() => Math.random() - 0.5);
      default:
        return sortedFrases;
    }
  };

  const topFrases = getSortedFrases().slice(0, 3);
  const frasesDesafio = frases.filter(f => f.esDesafio).slice(0, 3);

  const getMoodColor = (mood?: MoodType) => {
    switch (mood) {
      case "tierno": return "bg-pink-100 text-pink-800";
      case "picaro": return "bg-orange-100 text-orange-800";
      case "existencial": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getMoodEmoji = (mood?: MoodType) => {
    switch (mood) {
      case "tierno": return "🥰";
      case "picaro": return "😏";
      case "existencial": return "🤔";
      default: return "✨";
    }
  };

  const handleSocialShare = (frase: string, autor: string, reacciones?: any, mood?: string) => {
    setShowSocialShare({ frase, autor, reacciones, mood });
  };

  const handleAcceptChallenge = (palabraClave: string) => {
    setNuevaFrase(`Inspirándome en ${palabraClave}... `);
    setActiveTab("laboratorio");
  };

  return (
    <section className="w-full py-8 md:py-16 px-4 bg-gradient-to-br from-beige to-sand min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Título principal */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-vino mb-4 font-quicksand">
            🧪 Laboratorio de Chamuyo
          </h2>
          <p className="text-base md:text-xl text-vino/80 max-w-2xl mx-auto">
            Acá se prueban frases, se inventan sentimientos y se testea el amor con palabras.
          </p>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-beige/60">
            <TabsTrigger value="laboratorio" className="data-[state=active]:bg-coral data-[state=active]:text-white">
              🧪 Laboratorio
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-coral data-[state=active]:text-white">
              🎯 Desafíos
            </TabsTrigger>
            <TabsTrigger value="ranking" className="data-[state=active]:bg-coral data-[state=active]:text-white">
              🏆 Ranking
            </TabsTrigger>
          </TabsList>

          {/* Laboratorio Tab */}
          <TabsContent value="laboratorio" className="space-y-8">
            {/* Frase Mutante del Día - Mejorada */}
            <Card className="mb-8 md:mb-12 bg-gradient-to-r from-coral/20 to-terracota/20 border-coral/30 overflow-hidden">
              <CardContent className="p-6 md:p-8 text-center relative">
                <div className="absolute top-4 right-4">
                  <Badge className={getMoodColor(moodMutante)}>
                    {getMoodEmoji(moodMutante)} {moodMutante}
                  </Badge>
                </div>
                
                <h3 className="text-xl md:text-2xl font-bold text-vino mb-4 font-quicksand">
                  💫 Frase Mutante del Día
                </h3>
                <blockquote className="text-lg md:text-2xl font-semibold text-vino mb-6 italic min-h-[3rem]">
                  "{fraseMutada}"
                </blockquote>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button 
                    onClick={cambiarMoodMutante}
                    variant="outline"
                    className="border-vino text-vino hover:bg-vino hover:text-beige font-quicksand"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Reversionar frase
                  </Button>
                  
                  <Button 
                    onClick={mutarFrase}
                    className="bg-vino hover:bg-terracota text-beige font-quicksand"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Mutar frase
                  </Button>
                  
                  <Button 
                    onClick={() => handleSocialShare(fraseMutada, "Lautaro", undefined, moodMutante)}
                    variant="outline"
                    className="border-coral text-coral hover:bg-coral hover:text-white font-quicksand"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              {/* Feed de Frases - Mejorado */}
              <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
                  <h3 className="text-xl md:text-2xl font-bold text-vino font-quicksand">🔥 Frases en Laboratorio</h3>
                  
                  <Select value={sortType} onValueChange={(value: SortType) => setSortType(value)}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mas-votadas">Más votadas</SelectItem>
                      <SelectItem value="nuevas">Nuevas</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {getSortedFrases().map((frase) => (
                    <Card key={frase.id} className="hover:shadow-lg transition-all duration-200 group">
                      <CardContent className="p-4 md:p-6">
                        {/* Header con autor y mood */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral to-vino flex items-center justify-center">
                              {frase.autor === "Lautaro" ? (
                                <Bot className="w-4 h-4 text-white" />
                              ) : (
                                <User className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-vino text-sm">{frase.autor}</span>
                              {frase.mood && (
                                <Badge className={`ml-2 ${getMoodColor(frase.mood)} text-xs`}>
                                  {getMoodEmoji(frase.mood)} {frase.mood}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {frase.esDesafio && (
                            <Badge className="bg-terracota/20 text-terracota">
                              <Target className="w-3 h-3 mr-1" />
                              Desafío
                            </Badge>
                          )}
                        </div>

                        {/* Frase */}
                        <blockquote className="text-base md:text-lg font-medium text-vino mb-4 leading-relaxed">
                          "{frase.texto}"
                        </blockquote>

                        {/* Reacciones mejoradas */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3 md:gap-4">
                            <button
                              onClick={() => handleReaccion(frase.id, 'love')}
                              className="group/btn flex items-center gap-1 text-sm text-vino/70 hover:text-pink-600 transition-colors relative"
                              title="Me llegó"
                            >
                              <Heart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              {frase.reacciones.love}
                            </button>
                            
                            <button
                              onClick={() => handleReaccion(frase.id, 'laugh')}
                              className="group/btn flex items-center gap-1 text-sm text-vino/70 hover:text-yellow-600 transition-colors"
                              title="Me hizo reír"
                            >
                              <Laugh className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              {frase.reacciones.laugh}
                            </button>
                            
                            <button
                              onClick={() => handleReaccion(frase.id, 'fire')}
                              className="group/btn flex items-center gap-1 text-sm text-vino/70 hover:text-red-600 transition-colors"
                              title="Intenso"
                            >
                              <Flame className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              {frase.reacciones.fire}
                            </button>
                            
                            <button
                              onClick={() => handleReaccion(frase.id, 'cringe')}
                              className="group/btn flex items-center gap-1 text-sm text-vino/70 hover:text-purple-600 transition-colors"
                              title="Cringe lindo"
                            >
                              <Frown className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                              {frase.reacciones.cringe}
                            </button>
                          </div>
                          
                          <div className="flex gap-2">
                            <button 
                              onClick={() => copyToClipboard(frase.texto)}
                              className="text-vino/70 hover:text-vino transition-colors p-1"
                              title="Copiar"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleSocialShare(frase.texto, frase.autor, frase.reacciones, frase.mood)}
                              className="text-vino/70 hover:text-vino transition-colors p-1"
                              title="Compartir"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar mejorado - solo mantener el formulario y top chamuyos */}
              <div className="space-y-6 md:space-y-8">
                {/* Formulario mejorado */}
                <Card className="bg-terracota/10 border-terracota/30">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-vino mb-4 font-quicksand">✨ Creá tu Chamuyo</h3>
                    
                    {/* Selector de mood */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-vino mb-2 block">¿Cómo querés que suene?</label>
                      <Select value={moodSeleccionado} onValueChange={(value: MoodType) => setMoodSeleccionado(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="libre">✨ Libre</SelectItem>
                          <SelectItem value="tierno">🥰 Tierno</SelectItem>
                          <SelectItem value="picaro">😏 Pícaro</SelectItem>
                          <SelectItem value="existencial">🤔 Existencial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Input de nombre */}
                    <div className="mb-4">
                      <Input
                        placeholder="Tu nombre (opcional)"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        className="mb-2"
                      />
                      <label className="flex items-center gap-2 text-sm text-vino">
                        <input
                          type="checkbox"
                          checked={esAnonimo}
                          onChange={(e) => setEsAnonimo(e.target.checked)}
                          className="rounded"
                        />
                        Publicar como Anónimo
                      </label>
                    </div>

                    {/* Textarea */}
                    <Textarea
                      placeholder="Escribí tu frase... inspirate, inspiralo. (mín. 10 caracteres)"
                      value={nuevaFrase}
                      onChange={(e) => setNuevaFrase(e.target.value)}
                      className="mb-4 border-vino/20"
                      rows={3}
                    />
                    
                    {/* Contador de caracteres */}
                    <div className="text-xs text-vino/60 mb-3">
                      {nuevaFrase.length}/10 caracteres mínimos
                    </div>

                    {/* Preview */}
                    {nuevaFrase.length >= 10 && (
                      <div className="mb-4 p-3 bg-vino/5 rounded-lg border border-vino/10">
                        <h4 className="text-sm font-semibold text-vino mb-2">Vista previa:</h4>
                        <p className="text-sm text-vino italic">"{nuevaFrase}"</p>
                        <p className="text-xs text-vino/60 mt-1">
                          - {esAnonimo ? "Anónimo" : nombreUsuario || "Usuario"}
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      onClick={handleEnviarFrase}
                      className="w-full bg-vino hover:bg-terracota text-beige font-quicksand"
                      disabled={nuevaFrase.trim().length < 10}
                    >
                      Enviar a la incubadora
                    </Button>
                  </CardContent>
                </Card>

                {/* Top Chamuyos - Ranking animado */}
                <Card className="bg-vino/10 border-vino/30">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold text-vino mb-4 font-quicksand flex items-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      🏆 Top Chamuyos
                    </h3>
                    <div className="space-y-3">
                      {topFrases.map((frase, index) => (
                        <div 
                          key={frase.id} 
                          className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                            index === 0 ? 'bg-yellow-50 border border-yellow-200 animate-pulse' : 'hover:bg-vino/5'
                          }`}
                        >
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' : 
                            index === 1 ? 'bg-gray-400 text-white' : 
                            'bg-orange-400 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-vino font-medium leading-snug">"{frase.texto}"</p>
                            <div className="flex justify-between items-center mt-1">
                              <div className="flex gap-2 text-xs text-vino/60">
                                <span>❤️ {frase.reacciones.love}</span>
                                <span>🔥 {frase.reacciones.fire}</span>
                              </div>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => copyToClipboard(frase.texto)}
                                  className="text-vino/60 hover:text-vino p-1"
                                  title="Copiar"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                                <button 
                                  onClick={() => handleSocialShare(frase.texto, frase.autor, frase.reacciones, frase.mood)}
                                  className="text-vino/60 hover:text-vino p-1"
                                  title="Compartir"
                                >
                                  <Share2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 border-vino text-vino hover:bg-vino hover:text-beige"
                      onClick={() => setActiveTab("ranking")}
                    >
                      Ver ranking completo
                    </Button>
                  </CardContent>
                </Card>

                {/* Sugerencia de Lautaro */}
                {showLautaroSuggestion && (
                  <Card className="bg-coral/10 border-coral/30 animate-bounce">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral to-vino flex items-center justify-center flex-shrink-0">
                          🤵‍♂️
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-vino font-medium mb-2">
                            ¿Querés que te tire un chamuyo sorpresa?
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => {
                                const randomFrase = FRASES_MUTANTES.picaro[0];
                                setNuevaFrase(randomFrase);
                                setShowLautaroSuggestion(false);
                              }}
                              className="bg-coral hover:bg-coral/80 text-white text-xs"
                            >
                              ¡Sí!
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => setShowLautaroSuggestion(false)}
                              className="text-xs"
                            >
                              Ahora no
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <ChamuyoChallenge onAcceptChallenge={handleAcceptChallenge} />
          </TabsContent>

          {/* Ranking Tab */}
          <TabsContent value="ranking">
            <UserRankingSystem usuarios={USUARIOS_SIMULADOS} currentUser="Usuario" />
          </TabsContent>
        </Tabs>

        {/* CTA final */}
        <div className="text-center mt-8 md:mt-12">
          <p className="text-lg md:text-xl text-vino mb-6 font-quicksand">
            ¿Te animás a crear el próximo chamuyo que todos van a copiar?
          </p>
          <a
            href="/chat"
            className="bg-coral hover:bg-vino text-vino hover:text-beige font-bold px-6 md:px-8 py-3 md:py-4 rounded-full transition-all shadow-lg text-base md:text-lg font-quicksand inline-block"
          >
            Probar mi talento verbal
          </a>
        </div>
      </div>

      {/* Modal de compartir en redes sociales */}
      {showSocialShare && (
        <SocialShareModal 
          frase={showSocialShare.frase}
          autor={showSocialShare.autor}
          reacciones={showSocialShare.reacciones}
          mood={showSocialShare.mood}
          onClose={() => setShowSocialShare(null)} 
        />
      )}
    </section>
  );
};

export default LaboratorioChamuyo;
