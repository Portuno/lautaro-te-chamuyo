
import LautaroDemo from "@/components/LautaroDemo";
import ExperiencePaths from "@/components/ExperiencePaths";
import Testimonials from "@/components/Testimonials";
import PricingPlans from "@/components/PricingPlans";
import PageFooter from "@/components/PageFooter";
import LautaroFeaturesSection from "@/components/LautaroFeaturesSection";
import MomentoLautaro from "@/components/MomentoLautaro";

const Index = () => {
  return (
    <div className="bg-sand min-h-screen flex flex-col">
      {/* Hero - Encabezado */}
      <section className="w-full bg-gradient-to-br from-terracota to-coral py-16 px-4 flex flex-col items-center justify-center shadow-md rounded-b-3xl animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-beige drop-shadow font-quicksand text-center leading-tight" style={{letterSpacing: "-0.02em"}}>
          “¿Ya te dijeron hoy lo increíble que sos?”
        </h1>
        <p className="text-xl text-beige mb-10 text-center max-w-xl">
          Lautaro es tu asistente argentino: te ayuda, te chamuya y hace que cada día tenga un poco más de magia.
        </p>
        <a href="#demo" className="bg-vino hover:bg-terracota transition-colors px-8 py-4 mt-2 rounded-full text-beige text-lg font-semibold shadow-lg hover:scale-105 inline-block animate-fade-in font-quicksand">
          Conocé a Lautaro
        </a>
        <a
          href="/funciones"
          className="mt-4 bg-coral hover:bg-vino text-vino hover:text-beige font-semibold px-8 py-3 rounded-full shadow-lg transition-colors font-quicksand text-lg"
        >
          Ver todas las funciones como asistente
        </a>
        <a
          href="/chat"
          className="mt-4 bg-vino hover:bg-coral text-beige hover:text-vino font-semibold px-8 py-3 rounded-full shadow-lg transition-colors font-quicksand text-lg"
        >
          Hablá con Lautaro
        </a>
      </section>

      {/* Mini demo interactiva */}
      <section id="demo" className="flex flex-col items-center py-16 px-4 bg-beige">
        <h2 className="text-3xl font-bold text-vino mb-6">Probá un poco su magia</h2>
        <LautaroDemo />
      </section>

      {/* NUEVA SECCIÓN: Funciones Clave */}
      <LautaroFeaturesSection />

      {/* Dos caminos visuales */}
      <section className="flex flex-col items-center py-14 px-4 bg-sand">
        <ExperiencePaths />
      </section>

      {/* Testimonios */}
      <section className="flex flex-col items-center py-14 px-4 bg-beige">
        <Testimonials />
      </section>

      {/* Planes */}
      <section className="flex flex-col items-center py-14 px-4 bg-sand">
        <PricingPlans />

        {/* Momento Lautaro antes del último CTA */}
        <div className="w-full mt-10 mb-2 max-w-3xl">
          <MomentoLautaro />
        </div>

        <a href="#planes" className="mt-8 bg-vino hover:bg-terracota transition-colors px-8 py-4 rounded-full text-beige text-lg font-semibold shadow-lg hover:scale-105 animate-fade-in font-quicksand">
          Desbloqueá el modo Chamuyo Maestro
        </a>
      </section>

      {/* Footer */}
      <PageFooter />
    </div>
  );
};

export default Index;

