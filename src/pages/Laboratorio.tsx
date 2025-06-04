
import LaboratorioChamuyo from "@/components/LaboratorioChamuyo";
import NewsletterSubscription from "@/components/NewsletterSubscription";

const Laboratorio = () => {
  return (
    <div className="min-h-screen bg-sand">
      <LaboratorioChamuyo />
      
      {/* Newsletter section */}
      <div className="container mx-auto px-4 py-8">
        <NewsletterSubscription 
          sourcePage="laboratorio"
          title="¿Te gustó el Laboratorio de Chamuyo?"
          description="Suscríbete para recibir nuevos ejercicios, técnicas y actualizaciones del laboratorio."
        />
      </div>
    </div>
  );
};

export default Laboratorio;
