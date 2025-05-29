const PageFooter = () => (
  <footer className="bg-gradient-to-tr from-coral to-terracota text-beige py-10 mt-auto">
    <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto px-4 gap-4">
      <div className="flex flex-wrap gap-6 text-sm">
        <a href="#" className="underline hover:text-vino transition-colors">FAQ</a>
        <a href="#" className="underline hover:text-vino transition-colors">Contacto</a>
        <a href="#" className="underline hover:text-vino transition-colors">Instagram</a>
        <a href="#" className="underline hover:text-vino transition-colors">X</a>
      </div>
      <div className="text-center mt-6 md:mt-0 text-base font-semibold opacity-85 px-1">
        "No te vayas sin dejarme decirte lo linda que es tu sonrisa." — Lautaro
      </div>
    </div>
  </footer>
);

export default PageFooter;
