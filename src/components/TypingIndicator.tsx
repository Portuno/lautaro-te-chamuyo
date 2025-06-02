interface Props {
  className?: string;
}

const TypingIndicator = ({ className = "" }: Props) => {
  return (
    <div className={`flex items-end gap-2 mb-2 ${className}`}>
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral via-vino to-terracota flex items-center justify-center text-xl font-bold text-beige shadow shrink-0 mb-3">
        🤵‍♂️
      </div>
      <div className="bg-coral/80 px-4 py-2 rounded-3xl shadow">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-vino rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-vino rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-vino rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
