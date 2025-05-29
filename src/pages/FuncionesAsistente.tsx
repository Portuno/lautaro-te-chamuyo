
import { CheckCircle, UserCheck, AtSign, BookOpen, ClipboardList, CalendarDays, Globe2, MessageCircle, PiggyBank, Users, FileText, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  {
    title: "Soporte administrativo",
    icon: <ClipboardList className="text-coral mr-2" size={22} />,
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
    icon: <UserCheck className="text-vino mr-2" size={22} />,
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
    icon: <AtSign className="text-coral mr-2" size={22} />,
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
    icon: <BookOpen className="text-vino mr-2" size={22} />,
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
    icon: <Globe2 className="text-coral mr-2" size={22} />,
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
    icon: <CalendarDays className="text-vino mr-2" size={22} />,
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
    icon: <Layers className="text-coral mr-2" size={22} />,
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
    icon: <PiggyBank className="text-vino mr-2" size={22} />,
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
    icon: <Users className="text-coral mr-2" size={22} />,
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
    icon: <FileText className="text-vino mr-2" size={22} />,
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
    icon: <CheckCircle className="text-coral mr-2" size={22} />,
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
  <div className="bg-sand min-h-screen flex flex-col">
    <section className="w-full bg-gradient-to-br from-terracota to-coral py-14 px-4 flex flex-col items-center justify-center shadow-md rounded-b-3xl animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-beige drop-shadow font-quicksand text-center leading-tight" style={{letterSpacing: "-0.02em"}}>
        Todo lo que Lautaro puede hacer por vos
      </h1>
      <p className="text-xl text-beige mb-2 text-center max-w-2xl font-quicksand">
        No solo es eficiente: Lautaro te acompaña todo el día con calidez y una vuelta porteña que te saca una sonrisa, incluso cuando hay mucho por hacer.
      </p>
      <p className="text-lg text-beige mb-2 text-center max-w-xl font-quicksand opacity-90">
        Conocé cada una de sus funciones pensadas para facilitarte la vida en el trabajo, en casa o en el día a día.
      </p>
    </section>

    <section className="flex-1 w-full max-w-4xl mx-auto px-4 py-12">
      <div className="grid gap-10">
        {CATEGORIES.map((cat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-7 md:p-9 border border-beige animate-fade-in">
            <div className="flex items-center mb-2">
              {cat.icon}
              <h2 className="text-2xl font-bold text-vino font-quicksand">{cat.title}</h2>
            </div>
            <ul className="list-disc ml-8 text-vino/95 text-base mb-5 space-y-1">
              {cat.tasks.map((task, j) => (
                <li key={j}>{task}</li>
              ))}
            </ul>
            <div className="bg-sand/60 rounded-xl px-4 py-3 flex flex-col sm:flex-row gap-3 items-start mb-2">
              <div className="flex items-start gap-2 flex-1">
                <div className="w-7 h-7 rounded-full bg-coral flex items-center justify-center font-bold text-beige text-lg">Vos</div>
                <div className="rounded-xl px-2 py-1 bg-beige text-vino text-sm flex-1">{cat.example.user}</div>
              </div>
              <div className="flex items-start gap-2 flex-1">
                <div className="w-7 h-7 rounded-full bg-vino flex items-center justify-center font-bold text-beige text-lg">L</div>
                <div className="rounded-xl px-2 py-1 bg-sand text-terracota text-sm flex-1">{cat.example.lautaro}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-14">
        <Button
          asChild
          className="bg-vino hover:bg-terracota transition-colors px-10 py-5 rounded-full text-beige text-lg font-semibold shadow-lg hover:scale-105 font-quicksand text-xl"
        >
          <a href="/#demo">
            Probalo gratis
          </a>
        </Button>
      </div>
    </section>
  </div>
);

export default FuncionesAsistente;
