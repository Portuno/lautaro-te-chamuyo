
import React from "react";
import { Heart, Flame, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const FRASE_DESTACADA = {
  id: 1,
  texto: "No sos mi tipo. Sos mi excepción.",
  reacciones: { love: 142, fire: 89 },
  autor: "Lautaro"
};

const LaboratorioPreview = () => {
  return (
    <section className="w-full py-16 px-4 bg-gradient-to-br from-beige to-sand">
      <div className="max-w-4xl mx-auto text-center">
        {/* Título */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-vino mb-4 font-quicksand">
            🧪 Laboratorio de Chamuyo
          </h2>
          <p className="text-lg text-vino/80 max-w-2xl mx-auto">
            Donde se prueban frases, se inventan sentimientos y se testea el amor con palabras.
          </p>
        </div>

        {/* Frase destacada */}
        <Card className="max-w-2xl mx-auto mb-8 bg-coral/20 border-coral/30 hover:shadow-lg transition-shadow">
          <CardContent className="p-8">
            <blockquote className="text-xl md:text-2xl font-semibold text-vino mb-6 italic">
              "{FRASE_DESTACADA.texto}"
            </blockquote>
            <div className="flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-vino/70">
                <Heart className="w-5 h-5" />
                <span className="font-medium">{FRASE_DESTACADA.reacciones.love}</span>
              </div>
              <div className="flex items-center gap-2 text-vino/70">
                <Flame className="w-5 h-5" />
                <span className="font-medium">{FRASE_DESTACADA.reacciones.fire}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA al laboratorio completo */}
        <div className="space-y-4">
          <p className="text-lg text-vino font-quicksand">
            ¿Te animás a crear el próximo chamuyo que todos van a copiar?
          </p>
          <Button 
            asChild
            className="bg-vino hover:bg-terracota text-beige font-quicksand text-lg px-8 py-6"
          >
            <a href="/laboratorio" className="inline-flex items-center gap-2">
              Entrar al Laboratorio
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LaboratorioPreview;
