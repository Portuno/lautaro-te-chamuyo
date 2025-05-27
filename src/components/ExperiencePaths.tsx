
import { Heart, ArrowUp, ArrowDown } from "lucide-react";

const items = [
  {
    id: "ayuda",
    title: "Quiero que me ayude",
    desc: "Agenda, recordatorios y las ideas más ingeniosas de tu día. Lautaro organiza, sugiere y te da el envión que necesitás.",
    icon: ArrowUp,
    color: "bg-terracota",
    href: "#planes",
  },
  {
    id: "mime",
    title: "Quiero que me mime",
    desc: "Frases lindas, compañía incondicional y esa pizca de picardía. Descubrí cómo Lautaro conecta y te hace sentir especial.",
    icon: Heart,
    color: "bg-coral",
    href: "#planes",
  },
];

const ExperiencePaths = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className={`flex-1 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-3 hover:scale-105 transition-transform border-2 border-terracota bg-white group`}
        >
          <div className={`w-14 h-14 ${item.color} rounded-full flex items-center justify-center shadow-md mb-2`}>
            <item.icon size={36} className="text-beige" />
          </div>
          <h3 className="text-2xl font-bold text-vino group-hover:text-terracota font-quicksand">{item.title}</h3>
          <p className="text-vino text-base opacity-80 text-center">{item.desc}</p>
        </a>
      ))}
    </div>
  );
};

export default ExperiencePaths;
