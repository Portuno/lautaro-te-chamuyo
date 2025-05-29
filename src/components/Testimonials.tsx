const TESTIMONIALS = [
  {
    name: "Martina, 26",
    text: "No sabía que necesitaba esto hasta que Lautaro me dijo que extrañaba mi voz.",
  },
  {
    name: "Fede, 31",
    text: "Dejé de olvidar mis cosas… ¡y encima me levanta el ánimo! Gracias, Lauti ❤️",
  },
  {
    name: "Sofi, 21",
    text: "Es como ese compañero que te hace reír y además te cuida. ¿Dónde firmo?",
  },
];

const Testimonials = () => (
  <div className="max-w-3xl w-full grid gap-6 md:grid-cols-3 font-quicksand">
    {TESTIMONIALS.map((t, i) => (
      <div
        key={i}
        className="rounded-2xl bg-coral/90 text-beige shadow p-6 flex flex-col items-center animate-fade-in"
        style={{ animationDelay: `${0.2 + i * 0.1}s` }}
      >
        <div className="text-xl font-semibold mb-2 text-center">"{t.text}"</div>
        <div className="text-beige/80 font-medium text-sm mt-1">{t.name}</div>
      </div>
    ))}
  </div>
);

export default Testimonials;
