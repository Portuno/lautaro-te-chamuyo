import { useState } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

const ChatInput = ({ onSendMessage, isTyping = false }: ChatInputProps) => {
  const [value, setValue] = useState("");

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
        <button
          type="submit"
          aria-label="Enviar mensaje"
          disabled={isTyping || !value.trim()}
          className="ml-2 px-5 py-3 rounded-full bg-coral text-vino dark:bg-terracota dark:text-beige font-bold shadow hover:scale-105 hover:bg-vino hover:text-beige transition-all text-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-coral"
        >
          ✉️
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
