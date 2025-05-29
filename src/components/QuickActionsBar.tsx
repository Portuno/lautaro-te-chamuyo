const QUICK_ACTIONS = [
  { icon: "📝", label: "Recordarme algo" },
  { icon: "🧠", label: "Tirame una idea" },
  { icon: "😌", label: "Decime algo lindo" },
  { icon: "🧊", label: "Mantenete tranqui" },
  { icon: "😏", label: "Ponete chamuyero" },
];

const QuickActionsBar = () => (
  <div className="w-full flex gap-2 px-2 py-2 md:px-8 justify-between bg-sand/80 dark:bg-[#2e1e21]/70 border-t border-beige/60 sticky bottom-16 z-10">
    {QUICK_ACTIONS.map((a, i) => (
      <button
        key={a.label}
        className="flex flex-col items-center justify-center text-vino dark:text-beige text-sm px-2 py-1 rounded-lg hover:bg-coral/20 transition-all font-semibold"
        type="button"
        tabIndex={-1}
      >
        <span className="text-xl">{a.icon}</span>
        <span className="text-xs mt-1">{a.label}</span>
      </button>
    ))}
  </div>
);

export default QuickActionsBar;
