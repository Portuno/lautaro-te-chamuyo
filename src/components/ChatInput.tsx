import { useState, useRef } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

const ChatInput = ({ onSendMessage, isTyping = false }: ChatInputProps) => {
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isTyping) {
      onSendMessage(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // --- AUDIO/VOICE ---
  const handleStartRecording = () => {
    setRecordingError(null);
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setRecordingError('Tu navegador no soporta reconocimiento de voz.');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'es-AR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsRecording(true);
    recognition.start();
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue(transcript);
      setIsRecording(false);
      setRecordingError(null);
      // Enviar automáticamente el mensaje transcripto
      if (transcript.trim()) {
        onSendMessage(transcript.trim());
        setValue("");
      }
    };
    recognition.onerror = (event: any) => {
      setIsRecording(false);
      setRecordingError('Error al grabar audio. Intentalo de nuevo.');
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/80 dark:bg-[#29131eeb] flex items-center py-2 px-3 md:px-10 border-t border-beige/60 backdrop-blur shadow-md">
      <form className="flex items-center w-full" onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribile algo a Lautaro…"
          className="flex-1 rounded-full px-5 py-3 border border-beige/50 bg-sand/60 dark:bg-[#311a25c9] text-vino text-base focus:outline-none focus:ring-2 focus:ring-coral transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
          autoComplete="off"
          disabled={isTyping}
        />
        {/* Botón de micrófono */}
        <button
          type="button"
          aria-label={isRecording ? "Detener grabación" : "Grabar audio"}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          className={`ml-2 px-4 py-3 rounded-full bg-vino text-beige font-bold shadow hover:scale-110 transition-all text-lg flex items-center focus:outline-none focus:ring-2 focus:ring-coral ${isRecording ? 'animate-pulse bg-coral text-vino' : ''}`}
          tabIndex={0}
        >
          {isRecording ? (
            <span className="flex items-center gap-1">🎤 <span className="text-xs">Grabando…</span></span>
          ) : (
            <span>🎤</span>
          )}
        </button>
        <button
          type="submit"
          aria-label="Enviar mensaje"
          disabled={isTyping || !value.trim()}
          className="ml-2 px-5 py-3 rounded-full bg-coral text-vino dark:bg-terracota dark:text-beige font-bold shadow hover:scale-105 hover:bg-vino hover:text-beige transition-all text-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-coral"
        >
          ✉️
        </button>
      </form>
      {recordingError && (
        <div className="ml-4 text-xs text-red-600">{recordingError}</div>
      )}
    </div>
  );
};

export default ChatInput;
