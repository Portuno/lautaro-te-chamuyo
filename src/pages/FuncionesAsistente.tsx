import { CheckCircle, UserCheck, AtSign, BookOpen, ClipboardList, CalendarDays, Globe2, MessageCircle, PiggyBank, Users, FileText, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  {
    title: "Soporte administrativo",
    icon: <ClipboardList className="text-coral mr-2" size={20} />,
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
    icon: <UserCheck className="text-vino mr-2" size={20} />,
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
    icon: <AtSign className="text-coral mr-2" size={20} />,
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
    icon: <BookOpen className="text-vino mr-2" size={20} />,
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
    icon: <Globe2 className="text-coral mr-2" size={20} />,
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
    icon: <CalendarDays className="text-vino mr-2" size={20} />,
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
    icon: <Layers className="text-coral mr-2" size={20} />,
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
    icon: <PiggyBank className="text-vino mr-2" size={20} />,
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
    icon: <Users className="text-coral mr-2" size={20} />,
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
    icon: <FileText className="text-vino mr-2" size={20} />,
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
    icon: <CheckCircle className="text-coral mr-2" size={20} />,
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

const FuncionesAsistente = () => (
  <div className="bg-gradient-to-br from-beige via-sand to-[#ffd6c0] dark:from-[#201016] dark:to-[#442134] min-h-screen">
    {/* Compact Header */}
    <section className="w-full bg-gradient-to-r from-vino to-terracota py-12 px-4 shadow-lg">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-beige font-quicksand">
          Todo lo que Lautaro puede hacer por vos
        </h1>
        <p className="text-lg text-beige/90 max-w-2xl mx-auto leading-relaxed">
          No solo es eficiente: Lautaro te acompaña todo el día con calidez y una vuelta porteña que te saca una sonrisa, incluso cuando hay mucho por hacer.
        </p>
      </div>
    </section>

    {/* Functions Grid */}
    <section className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat, i) => (
          <div key={i} className="bg-white/95 dark:bg-[#2e1e21]/95 rounded-xl shadow-lg p-5 border border-gray-100 dark:border-gray-700 backdrop-blur-sm hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
            {/* Header */}
            <div className="flex items-center mb-3">
              {cat.icon}
              <h2 className="text-lg font-bold text-vino dark:text-beige font-quicksand">{cat.title}</h2>
            </div>
            
            {/* Tasks List */}
            <ul className="text-sm text-gray-700 dark:text-gray-300 mb-4 space-y-1">
              {cat.tasks.map((task, j) => (
                <li key={j} className="flex items-start">
                  <span className="text-coral mr-2 text-xs mt-1">•</span>
                  <span>{task}</span>
                </li>
              ))}
            </ul>
            
            {/* Example Dialog */}
            <div className="bg-gray-50 dark:bg-[#3e2e31] rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-coral flex items-center justify-center text-white text-xs font-bold">V</div>
                <div className="bg-white dark:bg-[#4e3e41] rounded-lg px-2 py-1 text-xs text-gray-700 dark:text-gray-300 flex-1">
                  {cat.example.user}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-vino flex items-center justify-center text-white text-xs font-bold">L</div>
                <div className="bg-sand dark:bg-[#5e4e51] rounded-lg px-2 py-1 text-xs text-terracota dark:text-beige flex-1">
                  {cat.example.lautaro}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-12">
        <div className="bg-white/90 dark:bg-[#2e1e21]/90 rounded-2xl shadow-xl p-8 max-w-md mx-auto backdrop-blur-sm">
          <h3 className="text-xl font-bold text-vino dark:text-beige mb-3">
            ¿Te copa probarlo?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-5 text-sm">
            Empezá a usar Lautaro gratis y descubrí cómo puede ayudarte en tu día a día.
          </p>
          <Button
            asChild
            className="bg-vino hover:bg-terracota transition-all px-8 py-3 rounded-xl text-white font-semibold shadow-lg hover:scale-105 duration-200"
          >
            <a href="/#demo">
              Probalo gratis
            </a>
          </Button>
        </div>
      </div>
    </section>
  </div>
);

export default FuncionesAsistente;
