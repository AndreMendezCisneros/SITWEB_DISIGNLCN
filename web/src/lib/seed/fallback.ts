import type {
  AboutSection,
  Banner,
  Certification,
  Client,
  CoverageRegion,
  HomeStat,
  Project,
  Service,
  SiteSettings,
} from "@/types/database";

export const fallbackSettings: SiteSettings = {
  id: 1,
  company_name: "Luque Construcción y Servicios",
  company_short: "LCS",
  email: "contactenos@lcs.pe",
  phone: "917 697 815",
  address:
    "Av. Manuel Olguín 335, Edificio Link Tower — Oficina 901, Surco",
  website: "https://www.lcs.pe",
  general_manager: "Jorge Luis Luque Solis",
  social: {},
  updated_at: new Date().toISOString(),
};

export const fallbackBanners: Banner[] = [
  {
    id: "1",
    title: "Construimos soluciones, creamos futuro",
    subtitle:
      "Ejecutamos proyectos de construcción, infraestructura y mantenimiento con enfoque en calidad, seguridad y cumplimiento de plazos, brindando soluciones confiables en cada etapa de la obra.",
    cta_label: "Cotiza tu proyecto",
    cta_href: "/contacto",
    image_url: null,
    placement: "home.hero",
    sort_order: 1,
    status: "published",
  },
];

export const fallbackStats: HomeStat[] = [
  { id: "1", label: "Años construyendo futuro", value: "10+", sort_order: 1, status: "published" },
  { id: "2", label: "Regiones con presencia", value: "6", sort_order: 2, status: "published" },
  { id: "3", label: "Proyectos públicos documentados", value: "7+", sort_order: 3, status: "published" },
  { id: "4", label: "Enfoque operativo", value: "Calidad y seguridad", sort_order: 4, status: "published" },
];

/** Bloque tipo “trabajos realizados” (referencia P&M), con datos LCS. */
export const workHighlights = [
  { label: "Obras de edificación y rehabilitación", value: "Educación, mercados y equipamiento" },
  { label: "Infraestructura vial y bermas", value: "Mezcla asfáltica y accesos" },
  { label: "Prevención de riesgos", value: "Muros de contención" },
  { label: "Infraestructura deportiva", value: "Callao y Talara" },
  { label: "Saneamiento y limpieza pública", value: "Trujillo y afines" },
  { label: "Contratos con entidades públicas", value: "Municipios y gobierno regional" },
  { label: "Cobertura nacional selectiva", value: "Lima, Callao, La Libertad, Moquegua, Piura" },
  { label: "Gestión integral de obra", value: "Planificación, ejecución y cierre" },
] as const;

export const fallbackAbout: AboutSection[] = [
  {
    id: "1",
    key: "historia",
    title: "Quiénes somos",
    body: "Somos una empresa peruana que nació con la idea de desarrollarse en la industria de la construcción, diferenciándose por la optimización constante en los procesos constructivos de diversos proyectos que hacen posible el desarrollo de nuestro país.\n\nEjecutamos obras de edificaciones, saneamiento, viales, electromecánicas, telecomunicaciones, irrigación y afines, con un equipo comprometido con la excelencia técnica y la responsabilidad social.",
    image_url: null,
    sort_order: 1,
    status: "published",
  },
  {
    id: "2",
    key: "mision",
    title: "Nuestra misión",
    body: "Ofrecer a nuestros clientes los mejores servicios y productos mediante una constante búsqueda de desarrollo de proyectos con las más altas especificaciones en diseño y construcción, impulsando el desarrollo urbano, industrial y social en el sector construcción.",
    image_url: null,
    sort_order: 2,
    status: "published",
  },
  {
    id: "3",
    key: "vision",
    title: "Nuestra visión",
    body: "Ser reconocidos en el mercado nacional e internacional como una empresa constructora que ejecuta proyectos de calidad, distinguida por brindar soluciones integrales innovadoras, demostrando responsabilidad, ética y confianza en cada obra que desarrollamos.",
    image_url: null,
    sort_order: 3,
    status: "published",
  },
  {
    id: "4",
    key: "valores",
    title: "Nuestros valores",
    body: "Calidad — Sostenibilidad — Compromiso.\n\nConstruimos un futuro mejor a través del desarrollo y la operación de infraestructuras que contribuyen al progreso económico y social en los lugares donde estamos presentes.",
    image_url: null,
    sort_order: 4,
    status: "published",
  },
];

export const fallbackServices: Service[] = [
  {
    id: "1",
    title: "Obras de edificación",
    description:
      "Ejecución de edificaciones y rehabilitaciones cumpliendo especificaciones técnicas, normativas y estándares de seguridad. Ideal para infraestructura educativa, comercial y de uso público.",
    image_url: null,
    sort_order: 1,
    status: "published",
  },
  {
    id: "2",
    title: "Sistemas urbanos",
    description:
      "Soluciones urbanas integrales que mejoran la calidad de vida: espacios públicos, equipamiento y obras que ordenan el crecimiento de ciudades y distritos.",
    image_url: null,
    sort_order: 2,
    status: "published",
  },
  {
    id: "3",
    title: "Vías de acceso",
    description:
      "Construcción y rehabilitación de infraestructura vial, bermas y accesos con enfoque en durabilidad, seguridad vial y continuidad del servicio.",
    image_url: null,
    sort_order: 3,
    status: "published",
  },
  {
    id: "4",
    title: "Contratos municipales",
    description:
      "Ejecución de obras bajo estándares normativos municipales y regionales, con capacidad de gestión técnica, documental y de plazos frente a entidades públicas.",
    image_url: null,
    sort_order: 4,
    status: "published",
  },
  {
    id: "5",
    title: "Obras de saneamiento",
    description:
      "Infraestructura de agua, saneamiento y servicios ambientales para comunidades, incluyendo intervenciones de limpieza pública y disposición final cuando el alcance lo requiere.",
    image_url: null,
    sort_order: 5,
    status: "published",
  },
  {
    id: "6",
    title: "Obras hidráulicas",
    description:
      "Proyectos hidráulicos con ingeniería especializada, orientados a controlar riesgos, optimizar recursos hídricos y proteger zonas vulnerables.",
    image_url: null,
    sort_order: 6,
    status: "published",
  },
  {
    id: "7",
    title: "Obras hidroenergéticas",
    description:
      "Participación en infraestructura hidroenergética y afines, aportando capacidad constructiva y coordinación multidisciplinaria.",
    image_url: null,
    sort_order: 7,
    status: "published",
  },
  {
    id: "8",
    title: "Consultoría y suministro",
    description:
      "Prestación de servicios, suministro de bienes y consultoría para complementar la ejecución de obra y fortalecer la toma de decisiones técnicas del cliente.",
    image_url: null,
    sort_order: 8,
    status: "published",
  },
];

export const fallbackProjects: Project[] = [
  {
    id: "1",
    name: "Rehabilitación IE N°20158 - Dos de Mayo",
    slug: "ie-20158-mala",
    category: "Educación",
    location: "Distrito de Mala, Cañete, Lima",
    client_name: null,
    entity: "Municipalidad Distrital de Mala",
    year: 2021,
    amount: 3055253.92,
    duration_days: 180,
    condition: "Ejecutada",
    description:
      "Rehabilitación de los servicios educativos de la Institución Educativa N°20158. Intervención integral orientada a recuperar condiciones de infraestructura para la comunidad educativa, con plazos y estándares de obra pública.",
    image_url: null,
    featured: true,
    sort_order: 1,
    status: "published",
  },
  {
    id: "2",
    name: "Construcción del Mercado de Abastos",
    slug: "mercado-el-algarrobal",
    category: "Equipamiento urbano",
    location: "El Algarrobal, Ilo, Moquegua",
    client_name: null,
    entity: "Municipalidad Distrital de El Algarrobal",
    year: 2022,
    amount: 7505000,
    duration_days: 180,
    condition: "Ejecutada",
    description:
      "Ejecución de obra para la construcción del mercado de abastos, fortaleciendo el comercio local y el equipamiento urbano del distrito con una intervención de gran escala.",
    image_url: null,
    featured: true,
    sort_order: 2,
    status: "published",
  },
  {
    id: "3",
    name: "Bermas con mezcla asfáltica",
    slug: "bermas-samegua",
    category: "Vial",
    location: "Samegua, Mariscal Nieto, Moquegua",
    client_name: null,
    entity: "Municipalidad Distrital de Samegua",
    year: 2022,
    amount: 250000,
    duration_days: 15,
    condition: "Terminado",
    description:
      "Suministro y construcción de bermas con mezcla asfáltica a todo costo, mejorando la seguridad y el acabado de la vía en un plazo acotado de ejecución.",
    image_url: null,
    featured: false,
    sort_order: 3,
    status: "published",
  },
  {
    id: "4",
    name: "Muro de contención Buena Vista",
    slug: "muro-buena-vista",
    category: "Prevención de riesgos",
    location: "Mala, Cañete, Lima",
    client_name: null,
    entity: "Municipalidad Distrital de Mala",
    year: 2022,
    amount: 713000,
    duration_days: 75,
    condition: "Ejecutada",
    description:
      "Creación de muro de contención en zona de alto riesgo en la Calle Virgen del Carmen del Anexo Buena Vista, priorizando la protección de la población y la estabilidad del terreno.",
    image_url: null,
    featured: true,
    sort_order: 4,
    status: "published",
  },
  {
    id: "5",
    name: "Infraestructura deportiva Campolo",
    slug: "campolo-callao",
    category: "Deporte",
    location: "La Perla, Callao",
    client_name: null,
    entity: "Gobierno Regional del Callao",
    year: 2022,
    amount: 1150000,
    duration_days: 60,
    condition: "Terminado",
    description:
      "Renovación de infraestructura deportiva en el campo deportivo Campolo Alcalde, mejorando las condiciones de uso deportivo y recreativo para la comunidad.",
    image_url: null,
    featured: true,
    sort_order: 5,
    status: "published",
  },
  {
    id: "6",
    name: "Limpieza pública Trujillo",
    slug: "limpieza-trujillo",
    category: "Saneamiento",
    location: "Trujillo, La Libertad",
    client_name: null,
    entity: "UE 003 Gestión Integral de la Calidad Ambiental",
    year: 2023,
    amount: 43012814.65,
    duration_days: 180,
    condition: "Ejecutado",
    description:
      "Mejoramiento y ampliación del servicio de limpieza pública en la ciudad de Trujillo y disposición final para 9 distritos de la provincia, una intervención de alto impacto ambiental y operativo.",
    image_url: null,
    featured: true,
    sort_order: 6,
    status: "published",
  },
  {
    id: "7",
    name: "Losas deportivas Pariñas",
    slug: "losas-talara",
    category: "Deporte",
    location: "Talara Cercado y Cono Sur",
    client_name: null,
    entity: "Petróleos del Perú S.A.",
    year: 2023,
    amount: 1599701.12,
    duration_days: null,
    condition: "Terminado",
    description:
      "Servicio de acondicionamiento de las losas deportivas en el distrito Pariñas, Talara, ejecutado para Petróleos del Perú S.A., mejorando infraestructura deportiva comunitaria.",
    image_url: null,
    featured: true,
    sort_order: 7,
    status: "published",
  },
];

export const fallbackClients: Client[] = [
  { id: "1", name: "Municipalidad Distrital de Mala", logo_url: null, website: null, sort_order: 1, status: "published" },
  { id: "2", name: "Municipalidad Distrital de El Algarrobal", logo_url: null, website: null, sort_order: 2, status: "published" },
  { id: "3", name: "Municipalidad Distrital de Samegua", logo_url: null, website: null, sort_order: 3, status: "published" },
  { id: "4", name: "Gobierno Regional del Callao", logo_url: null, website: null, sort_order: 4, status: "published" },
  { id: "5", name: "Petróleos del Perú S.A.", logo_url: null, website: null, sort_order: 5, status: "published" },
  { id: "6", name: "UE 003 Gestión Integral de la Calidad Ambiental", logo_url: null, website: null, sort_order: 6, status: "published" },
];

export const fallbackCertifications: Certification[] = [
  {
    id: "1",
    name: "Gestión de calidad en obra",
    issuer: "LCS",
    document_url: null,
    image_url: null,
    valid_until: null,
    sort_order: 1,
    status: "published",
  },
  {
    id: "2",
    name: "Seguridad y salud en el trabajo",
    issuer: "LCS",
    document_url: null,
    image_url: null,
    valid_until: null,
    sort_order: 2,
    status: "published",
  },
];

export const fallbackRegions: CoverageRegion[] = [
  { id: "1", name: "Provincia de Talara", province: "Piura", lat: null, lng: null, sort_order: 1, status: "published" },
  { id: "2", name: "Provincia de Trujillo", province: "La Libertad", lat: null, lng: null, sort_order: 2, status: "published" },
  { id: "3", name: "Provincia de Cañete", province: "Lima", lat: null, lng: null, sort_order: 3, status: "published" },
  { id: "4", name: "Provincia del Callao", province: "Callao", lat: null, lng: null, sort_order: 4, status: "published" },
  { id: "5", name: "Provincia de Ilo", province: "Moquegua", lat: null, lng: null, sort_order: 5, status: "published" },
  { id: "6", name: "Provincia de Mariscal Nieto", province: "Moquegua", lat: null, lng: null, sort_order: 6, status: "published" },
];

export const pillars = [
  {
    title: "Experiencia",
    body: "Más de 10 años desarrollando proyectos de gran envergadura en diversos sectores públicos y privados.",
  },
  {
    title: "Calidad",
    body: "Cumplimos con altos estándares técnicos y de acabado en cada etapa del proyecto.",
  },
  {
    title: "Compromiso",
    body: "Trabajamos con responsabilidad para alcanzar la satisfacción de nuestros clientes y comunidades.",
  },
  {
    title: "Seguridad",
    body: "La seguridad de nuestro equipo y la de nuestros clientes es prioridad en obra.",
  },
] as const;
