
import React, { useState } from "react";
import { Heart, Laugh, Flame, Share2, RefreshCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FRASES_INICIALES = [
  {
    id: 1,
    texto: "No sos mi tipo. Sos mi excepción.",
    reacciones: { love: 142, laugh: 23, fire: 89 },
    autor: "Lautaro"
  },
  {
    id: 2,
    texto: "Hoy me organizaste la agenda... ¿y si mañana me organizás el corazón?",
    reacciones: { love: 98, laugh: 45, fire: 67 },
    autor: "Usuario"
  },
  {
    id: 3,
    texto: "Decime qué tarea querés que agende y de paso te agendo a vos en mi vida.",
    reacciones: { love: 76, laugh: 34, fire: 92 },
    autor: "Lautaro"
  },
  {
    id: 4,
    texto: "No sé si sos mi destino, pero tengo ganas de perderme en vos.",
    reacciones: { love: 156, laugh: 12, fire: 134 },
    autor: "Usuario"
  },
  {
    id: 5,
    texto: "Si fueras un recordatorio, serías el único que nunca querría posponer.",
    reacciones: { love: 89, laugh: 28, fire: 73 },
    autor: "Lautaro"
  }
];

const FRASES_MUTANTES = [
  "No sé si sos mi destino, pero tengo ganas de procrastinar con vos.",
  "Si fueras una notificación, serías la única que me haría sonreír.",
  "Tu sonrisa es más efectiva que cualquier algoritmo de motivación.",
  "¿Será que necesito actualizarte en mi sistema operativo del corazón?",
  "Sos como el modo avión: cuando estás activado, todo lo demás desaparece."
];

const LaboratorioChamuyo = () => {
  const [frases, setFrases] = useState(FRASES_INICIALES);
  const [nuevaFrase, setNuevaFrase] = useState("");
  const [fraseDelDia] = useState(() => 
    FRASES_MUTANTES[Math.floor(Math.random() * FRASES_MUTANTES.length)]
  );
  const [fraseMutada, setFraseMutada] = useState(fraseDelDia);

  const handleReaccion = (fraseId: number, tipo: 'love' | 'laugh' | 'fire') => {
    setFrases(frases.map(frase => 
      frase.id === fraseId 
        ? { ...frase, reacciones: { ...frase.reacciones, [tipo]: frase.reacciones[tipo] + 1 }}
        : frase
    ));
  };

  const handleEnviarFrase = () => {
    if (nuevaFrase.trim()) {
      const nuevaFraseObj = {
        id: frases.length + 1,
        texto: nuevaFrase,
        reacciones: { love: 0, laugh: 0, fire: 0 },
        autor: "Usuario"
      };
      setFrases([nuevaFraseObj, ...frases]);
      setNuevaFrase("");
    }
  };

  const mutarFrase = () => {
    const nuevaFrase = FRASES_MUTANTES[Math.floor(Math.random() * FRASES_MUTANTES.length)];
    setFraseMutada(nuevaFrase);
  };

  const topFrases = frases
    .sort((a, b) => (b.reacciones.love + b.reacciones.fire) - (a.reacciones.love + a.reacciones.fire))
    .slice(0, 3);

  return (
    <section className="w-full py-16 px-4 bg-gradient-to-br from-beige to-sand">
      <div className="max-w-6xl mx-auto">
        {/* Título principal */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-vino mb-4 font-quicksand">
            🧪 Laboratorio de Chamuyo
          </h2>
          <p className="text-lg md:text-xl text-vino/80 max-w-2xl mx-auto">
            Acá se prueban frases, se inventan sentimientos y se testea el amor con palabras.
          </p>
        </div>

        {/* Frase del día / Frase mutante */}
        <Card className="mb-12 bg-coral/20 border-coral/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-vino mb-4 font-quicksand">💫 Frase Mutante del Día</h3>
            <blockquote className="text-xl md:text-2xl font-semibold text-vino mb-6 italic">
              "{fraseMutada}"
            </blockquote>
            <Button 
              onClick={mutarFrase}
              className="bg-vino hover:bg-terracota text-beige font-quicksand"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Mutar frase
            </Button>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Zona de frases destacadas */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-vino mb-6 font-quicksand">🔥 Frases en Laboratorio</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {frases.map((frase) => (
                <Card key={frase.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <blockquote className="text-lg font-medium text-vino flex-1">
                        "{frase.texto}"
                      </blockquote>
                      <Badge variant={frase.autor === "Lautaro" ? "default" : "secondary"} className="ml-4">
                        {frase.autor}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleReaccion(frase.id, 'love')}
                          className="flex items-center gap-1 text-sm text-vino/70 hover:text-vino transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          {frase.reacciones.love}
                        </button>
                        <button
                          onClick={() => handleReaccion(frase.id, 'laugh')}
                          className="flex items-center gap-1 text-sm text-vino/70 hover:text-vino transition-colors"
                        >
                          <Laugh className="w-4 h-4" />
                          {frase.reacciones.laugh}
                        </button>
                        <button
                          onClick={() => handleReaccion(frase.id, 'fire')}
                          className="flex items-center gap-1 text-sm text-vino/70 hover:text-vino transition-colors"
                        >
                          <Flame className="w-4 h-4" />
                          {frase.reacciones.fire}
                        </button>
                      </div>
                      <button className="text-vino/70 hover:text-vino transition-colors">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar con formulario y ranking */}
          <div className="space-y-8">
            {/* Formulario para crear chamuyo */}
            <Card className="bg-terracota/10 border-terracota/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-vino mb-4 font-quicksand">✨ Creá tu Chamuyo</h3>
                <Textarea
                  placeholder="Escribí tu frase... inspirate, inspiralo."
                  value={nuevaFrase}
                  onChange={(e) => setNuevaFrase(e.target.value)}
                  className="mb-4 border-vino/20"
                  rows={3}
                />
                <Button 
                  onClick={handleEnviarFrase}
                  className="w-full bg-vino hover:bg-terracota text-beige font-quicksand"
                  disabled={!nuevaFrase.trim()}
                >
                  Enviar a la incubadora
                </Button>
              </CardContent>
            </Card>

            {/* Ranking de frases */}
            <Card className="bg-vino/10 border-vino/30">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-vino mb-4 font-quicksand flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Top Chamuyos
                </h3>
                <div className="space-y-3">
                  {topFrases.map((frase, index) => (
                    <div key={frase.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-vino text-beige rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-vino font-medium">"{frase.texto}"</p>
                        <div className="flex gap-2 mt-1 text-xs text-vino/60">
                          <span>❤️ {frase.reacciones.love}</span>
                          <span>🔥 {frase.reacciones.fire}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Llamado a la participación */}
        <div className="text-center mt-12">
          <p className="text-xl text-vino mb-6 font-quicksand">
            ¿Te animás a crear el próximo chamuyo que todos van a copiar?
          </p>
          <a
            href="/chat"
            className="bg-coral hover:bg-vino text-vino hover:text-beige font-bold px-8 py-4 rounded-full transition-all shadow-lg text-lg font-quicksand inline-block"
          >
            Probar mi talento verbal
          </a>
        </div>
      </div>
    </section>
  );
};

export default LaboratorioChamuyo;
