import React, { useState } from "react";
import { X, Download, Share, Copy, Twitter, Instagram, Heart, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SocialShareModalProps {
  frase: string;
  autor: string;
  reacciones?: { love: number; fire: number; laugh: number; cringe: number };
  mood?: string;
  onClose: () => void;
}

const SocialShareModal = ({ frase, autor, reacciones, mood, onClose }: SocialShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'post' | 'story'>('post');

  const handleCopyToClipboard = () => {
    const textToShare = `"${frase}"\n\n- Creado en el Laboratorio de Chamuyo de Lautaro 🧪\n✨ lautaro.xyz/laboratorio`;
    navigator.clipboard.writeText(textToShare);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`"${frase}"\n\n🧪 Creado en el Laboratorio de Chamuyo de @LautaroAI\n✨ Probá tu talento verbal:`);
    const url = encodeURIComponent('https://lautaro.xyz/laboratorio');
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`, '_blank');
  };

  const handleInstagramStory = () => {
    // Simular apertura de Instagram con imagen generada
    alert('Se abrirá Instagram con tu historia personalizada. Esta funcionalidad estará disponible próximamente.');
  };

  const downloadImage = () => {
    // Simular descarga de imagen
    alert(`Descargando imagen de: "${frase}"`);
  };

  const getTotalReactions = () => {
    if (!reacciones) return 0;
    return reacciones.love + reacciones.fire + reacciones.laugh + reacciones.cringe;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-coral to-terracota p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h3 className="text-white text-xl font-bold mb-2">📤 Compartir Chamuyo</h3>
          <p className="text-white/90 text-sm">Elegí cómo querés compartir esta obra de arte</p>
        </div>

        {/* Preview Card */}
        <div className="p-6">
          <div className={`bg-gradient-to-br ${
            selectedFormat === 'story' 
              ? 'from-coral/20 to-terracota/20' 
              : 'from-beige to-sand'
          } rounded-xl p-6 mb-6 border border-coral/20 relative overflow-hidden`}>
            
            {/* Background pattern for story format */}
            {selectedFormat === 'story' && (
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-6xl">💫</div>
                <div className="absolute bottom-4 left-4 text-4xl">🧪</div>
              </div>
            )}
            
            <div className="relative z-10">
              {mood && (
                <Badge className="mb-3 bg-coral/20 text-coral border-coral/30">
                  {mood === 'tierno' ? '🥰' : mood === 'picaro' ? '😏' : '🤔'} {mood}
                </Badge>
              )}
              
              <blockquote className={`font-semibold text-vino mb-4 italic ${
                selectedFormat === 'story' ? 'text-xl text-center' : 'text-lg'
              }`}>
                "{frase}"
              </blockquote>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-vino/70">- {autor}</span>
                {reacciones && getTotalReactions() > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span className="text-vino/70">{reacciones.love}</span>
                    <Flame className="w-4 h-4 text-red-500" />
                    <span className="text-vino/70">{reacciones.fire}</span>
                  </div>
                )}
              </div>
              
              {selectedFormat === 'story' && (
                <div className="text-center mt-4">
                  <p className="text-sm text-vino/60">🧪 Laboratorio de Chamuyo</p>
                  <p className="text-xs text-vino/50">lautaro.xyz</p>
                </div>
              )}
            </div>
          </div>

          {/* Format Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSelectedFormat('post')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedFormat === 'post'
                  ? 'bg-coral text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📱 Post
            </button>
            <button
              onClick={() => setSelectedFormat('story')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedFormat === 'story'
                  ? 'bg-coral text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📸 Historia
            </button>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Button
              onClick={handleTwitterShare}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
            >
              <Twitter className="w-4 h-4" />
              Compartir en Twitter
            </Button>

            <Button
              onClick={handleInstagramStory}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center justify-center gap-2"
            >
              <Instagram className="w-4 h-4" />
              {selectedFormat === 'story' ? 'Subir a Historia' : 'Compartir en Instagram'}
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={handleCopyToClipboard}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? '¡Copiado!' : 'Copiar texto'}
              </Button>

              <Button
                onClick={downloadImage}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Al compartir, ayudás a que más gente descubra el Laboratorio de Chamuyo ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShareModal; 