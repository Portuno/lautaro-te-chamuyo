
import { useState } from "react";

const ChatInput = () => {
  const [value, setValue] = useState("");
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 bg-white/80 dark:bg-[#29131eeb] flex items-center py-2 px-3 md:px-10 border-t border-beige/60 backdrop-blur shadow-md">
      <form className="flex items-center w-full" onSubmit={e => { e.preventDefault(); setValue(""); }}>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Escribile algo a Lautaro…"
          className="flex-1 rounded-full px-5 py-3 border border-beige/50 bg-sand/60 dark:bg-[#311a25c9] text-vino text-base focus:outline-none focus:ring-2 focus:ring-coral transition-all shadow"
          autoComplete="off"
        />
        <button
          type="submit"
          aria-label="Enviar mensaje"
          className="ml-2 px-5 py-3 rounded-full bg-coral text-vino dark:bg-terracota dark:text-beige font-bold shadow hover:scale-105 hover:bg-vino hover:text-beige transition-all text-lg flex items-center"
        >
          ✉️
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
