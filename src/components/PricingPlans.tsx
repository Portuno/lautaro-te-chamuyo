
const plans = [
  {
    name: "Freemium",
    price: "Gratis",
    perks: [
      "5 mensajes diarios",
      "Acceso básico a Lautaro",
      "Ayuda diaria y frases regulares",
    ],
    featured: false,
  },
  {
    name: "Premium",
    price: "$999/mes",
    perks: [
      "+ funciones desbloqueadas",
      "Chamuyo personalizado para vos",
      "Voz realista & memoria",
      "Soporte preferencial",
    ],
    featured: true,
  },
];

const PricingPlans = () => (
  <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl" id="planes">
    {plans.map((plan, ix) => (
      <div
        key={plan.name}
        className={`flex-1 rounded-2xl shadow-xl p-8 flex flex-col items-center border-2
        ${plan.featured ? "border-vino bg-coral text-vino scale-105" : "border-terracota bg-white text-vino"}
        hover:scale-105 transition-transform relative animate-fade-in`}
        style={{ animationDelay: `${0.3 + ix * 0.12}s` }}
      >
        <div className="text-2xl font-bold mb-2 font-quicksand">{plan.name}</div>
        <div className={`text-3xl font-bold mb-6 ${
          plan.featured ? "text-vino" : "text-terracota"
        }`}
        >{plan.price}</div>
        <ul className="flex flex-col gap-2 mb-8">
          {plan.perks.map((perk, k) => (
            <li key={k} className={`pl-2 relative before:content-['♥'] before:absolute before:-left-6 before:text-coral before:text-lg ${plan.featured ? "text-vino" : "text-terracota"}`}>
              {perk}
            </li>
          ))}
        </ul>
        <button className={`mt-auto px-6 py-2 rounded-full font-semibold transition-colors shadow 
          ${
            plan.featured
              ? "bg-vino text-beige hover:bg-terracota hover:text-vino"
              : "bg-terracota text-beige hover:bg-vino"
          }
          `}
        >
          {plan.featured ? "Elegir Premium" : "Seguir con Freemium"}
        </button>
        {plan.featured && <span className="absolute top-3 right-4 bg-vino text-beige text-xs px-3 py-1 rounded-full animate-pulse">+ Picante</span>}
      </div>
    ))}
  </div>
);

export default PricingPlans;
