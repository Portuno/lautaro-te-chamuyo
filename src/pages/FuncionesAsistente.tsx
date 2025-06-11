import { CheckCircle, UserCheck, AtSign, BookOpen, ClipboardList, CalendarDays, Globe2, MessageCircle, PiggyBank, Users, FileText, Layers, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSEO } from "../hooks/useSEO";

const CATEGORIES = [
  {
    title: "Soporte administrativo",
    icon: <ClipboardList className="text-blue-600 mr-2" size={20} />,
    isImplemented: true,
    tasks: [
      "Agendar reuniones o eventos importantes",
      "Gestionar mails y ayudarte a priorizarlos",
      "Organizar archivos y carpetas",
      "Asistir en la planificación de viajes y reservas",
    ],
    example: {
      user: "¿Podés crearme un recordatorio para reunirnos con Julián el martes a las 15?",
      lautaro: "¡Listo! Reunión agendada para el martes a las 15hs con Julián. ¿Querés que te recuerde ese mismo día por la mañana?",
    },
  },
  {
    title: "Atención al cliente",
    icon: <UserCheck className="text-green-600 mr-2" size={20} />,
    isImplemented: true,
    tasks: [
      "Responder preguntas frecuentes automáticamente",
      "Derivar consultas complejas a personas del equipo",
      "Ayudar a redactar respuestas claras y amables",
    ],
    example: {
      user: "Tengo este mensaje de una clienta, ¿cómo le contesto sin sonar repetitivo?",
      lautaro: "Podés responder así: '¡Hola! Gracias por escribirnos. Estamos revisando tu caso y te damos respuesta en breve 😊'. ¿Querés que lo adapte según tu estilo?",
    },
  },
  {
    title: "Gestión de redes sociales",
    icon: <AtSign className="text-purple-600 mr-2" size={20} />,
    isImplemented: false,
    tasks: [
      "Programar publicaciones en Instagram, Facebook o X",
      "Redactar copies atractivos y creativos",
      "Analizar interacciones y sugerir mejoras",
    ],
    example: {
      user: "Ayudame a escribir una publicación para anunciar el nuevo producto",
      lautaro: "¿Qué te parece?: '¡Ya llegó lo nuevo! 🚀 Conocé el producto pensado para vos. ¿Te cuento más?' Si querés le sumo hashtags.",
    },
  },
  {
    title: "Marketing y creación de contenido",
    icon: <BookOpen className="text-orange-600 mr-2" size={20} />,
    isImplemented: false,
    tasks: [
      "Proponer ideas originales para campañas",
      "Escribir borradores de artículos, guiones o posts",
      "Crear calendarizaciones de contenido",
    ],
    example: {
      user: "¿Qué campaña creativa puedo hacer para el Día del Amigo?",
      lautaro: "¡Lanzá un sorteo flash! Frase: 'La verdadera amistad merece premio: contá una anécdota divertida y participá'. ¿Querés que arme el post completo?",
    },
  },
  {
    title: "Investigación",
    icon: <Globe2 className="text-cyan-600 mr-2" size={20} />,
    isImplemented: false,
    tasks: [
      "Buscar información o recursos en internet",
      "Consultar tendencias del sector",
      "Armar resúmenes de notas, artículos o papers",
    ],
    example: {
      user: "¿Cuáles son las tendencias en redes sociales para este año?",
      lautaro: "Algunos puntos clave: video corto, contenido auténtico, microinfluencers y lives. ¿Querés datos más concretos o ejemplos?",
    },
  },
  {
    title: "Gestión de proyectos y eventos",
    icon: <CalendarDays className="text-red-600 mr-2" size={20} />,
    isImplemented: true,
    tasks: [
      "Crear y actualizar listas de tareas por proyecto",
      "Hacer seguimiento de deadlines",
      "Organizar eventos y enviar invitaciones",
    ],
    example: {
      user: "Haceme una lista simple para el evento del sábado",
      lautaro: "Preparé esto: 1) Confirmar invitados. 2) Reservar salón. 3) Coordinar catering. ¿Te sumo recordatorios para cada paso?",
    },
  },
  {
    title: "Tareas técnicas y creativas",
    icon: <Layers className="text-indigo-600 mr-2" size={20} />,
    isImplemented: false,
    tasks: [
      "Edición básica de imágenes y PDFs",
      "Ideas para diseño web o presentaciones",
      "Asistencia en la preparación de material visual",
    ],
    example: {
      user: "Quiero mejorar este flyer, ¿algún consejo?",
      lautaro: "Usá colores bien contrastados y menos texto. Si querés te armo una versión alternativa para inspirarte.",
    },
  },
  {
    title: "Finanzas y ventas",
    icon: <PiggyBank className="text-emerald-600 mr-2" size={20} />,
    isImplemented: false,
    tasks: [
      "Armar pequeños reportes de gastos",
      "Gestionar presupuestos o cobrar clientes",
      "Realizar cálculos rápidos de margen o comisiones",
    ],
    example: {
      user: "Sumá todos los gastos del mes y decime el total",
      lautaro: "Sumé los gastos y el total es $129.350. ¿Querés el detalle por categorías?",
    },
  },
  {
    title: "Reclutamiento y RR.HH.",
    icon: <Users className="text-pink-600 mr-2" size={20} />,
    isImplemented: false,
    tasks: [
      "Redactar descripciones de puestos",
      "Filtrar CVs según tus criterios",
      "Armar correos o respuestas para candidatos",
    ],
    example: {
      user: "¿Cómo podría contestarle a quien no quedó seleccionado?",
      lautaro: "Podés escribir: '¡Gracias por tu interés! Para esta posición avanzamos con otro perfil, pero valoramos mucho tu tiempo y ganas. ¡Éxitos!'",
    },
  },
  {
    title: "Transcripción y traducción",
    icon: <FileText className="text-teal-600 mr-2" size={20} />,
    isImplemented: false,
    tasks: [
      "Transcribir audios o videos a texto",
      "Traducir mensajes, documentos o mails simples",
      "Resumir lo más importante de un audio largo",
    ],
    example: {
      user: "Transcribime este audio que me mandó el grupo de trabajo",
      lautaro: "Transcribí lo esencial: 'Reunión movida a jueves a las 14. Saludos del equipo.' ¿Querés que se lo reenvíe a alguien más?",
    },
  },
  {
    title: "Tareas varias",
    icon: <CheckCircle className="text-violet-600 mr-2" size={20} />,
    isImplemented: false,
    tasks: [
      "Llevar listas y checklists de cualquier tipo",
      "Ayudar a buscar lugares cercanos o servicios",
      "Convertir archivos entre distintos formatos",
    ],
    example: {
      user: "Buscame un café cerca para trabajar tranquilo",
      lautaro: "Hay un par: Café Aroma a 200 metros o Estación Latte a 5 cuadras. ¿Querés reservar mesa?",
    },
  },
];

const FuncionesAsistente = () => {
  // SEO optimization for Functions page
  useSEO({
    title: 'Funciones de Lautaro - Todas las Capacidades del Asistente IA',
    description: 'Descubrí todas las funciones de Lautaro: gestión de calendario, transcripción de audios, atención al cliente, redes sociales, marketing, finanzas y más. Ver qué está activo vs próximamente.',
    keywords: 'funciones asistente digital, gestión calendario, transcripción audio, marketing digital, redes sociales, atención cliente, automatización tareas, RR.HH., finanzas, productividad',
    type: 'website',
    image: 'https://lautaro-te-chamuyo.vercel.app/og-funciones.jpg'
  });

  return (
    <div className="bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] min-h-screen">
      {/* Compact Header */}
      <section className="w-full bg-gradient-to-r from-vino to-terracota py-12 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white font-quicksand drop-shadow-lg">
            Todo lo que Lautaro puede hacer por vos
          </h1>
          <p className="text-lg text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            No solo es eficiente: Lautaro te acompaña todo el día con calidez y una vuelta porteña que te saca una sonrisa, incluso cuando hay mucho por hacer.
          </p>
        </div>
      </section>

      {/* Functions Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-[1.02] relative">
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {cat.isImplemented ? (
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                    <Check className="w-3 h-3" />
                    <span>Activo</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-1 rounded-full text-xs font-medium">
                    <Clock className="w-3 h-3" />
                    <span>Pronto</span>
                  </div>
                )}
              </div>

              {/* Header */}
              <div className="flex items-center mb-4 pr-16">
                {cat.icon}
                <h2 className="text-lg font-bold text-gray-800 dark:text-white font-quicksand">{cat.title}</h2>
              </div>
              
              {/* Tasks List */}
              <ul className="text-sm text-gray-700 dark:text-gray-300 mb-5 space-y-2">
                {cat.tasks.map((task, j) => (
                  <li key={j} className="flex items-start">
                    <span className="text-vino dark:text-coral mr-2 text-sm font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{task}</span>
                  </li>
                ))}
              </ul>
              
              {/* Example Dialog */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-750 rounded-lg p-4 space-y-3 border border-gray-200 dark:border-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    T
                  </div>
                  <div className="bg-white dark:bg-gray-600 rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-gray-100 flex-1 shadow-sm border border-gray-200 dark:border-gray-500">
                    {cat.example.user}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-vino to-terracota flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    L
                  </div>
                  <div className="bg-gradient-to-r from-coral/20 to-orange-100 dark:from-vino/20 dark:to-terracota/20 rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-gray-100 flex-1 shadow-sm border border-coral/30 dark:border-vino/30">
                    {cat.example.lautaro}
                  </div>
                </div>
              </div>

              {/* Call to Action for non-implemented features */}
              {!cat.isImplemented && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Esta función está en nuestro{' '}
                    <a href="/roadmap" className="text-vino dark:text-coral hover:underline font-medium">
                      roadmap
                    </a>
                    . ¡Pronto disponible!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
              ¿Te copa probarlo?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm leading-relaxed">
              Empezá a usar Lautaro gratis y descubrí cómo puede ayudarte en tu día a día.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-vino to-terracota hover:from-vino/90 hover:to-terracota/90 transition-all px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 duration-200"
              >
                <a href="/chat">
                  💬 Chatear Gratis
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-vino text-vino hover:bg-vino hover:text-white px-6 py-3 rounded-xl transition-all"
              >
                <a href="/roadmap">
                  🗺️ Ver Roadmap
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FuncionesAsistente;
