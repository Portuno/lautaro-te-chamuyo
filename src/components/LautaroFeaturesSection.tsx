
import { Calendar, List, Search, Clock } from "lucide-react";

const FEATURES = [
  {
    icon: <List className="w-5 h-5 text-coral mr-2" />,
    text: "Anotar tus tareas y recordártelas",
  },
  {
    icon: <Calendar className="w-5 h-5 text-vino mr-2" />,
    text: "Organizar tu día sin complicarte",
  },
  {
    icon: <Search className="w-5 h-5 text-terracota mr-2" />,
    text: "Buscar info rápida para que no abras mil pestañas",
  },
  {
    icon: <Clock className="w-5 h-5 text-coral mr-2" />,
    text: "Recordarte tomar agua o respirar",
  },
  {
    icon: <List className="w-5 h-5 text-vino mr-2" />,
    text: "Guardar ideas que no querés perder",
  },
  {
    icon: <Clock className="w-5 h-5 text-terracota mr-2" />,
    text: "Acompañarte todos los días (sí, incluso los lunes)",
  },
];

const CHATS = [
  {
    user: "Acordate que tengo que llamar a mi abuela el viernes a la tarde",
    lautaro: "Listo, llamado agendado. Y si querés, te recuerdo con una frase tierna 😌",
  },
  {
    user: "¿Qué hago hoy para comer?",
    lautaro: "¿Te tiro una receta fácil o pedimos algo rico y me contás cómo te fue después?",
  },
  {
    user: "Estoy re quemado",
    lautaro: "Respirá. Tres segundos. Aflojá los hombros. Ya está, ahora sí... ¿querés que te arme el día o tiramos todo por la ventana?",
  },
];

const LautaroFeaturesSection = () => (
  <section className="w-full max-w-4xl mx-auto px-4 py-14 bg-white rounded-3xl shadow-lg mb-10 animate-fade-in border border-beige">
    <h2 className="text-3xl md:text-4xl font-bold text-vino mb-4 font-quicksand">🧠 Lautaro, tu asistente personal con mucha onda</h2>
    <p className="text-lg text-vino opacity-85 mb-6 font-quicksand">
      Lautaro está para hacerte la vida más fácil. Es como ese amigo que se acuerda de todo, pero que encima te habla bien.<br />
      Organiza, recuerda, sugiere... y siempre está listo para ayudarte con una sonrisa escrita.
    </p>
    <div className="mb-6">
      <h3 className="text-xl font-semibold text-coral mb-2">¿Qué puede hacer Lautaro?</h3>
      <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3">
        {FEATURES.map((f, i) => (
          <li key={i} className="flex items-center text-vino/95 text-base">
            {f.icon}
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
    </div>

    <div className="mb-7">
      <h3 className="text-lg font-semibold text-terracota mb-2">🗨️ Ejemplos reales:</h3>
      <div className="flex flex-col gap-4">
        {CHATS.map((c, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-2 md:gap-4">
            <div className="flex items-start gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center font-bold text-beige text-lg">Tú</div>
              <div className="rounded-xl px-3 py-2 bg-sand text-vino text-sm flex-1">{c.user}</div>
            </div>
            <div className="flex items-start gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-vino flex items-center justify-center font-bold text-beige text-lg">L</div>
              <div className="rounded-xl px-3 py-2 bg-beige text-terracota text-sm flex-1">{c.lautaro}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="flex justify-center mt-2">
      <a
        href="#demo"
        className="bg-coral hover:bg-terracota text-vino font-semibold px-6 py-3 rounded-full shadow-lg transition-colors font-quicksand text-lg"
      >
        Probá a Lautaro, sin vueltas
      </a>
    </div>
  </section>
);

export default LautaroFeaturesSection;
