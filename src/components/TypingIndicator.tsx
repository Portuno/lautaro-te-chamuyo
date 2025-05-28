
const TypingIndicator = () => (
  <div className="flex items-center gap-2 px-8 py-1 text-vino/60 dark:text-beige animate-fade-in mt-2">
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral via-vino to-terracota flex items-center justify-center text-xl font-bold text-beige shadow">🤵‍♂️</div>
    <div className="bg-sand/80 dark:bg-[#2c1a26] px-4 py-2 rounded-2xl relative flex items-center gap-2">
      <span className="font-medium tracking-tight" style={{letterSpacing: "0.04em"}}>Lautaro está escribiendo</span>
      <span className="inline-block">
        <span className="inline-block w-2 h-2 bg-terracota rounded-full animate-bounce mr-1" style={{animationDelay: "0s"}} />
        <span className="inline-block w-2 h-2 bg-terracota rounded-full animate-bounce mr-1" style={{animationDelay: "0.15s"}} />
        <span className="inline-block w-2 h-2 bg-terracota rounded-full animate-bounce" style={{animationDelay: "0.3s"}} />
      </span>
    </div>
  </div>
);

export default TypingIndicator;
