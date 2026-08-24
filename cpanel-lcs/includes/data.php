<?php
declare(strict_types=1);

$pillars = [
    [
        'title' => 'Experiencia',
        'body' => 'Cinco años desarrollando proyectos de gran envergadura, con un equipo multidisciplinario en sectores públicos y privados.',
    ],
    [
        'title' => 'Calidad',
        'body' => 'Cumplimos con altos estándares técnicos y de acabado en cada etapa del proyecto.',
    ],
    [
        'title' => 'Compromiso',
        'body' => 'Trabajamos con responsabilidad para alcanzar la satisfacción de nuestros clientes y comunidades.',
    ],
    [
        'title' => 'Seguridad',
        'body' => 'La seguridad de nuestro equipo y la de nuestros clientes es prioridad en obra.',
    ],
];

$stats = [
    ['number' => 5, 'suffix' => '', 'label' => 'Años de trayectoria operativa'],
    ['number' => 7, 'suffix' => '', 'label' => 'Regiones con presencia'],
    ['number' => 8, 'suffix' => '+', 'label' => 'Proyectos públicos documentados'],
    ['number' => null, 'suffix' => '', 'value' => 'Calidad', 'label' => 'Enfoque operativo'],
];

/** Trayectoria LCS — editable */
$timeline = [
    [
        'year' => '2014',
        'title' => 'Inicio de operaciones',
        'body' => 'LCS nace con foco en optimización de procesos constructivos y obras de infraestructura.',
    ],
    [
        'year' => '2018',
        'title' => 'Expansión regional',
        'body' => 'Ampliamos presencia hacia regiones del norte y sur del Perú con contratos municipales.',
    ],
    [
        'year' => '2021',
        'title' => 'Infraestructura educativa',
        'body' => 'Ejecución de rehabilitación integral en IE N°20158 — Dos de Mayo (Mala, Cañete).',
    ],
    [
        'year' => '2022',
        'title' => 'Obras de gran escala',
        'body' => 'Mercado de Abastos, muros de contención e infraestructura deportiva en Callao y Moquegua.',
    ],
    [
        'year' => '2023',
        'title' => 'Saneamiento y deporte',
        'body' => 'Limpieza pública en Trujillo y acondicionamiento de losas deportivas en Talara.',
    ],
    [
        'year' => '2025',
        'title' => 'Instituto Nacional de Salud',
        'body' => 'Remodelación de edificio de laboratorios y equipamiento para el Instituto Nacional de Salud.',
    ],
    [
        'year' => '2026',
        'title' => 'Gobierno Regional de Puno',
        'body' => 'Diseño, construcción y equipamiento del Centro de Salud de Moho, provincia de Moho, Puno.',
    ],
];

/** Cifras de seguridad — editables (placeholders hasta validación interna) */
$safetyStats = [
    ['number' => 12000, 'suffix' => '+', 'label' => 'Horas-hombre sin incidentes mayores'],
    ['number' => 48, 'suffix' => '', 'label' => 'Capacitaciones SST al año'],
    ['number' => 100, 'suffix' => '%', 'label' => 'Obras con plan de seguridad'],
];

/** Testimonios — contenido de ejemplo editable */
$testimonials = [
    [
        'name' => 'Área de Obras',
        'role' => 'Municipalidad Distrital de Mala',
        'quote' => 'Cumplieron plazos y estándares técnicos en la rehabilitación educativa. Comunicación clara en cada etapa.',
    ],
    [
        'name' => 'Supervisión de obra',
        'role' => 'Gobierno Regional del Callao',
        'quote' => 'La renovación deportiva en Campolo se ejecutó con orden, seguridad y acabados consistentes.',
    ],
    [
        'name' => 'Gestión de proyectos',
        'role' => 'Petróleos del Perú S.A.',
        'quote' => 'Buen desempeño en acondicionamiento de losas: coordinación ágil y entrega conforme a lo pactado.',
    ],
];

$workHighlights = [
    ['label' => 'Obras de edificación y rehabilitación', 'value' => 'Educación, mercados y equipamiento'],
    ['label' => 'Infraestructura vial y bermas', 'value' => 'Mezcla asfáltica y accesos'],
    ['label' => 'Prevención de riesgos', 'value' => 'Muros de contención'],
    ['label' => 'Infraestructura deportiva', 'value' => 'Callao y Talara'],
    ['label' => 'Saneamiento y limpieza pública', 'value' => 'Trujillo y afines'],
    ['label' => 'Contratos con entidades públicas', 'value' => 'Municipios y gobierno regional'],
    ['label' => 'Cobertura nacional selectiva', 'value' => 'Lima, Callao, La Libertad, Moquegua, Piura y Puno'],
    ['label' => 'Gestión integral de obra', 'value' => 'Planificación, ejecución y cierre'],
];

$about = [
    'historia' => [
        'title' => 'Quiénes somos',
        'body' => "Somos una empresa peruana que nació con la idea de desarrollarse en la industria de la construcción, diferenciándose por la optimización constante en los procesos constructivos de diversos proyectos que hacen posible el desarrollo de nuestro país.\n\nEjecutamos obras de edificaciones, saneamiento, viales, electromecánicas, telecomunicaciones, irrigación y afines, con un equipo multidisciplinario comprometido con la excelencia técnica y la responsabilidad social.",
    ],
    'mision' => [
        'title' => 'Nuestra misión',
        'body' => 'Ofrecer a nuestros clientes los mejores servicios y productos mediante una constante búsqueda de desarrollo de proyectos con las más altas especificaciones en diseño y construcción, impulsando el desarrollo urbano, industrial y social en el sector construcción.',
    ],
    'vision' => [
        'title' => 'Nuestra visión',
        'body' => 'Ser reconocidos en el mercado nacional e internacional como una empresa constructora que ejecuta proyectos de calidad, distinguida por brindar soluciones integrales innovadoras, demostrando responsabilidad, ética y confianza en cada obra que desarrollamos.',
    ],
    'valores' => [
        'title' => 'Nuestros valores',
        'body' => "Calidad — Sostenibilidad — Compromiso.\n\nConstruimos un futuro mejor a través del desarrollo y la operación de infraestructuras que contribuyen al progreso económico y social en los lugares donde estamos presentes.",
    ],
];

$services = [
    [
        'title' => 'Obras de edificación',
        'description' => 'Ejecución de edificaciones y rehabilitaciones cumpliendo especificaciones técnicas, normativas y estándares de seguridad. Ideal para infraestructura educativa, comercial y de uso público.',
        'image' => 'assets/img/proyectos/ie-20158-mala.webp',
    ],
    [
        'title' => 'Sistemas urbanos',
        'description' => 'Soluciones urbanas integrales que mejoran la calidad de vida: espacios públicos, equipamiento y obras que ordenan el crecimiento de ciudades y distritos.',
        'image' => 'assets/img/proyectos/mercado-el-algarrobal.webp',
    ],
    [
        'title' => 'Vías de acceso',
        'description' => 'Construcción y rehabilitación de infraestructura vial, bermas y accesos con enfoque en durabilidad, seguridad vial y continuidad del servicio.',
        'image' => 'assets/img/proyectos/bermas-samegua.webp',
    ],
    [
        'title' => 'Contratos municipales',
        'description' => 'Ejecución de obras bajo estándares normativos municipales y regionales, con capacidad de gestión técnica, documental y de plazos frente a entidades públicas.',
        'image' => 'assets/img/proyectos/campolo-callao.webp',
    ],
    [
        'title' => 'Obras de saneamiento',
        'description' => 'Infraestructura de agua, saneamiento y servicios ambientales para comunidades, incluyendo intervenciones de limpieza pública y disposición final cuando el alcance lo requiere.',
        'image' => 'assets/img/proyectos/limpieza-trujillo.webp',
    ],
    [
        'title' => 'Obras hidráulicas',
        'description' => 'Proyectos hidráulicos con ingeniería especializada, orientados a controlar riesgos, optimizar recursos hídricos y proteger zonas vulnerables.',
        'image' => 'assets/img/proyectos/muro-buena-vista.webp',
    ],
    [
        'title' => 'Obras hidroenergéticas',
        'description' => 'Participación en infraestructura hidroenergética y afines, aportando capacidad constructiva y coordinación multidisciplinaria.',
        'image' => 'assets/img/proyectos/losas-talara.webp',
    ],
    [
        'title' => 'Consultoría y suministro',
        'description' => 'Prestación de servicios, suministro de bienes y consultoría para complementar la ejecución de obra y fortalecer la toma de decisiones técnicas del cliente.',
        'image' => 'assets/img/hero-poster.jpg',
    ],
];

$projects = [
    [
        'name' => 'Rehabilitación IE N°20158 - Dos de Mayo',
        'slug' => 'ie-20158-mala',
        'category' => 'Educación',
        'location' => 'Distrito de Mala, Cañete, Lima',
        'entity' => 'Municipalidad Distrital de Mala',
        'year' => 2021,
        'amount' => 3055253.92,
        'duration_days' => 180,
        'condition' => 'Ejecutada',
        'featured' => true,
        'image' => 'assets/img/proyectos/ie-20158-mala.webp',
        'gallery' => [
            'assets/img/proyectos/ie-20158-mala.webp',
            'assets/img/proyectos/muro-buena-vista.webp',
            'assets/img/proyectos/mercado-el-algarrobal.webp',
        ],
        'before' => 'assets/img/proyectos/muro-buena-vista.webp',
        'after' => 'assets/img/proyectos/ie-20158-mala.webp',
        'description' => 'Rehabilitación de los servicios educativos de la Institución Educativa N°20158. Intervención integral orientada a recuperar condiciones de infraestructura para la comunidad educativa, con plazos y estándares de obra pública.',
    ],
    [
        'name' => 'Construcción del Mercado de Abastos',
        'slug' => 'mercado-el-algarrobal',
        'category' => 'Equipamiento urbano',
        'location' => 'El Algarrobal, Ilo, Moquegua',
        'entity' => 'Municipalidad Distrital de El Algarrobal',
        'year' => 2022,
        'amount' => 7505000.0,
        'duration_days' => 180,
        'condition' => 'Ejecutada',
        'featured' => true,
        'image' => 'assets/img/proyectos/mercado-el-algarrobal.webp',
        'gallery' => [
            'assets/img/proyectos/mercado-el-algarrobal.webp',
            'assets/img/proyectos/campolo-callao.webp',
            'assets/img/proyectos/bermas-samegua.webp',
        ],
        'before' => '',
        'after' => '',
        'description' => 'Ejecución de obra para la construcción del mercado de abastos, fortaleciendo el comercio local y el equipamiento urbano del distrito con una intervención de gran escala.',
    ],
    [
        'name' => 'Bermas con mezcla asfáltica',
        'slug' => 'bermas-samegua',
        'category' => 'Vial',
        'location' => 'Samegua, Mariscal Nieto, Moquegua',
        'entity' => 'Municipalidad Distrital de Samegua',
        'year' => 2022,
        'amount' => 250000.0,
        'duration_days' => 15,
        'condition' => 'Terminado',
        'featured' => false,
        'image' => 'assets/img/proyectos/bermas-samegua.webp',
        'gallery' => [
            'assets/img/proyectos/bermas-samegua.webp',
            'assets/img/proyectos/limpieza-trujillo.webp',
        ],
        'before' => 'assets/img/proyectos/limpieza-trujillo.webp',
        'after' => 'assets/img/proyectos/bermas-samegua.webp',
        'description' => 'Suministro y construcción de bermas con mezcla asfáltica a todo costo, mejorando la seguridad y el acabado de la vía en un plazo acotado de ejecución.',
    ],
    [
        'name' => 'Muro de contención Buena Vista',
        'slug' => 'muro-buena-vista',
        'category' => 'Prevención de riesgos',
        'location' => 'Mala, Cañete, Lima',
        'entity' => 'Municipalidad Distrital de Mala',
        'year' => 2022,
        'amount' => 713000.0,
        'duration_days' => 75,
        'condition' => 'Ejecutada',
        'featured' => true,
        'image' => 'assets/img/proyectos/muro-buena-vista.webp',
        'gallery' => [
            'assets/img/proyectos/muro-buena-vista.webp',
            'assets/img/proyectos/ie-20158-mala.webp',
        ],
        'before' => '',
        'after' => '',
        'description' => 'Creación de muro de contención en zona de alto riesgo en la Calle Virgen del Carmen del Anexo Buena Vista, priorizando la protección de la población y la estabilidad del terreno.',
    ],
    [
        'name' => 'Infraestructura deportiva Campolo',
        'slug' => 'campolo-callao',
        'category' => 'Deporte',
        'location' => 'La Perla, Callao',
        'entity' => 'Gobierno Regional del Callao',
        'year' => 2022,
        'amount' => 1150000.0,
        'duration_days' => 60,
        'condition' => 'Terminado',
        'featured' => true,
        'image' => 'assets/img/proyectos/campolo-callao.webp',
        'gallery' => [
            'assets/img/proyectos/campolo-callao.webp',
            'assets/img/proyectos/losas-talara.webp',
        ],
        'before' => 'assets/img/proyectos/losas-talara.webp',
        'after' => 'assets/img/proyectos/campolo-callao.webp',
        'description' => 'Renovación de infraestructura deportiva en el campo deportivo Campolo Alcalde, mejorando las condiciones de uso deportivo y recreativo para la comunidad.',
    ],
    [
        'name' => 'Limpieza pública Trujillo',
        'slug' => 'limpieza-trujillo',
        'category' => 'Saneamiento',
        'location' => 'Trujillo, La Libertad',
        'entity' => 'UE 003 Gestión Integral de la Calidad Ambiental',
        'year' => 2023,
        'amount' => 43012814.65,
        'duration_days' => 180,
        'condition' => 'Ejecutado',
        'featured' => true,
        'image' => 'assets/img/proyectos/limpieza-trujillo.webp',
        'gallery' => [
            'assets/img/proyectos/limpieza-trujillo.webp',
            'assets/img/proyectos/bermas-samegua.webp',
        ],
        'before' => '',
        'after' => '',
        'description' => 'Mejoramiento y ampliación del servicio de limpieza pública en la ciudad de Trujillo y disposición final para 9 distritos de la provincia, una intervención de alto impacto ambiental y operativo.',
    ],
    [
        'name' => 'Losas deportivas Pariñas',
        'slug' => 'losas-talara',
        'category' => 'Deporte',
        'location' => 'Talara Cercado y Cono Sur',
        'entity' => 'Petróleos del Perú S.A.',
        'year' => 2023,
        'amount' => 1599701.12,
        'duration_days' => null,
        'condition' => 'Terminado',
        'featured' => true,
        'image' => 'assets/img/proyectos/losas-talara.webp',
        'gallery' => [
            'assets/img/proyectos/losas-talara.webp',
            'assets/img/proyectos/campolo-callao.webp',
        ],
        'before' => '',
        'after' => '',
        'description' => 'Servicio de acondicionamiento de las losas deportivas en el distrito Pariñas, Talara, ejecutado para Petróleos del Perú S.A., mejorando infraestructura deportiva comunitaria.',
    ],
    [
        'name' => 'Planta de Valorización y Disposición final de Residuos Sólidos',
        'slug' => 'planta-valorizacion-residuos',
        'category' => 'Saneamiento',
        'location' => 'Perú',
        'entity' => 'Entidad pública',
        'year' => 2024,
        'amount' => null,
        'duration_days' => null,
        'condition' => 'Ejecutada',
        'featured' => true,
        'in_progress' => false,
        'image' => 'assets/img/proyectos/limpieza-trujillo.webp',
        'gallery' => [
            'assets/img/proyectos/limpieza-trujillo.webp',
            'assets/img/proyectos/bermas-samegua.webp',
        ],
        'before' => '',
        'after' => '',
        'description' => 'Obra de saneamiento para la valorización y disposición final de residuos sólidos, con enfoque ambiental y de servicio público.',
    ],
    [
        'name' => 'Remodelación de edificio de laboratorios y equipamiento — INS',
        'slug' => 'ins-laboratorios',
        'category' => 'Salud',
        'location' => 'Lima, Lima',
        'entity' => 'Instituto Nacional de Salud',
        'year' => 2025,
        'amount' => null,
        'duration_days' => null,
        'condition' => 'En ejecución',
        'featured' => true,
        'in_progress' => true,
        'image' => 'assets/img/proyectos/ie-20158-mala.webp',
        'gallery' => [
            'assets/img/proyectos/ie-20158-mala.webp',
            'assets/img/proyectos/mercado-el-algarrobal.webp',
        ],
        'before' => '',
        'after' => '',
        'description' => 'Remodelación de edificio de laboratorios y equipamiento para el Instituto Nacional de Salud, una intervención vigente de alto impacto en infraestructura de salud.',
    ],
    [
        'name' => 'Centro de Salud de Moho — GORE Puno',
        'slug' => 'centro-salud-moho-puno',
        'category' => 'Salud',
        'location' => 'Moho, Puno',
        'entity' => 'Gobierno Regional de Puno',
        'year' => 2026,
        'amount' => null,
        'duration_days' => null,
        'condition' => 'En ejecución',
        'featured' => true,
        'in_progress' => true,
        'image' => 'assets/img/proyectos/mercado-el-algarrobal.webp',
        'gallery' => [
            'assets/img/proyectos/mercado-el-algarrobal.webp',
            'assets/img/proyectos/ie-20158-mala.webp',
        ],
        'before' => '',
        'after' => '',
        'description' => 'Diseño, construcción y equipamiento del Centro de Salud de Moho, provincia de Moho, Puno, para el Gobierno Regional de Puno.',
    ],
];

$clients = [
    [
        'name' => 'Municipalidad Distrital de Mala',
        'logo' => 'assets/img/clientes/mala_sf.png',
        'website' => 'https://www.gob.pe/munimala',
    ],
    [
        'name' => 'Municipalidad Distrital de El Algarrobal',
        'logo' => 'assets/img/clientes/algarrobal_sf.png',
        'website' => 'https://www.gob.pe/munielalgarrobal',
    ],
    [
        'name' => 'Municipalidad Distrital de Samegua',
        'logo' => 'assets/img/clientes/samegua_sf.png',
        'website' => 'https://www.munisamegua.gob.pe/',
    ],
    [
        'name' => 'Gobierno Regional del Callao',
        'logo' => 'assets/img/clientes/callao_sf.png',
        'website' => 'https://www.gob.pe/regioncallao',
    ],
    [
        'name' => 'Petróleos del Perú S.A.',
        'logo' => 'assets/img/clientes/petroperu_sf.png',
        'website' => 'https://www.petroperu.com.pe/',
    ],
    [
        'name' => 'UE 003 Gestión Integral de la Calidad Ambiental',
        'logo' => 'assets/img/clientes/eu_oo3_sf.png',
        'website' => 'https://www.gob.pe/gica',
    ],
    [
        'name' => 'Instituto Nacional de Salud',
        'logo' => 'assets/img/clientes/ins_sf.png',
        'website' => 'https://www.gob.pe/ins',
    ],
    [
        'name' => 'Gobierno Regional de Puno',
        'logo' => 'assets/img/clientes/puno_sf.png',
        'website' => 'https://www.gob.pe/regionpuno',
    ],
];

$certificationMeta = [
    'company' => 'LUQUE CONSTRUCCIÓN Y SERVICIOS S.A.C.',
    'ruc' => '20607284033',
    'address' => 'Av. Manuel Olguín N.° 335, Int. 901, Urb. Los Granados, Santiago de Surco, Lima',
    'ciiu' => '4100 — Construcción de edificios',
    'sector' => 'Construcción',
    'provider_types' => [
        'Ejecución de obras',
        'Consultoría de obras',
        'Proveedor de bienes',
        'Proveedor de servicios',
    ],
    'issuer' => 'SISTEMACERTS',
    'standard' => 'ISO/IEC 17021-1:2015',
    'iso17021' => '2024-07-0088-R-00343',
    'verify_url' => 'https://www.sistemacerts-verification.com/',
    'verify_pe' => 'office@sistemacerts.org.pe',
    'document' => 'assets/docs/certificados-iso-lcs.pdf',
];

$certificationScopeGroups = [
    [
        'title' => 'Edificación e infraestructura pública',
        'items' => [
            'Obras de edificación, conjuntos habitacionales y condominios',
            'Infraestructura educativa: colegios, institutos y universidades',
            'Infraestructura de salud: hospitales, centros de salud, clínicas y postas',
            'Palacios municipales, centros comerciales, recreativos, culturales y de abasto',
        ],
    ],
    [
        'title' => 'Espacios públicos y deporte',
        'items' => [
            'Estadios, complejos, losas, coliseos y polideportivos',
            'Parques, plazas, alamedas y muros de contención',
        ],
    ],
    [
        'title' => 'Saneamiento e hidráulica',
        'items' => [
            'Agua potable, alcantarillado, red pública, letrinización y UBS',
            'Reservorios, presas, canales, riego tecnificado, gaviones y encauzamientos',
            'PTAP, PTAR, drenajes, rellenos sanitarios y pozos sépticos',
        ],
    ],
    [
        'title' => 'Vial, energía y obras civiles',
        'items' => [
            'Carreteras, caminos, puentes, pistas, veredas y pavimentación',
            'Obras hidroenergéticas, eléctricas, electromecánicas y suministro de energía',
            'Defensas ribereñas, estructuras metálicas, muelles, puertos y obras en el mar',
        ],
    ],
];

$certifications = [
    [
        'badge' => 'ISO 45001',
        'code' => 'ISO 45001:2018',
        'name' => 'Sistema de gestión de la seguridad y salud en el trabajo',
        'issuer' => 'SISTEMACERTS',
        'accreditation' => 'International Accreditation Service (IAS), Brea, California, EE. UU.',
        'validity_code' => 'SISTEMA-PER/LCY-O9703',
        'register' => '2025-08-0397 — Versión 001',
        'valid_from' => '7 de agosto de 2025',
        'valid_to' => '6 de agosto de 2028',
        'cycle_valid_to' => '6 de agosto de 2026',
        'review_1' => '7 de julio de 2026 al 6 de agosto de 2026',
        'review_2' => '7 de julio de 2027 al 6 de agosto de 2027',
    ],
    [
        'badge' => 'ISO 37001',
        'code' => 'ISO 37001:2016',
        'name' => 'Sistema de gestión antisoborno',
        'issuer' => 'SISTEMACERTS',
        'accreditation' => 'United Accreditation Foundation (UAF), Norfolk, Virginia, EE. UU.',
        'validity_code' => 'LCY/SMSPL-PER/AB9753',
        'register' => '2025-08-0397 — Versión 001',
        'valid_from' => '7 de agosto de 2025',
        'valid_to' => '6 de agosto de 2028',
        'cycle_valid_to' => '6 de agosto de 2026',
        'review_1' => '7 de julio de 2026 al 6 de agosto de 2026',
        'review_2' => '7 de julio de 2027 al 6 de agosto de 2027',
    ],
    [
        'badge' => 'ISO 9001',
        'code' => 'ISO 9001:2015',
        'name' => 'Sistema de gestión de calidad',
        'issuer' => 'SISTEMACERTS',
        'accreditation' => 'International Accreditation Service (IAS), Brea, California, EE. UU.',
        'validity_code' => 'SISTEMA-PER/LCY-Q11538',
        'register' => '2025-12-0713 — Versión 001',
        'valid_from' => '12 de diciembre de 2025',
        'valid_to' => '11 de diciembre de 2028',
        'cycle_valid_to' => '11 de diciembre de 2026',
        'review_1' => '11 de noviembre de 2026 al 11 de diciembre de 2026',
        'review_2' => '11 de noviembre de 2027 al 11 de diciembre de 2027',
    ],
    [
        'badge' => 'ISO 14001',
        'code' => 'ISO 14001:2015',
        'name' => 'Sistema de gestión ambiental',
        'issuer' => 'SISTEMACERTS',
        'accreditation' => 'International Accreditation Service (IAS), Brea, California, EE. UU.',
        'validity_code' => 'SISTEMA-PER/LCY-E11886',
        'register' => '2025-12-0713 — Versión 001',
        'valid_from' => '12 de diciembre de 2025',
        'valid_to' => '11 de diciembre de 2028',
        'cycle_valid_to' => '11 de diciembre de 2026',
        'review_1' => '11 de noviembre de 2026 al 11 de diciembre de 2026',
        'review_2' => '11 de noviembre de 2027 al 11 de diciembre de 2027',
    ],
];

$regions = [
    ['name' => 'Provincia de Talara', 'province' => 'Piura'],
    ['name' => 'Provincia de Trujillo', 'province' => 'La Libertad'],
    ['name' => 'Provincia de Lima', 'province' => 'Lima'],
    ['name' => 'Provincia de Cañete', 'province' => 'Lima'],
    ['name' => 'Provincia del Callao', 'province' => 'Callao'],
    ['name' => 'Provincia de Ilo', 'province' => 'Moquegua'],
    ['name' => 'Provincia de Mariscal Nieto', 'province' => 'Moquegua'],
    ['name' => 'Provincia de Moho', 'province' => 'Puno'],
];

/**
 * Videos del sitio.
 * - file: ruta relativa MP4 en assets/video/ (recomendado en cPanel)
 * - youtube: ID o URL de YouTube (alternativa sin subir archivo pesado)
 * - poster: imagen de portada
 *
 * Para agregar más: copia un .mp4 a assets/video/ y añade una fila aquí,
 * o pega el link de YouTube en "youtube".
 */
$videos = [
    [
        'title' => 'Obra en ejecución — LCS',
        'file' => 'assets/video/lcs.mp4',
        'youtube' => '',
        'poster' => '',
        'featured' => true,
        'description' => 'Video institucional de LCS en obra.',
    ],
    [
        'title' => 'Infraestructura educativa',
        'file' => '',
        'youtube' => '', // ej: https://www.youtube.com/watch?v=XXXXXXXXXXX
        'poster' => 'assets/img/proyectos/ie-20158-mala.webp',
        'featured' => false,
        'description' => 'Agrega aquí el video del proyecto IE Dos de Mayo (YouTube o MP4).',
    ],
    [
        'title' => 'Equipamiento urbano',
        'file' => '',
        'youtube' => '',
        'poster' => 'assets/img/proyectos/mercado-el-algarrobal.webp',
        'featured' => false,
        'description' => 'Agrega aquí el video del Mercado de Abastos.',
    ],
    [
        'title' => 'Infraestructura deportiva',
        'file' => '',
        'youtube' => '',
        'poster' => 'assets/img/proyectos/campolo-callao.webp',
        'featured' => false,
        'description' => 'Agrega aquí el video de Campolo / losas deportivas.',
    ],
];

function find_project_by_slug(array $projects, string $slug): ?array
{
    foreach ($projects as $project) {
        if ($project['slug'] === $slug) {
            return $project;
        }
    }
    return null;
}

function videos_ready(array $videos): array
{
    return array_values(array_filter($videos, static function (array $v): bool {
        $hasFile = !empty($v['file']);
        $hasYt = youtube_id($v['youtube'] ?? null) !== null;
        return $hasFile || $hasYt;
    }));
}

function projects_in_progress(array $projects): array
{
    return array_values(array_filter($projects, static fn (array $p) => !empty($p['in_progress'])));
}

function projects_completed(array $projects): array
{
    return array_values(array_filter($projects, static fn (array $p) => empty($p['in_progress'])));
}
