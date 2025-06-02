interface QuickAction {
  icon: string;
  label: string;
  message: string;
}

interface QuickActionsBarProps {
  onSendMessage?: (message: string) => void;
}

const QUICK_ACTIONS: QuickAction[] = [
  { 
    icon: "📝", 
    label: "Recordarme algo",
    message: "¿Me ayudás a recordar algo importante para hoy?"
  },
  { 
    icon: "🧠", 
    label: "Tirame una idea",
    message: "¿Me tirás una idea creativa para hacer algo diferente?"
  },
  { 
    icon: "😌", 
    label: "Decime algo lindo",
    message: "¿Me decís algo lindo para alegrarme el día?"
  },
  { 
    icon: "🧊", 
    label: "Mantenete tranqui",
    message: "¿Me ayudás a mantener la calma y relajarme un poco?"
  },
  { 
    icon: "😏", 
    label: "Ponete chamuyero",
    message: "Dale, ponete un poco chamuyero conmigo 😏"
  },
];

const QuickActionsBar = ({ onSendMessage }: QuickActionsBarProps) => {
  const handleActionClick = (action: QuickAction) => {
    if (onSendMessage) {
      onSendMessage(action.message);
    }
  };

  return (
    <div className="w-full flex gap-1 md:gap-2 px-2 py-2 md:px-8 justify-between bg-sand/80 dark:bg-[#2e1e21]/70 border-t border-beige/60 sticky bottom-16 z-10 overflow-x-auto">
      {QUICK_ACTIONS.map((action, i) => (
        <button
          key={action.label}
          onClick={() => handleActionClick(action)}
          className="flex flex-col items-center justify-center text-vino dark:text-beige text-xs md:text-sm px-1 md:px-2 py-1 md:py-2 rounded-lg hover:bg-coral/20 transition-all font-semibold hover:scale-105 active:scale-95 min-w-[60px] md:min-w-[80px] flex-shrink-0"
          type="button"
          title={`Enviar: "${action.message}"`}
        >
          <span className="text-lg md:text-xl mb-1">{action.icon}</span>
          <span className="text-[10px] md:text-xs leading-tight text-center">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActionsBar;
