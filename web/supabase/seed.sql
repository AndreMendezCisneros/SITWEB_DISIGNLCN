-- Seed contenido LCS (portafolio 2025) — textos ampliados

insert into public.about_sections (key, title, body, sort_order, status) values
('historia', 'Quiénes somos', 'Somos una empresa peruana que nació con la idea de desarrollarse en la industria de la construcción, diferenciándose por la optimización constante en los procesos constructivos de diversos proyectos que hacen posible el desarrollo de nuestro país.

Ejecutamos obras de edificaciones, saneamiento, viales, electromecánicas, telecomunicaciones, irrigación y afines, con un equipo comprometido con la excelencia técnica y la responsabilidad social.', 1, 'published'),
('mision', 'Nuestra misión', 'Ofrecer a nuestros clientes los mejores servicios y productos mediante una constante búsqueda de desarrollo de proyectos con las más altas especificaciones en diseño y construcción, impulsando el desarrollo urbano, industrial y social en el sector construcción.', 2, 'published'),
('vision', 'Nuestra visión', 'Ser reconocidos en el mercado nacional e internacional como una empresa constructora que ejecuta proyectos de calidad, distinguida por brindar soluciones integrales innovadoras, demostrando responsabilidad, ética y confianza en cada obra que desarrollamos.', 3, 'published'),
('valores', 'Nuestros valores', 'Calidad — Sostenibilidad — Compromiso.

Construimos un futuro mejor a través del desarrollo y la operación de infraestructuras que contribuyen al progreso económico y social en los lugares donde estamos presentes.', 4, 'published')
on conflict (key) do nothing;

insert into public.home_stats (label, value, sort_order, status) values
('Años construyendo futuro', '10+', 1, 'published'),
('Regiones con presencia', '6', 2, 'published'),
('Proyectos públicos documentados', '7+', 3, 'published'),
('Enfoque operativo', 'Calidad y seguridad', 4, 'published');

insert into public.banners (title, subtitle, cta_label, cta_href, image_url, placement, sort_order, status) values
('Construimos soluciones, creamos futuro', 'Ejecutamos proyectos de construcción, infraestructura y mantenimiento con enfoque en calidad, seguridad y cumplimiento de plazos, brindando soluciones confiables en cada etapa de la obra.', 'Cotiza tu proyecto', '/contacto', null, 'home.hero', 1, 'published');

insert into public.services (title, description, sort_order, status) values
('Obras de edificación', 'Ejecución de edificaciones y rehabilitaciones cumpliendo especificaciones técnicas, normativas y estándares de seguridad. Ideal para infraestructura educativa, comercial y de uso público.', 1, 'published'),
('Sistemas urbanos', 'Soluciones urbanas integrales que mejoran la calidad de vida: espacios públicos, equipamiento y obras que ordenan el crecimiento de ciudades y distritos.', 2, 'published'),
('Vías de acceso', 'Construcción y rehabilitación de infraestructura vial, bermas y accesos con enfoque en durabilidad, seguridad vial y continuidad del servicio.', 3, 'published'),
('Contratos municipales', 'Ejecución de obras bajo estándares normativos municipales y regionales, con capacidad de gestión técnica, documental y de plazos frente a entidades públicas.', 4, 'published'),
('Obras de saneamiento', 'Infraestructura de agua, saneamiento y servicios ambientales para comunidades, incluyendo intervenciones de limpieza pública y disposición final cuando el alcance lo requiere.', 5, 'published'),
('Obras hidráulicas', 'Proyectos hidráulicos con ingeniería especializada, orientados a controlar riesgos, optimizar recursos hídricos y proteger zonas vulnerables.', 6, 'published'),
('Obras hidroenergéticas', 'Participación en infraestructura hidroenergética y afines, aportando capacidad constructiva y coordinación multidisciplinaria.', 7, 'published'),
('Consultoría y suministro', 'Prestación de servicios, suministro de bienes y consultoría para complementar la ejecución de obra y fortalecer la toma de decisiones técnicas del cliente.', 8, 'published');

insert into public.coverage_regions (name, province, sort_order, status) values
('Provincia de Talara', 'Piura', 1, 'published'),
('Provincia de Trujillo', 'La Libertad', 2, 'published'),
('Provincia de Cañete', 'Lima', 3, 'published'),
('Provincia del Callao', 'Callao', 4, 'published'),
('Provincia de Ilo', 'Moquegua', 5, 'published'),
('Provincia de Mariscal Nieto', 'Moquegua', 6, 'published');

insert into public.projects (name, slug, category, location, entity, year, amount, duration_days, condition, description, featured, sort_order, status) values
('Rehabilitación IE N°20158 - Dos de Mayo', 'ie-20158-mala', 'Educación', 'Distrito de Mala, Cañete, Lima', 'Municipalidad Distrital de Mala', 2021, 3055253.92, 180, 'Ejecutada', 'Rehabilitación de los servicios educativos de la Institución Educativa N°20158. Intervención integral orientada a recuperar condiciones de infraestructura para la comunidad educativa.', true, 1, 'published'),
('Construcción del Mercado de Abastos', 'mercado-el-algarrobal', 'Equipamiento urbano', 'El Algarrobal, Ilo, Moquegua', 'Municipalidad Distrital de El Algarrobal', 2022, 7505000.00, 180, 'Ejecutada', 'Ejecución de obra para la construcción del mercado de abastos, fortaleciendo el comercio local y el equipamiento urbano del distrito.', true, 2, 'published'),
('Bermas con mezcla asfáltica', 'bermas-samegua', 'Vial', 'Samegua, Mariscal Nieto, Moquegua', 'Municipalidad Distrital de Samegua', 2022, 250000.00, 15, 'Terminado', 'Suministro y construcción de bermas con mezcla asfáltica a todo costo, mejorando la seguridad y el acabado de la vía.', false, 3, 'published'),
('Muro de contención Buena Vista', 'muro-buena-vista', 'Prevención de riesgos', 'Mala, Cañete, Lima', 'Municipalidad Distrital de Mala', 2022, 713000.00, 75, 'Ejecutada', 'Creación de muro de contención en zona de alto riesgo en la Calle Virgen del Carmen del Anexo Buena Vista.', true, 4, 'published'),
('Infraestructura deportiva Campolo', 'campolo-callao', 'Deporte', 'La Perla, Callao', 'Gobierno Regional del Callao', 2022, 1150000.00, 60, 'Terminado', 'Renovación de infraestructura deportiva en el campo deportivo Campolo Alcalde.', true, 5, 'published'),
('Limpieza pública Trujillo', 'limpieza-trujillo', 'Saneamiento', 'Trujillo, La Libertad', 'UE 003 Gestión Integral de la Calidad Ambiental', 2023, 43012814.65, 180, 'Ejecutado', 'Mejoramiento y ampliación del servicio de limpieza pública en Trujillo y disposición final para 9 distritos de la provincia.', true, 6, 'published'),
('Losas deportivas Pariñas', 'losas-talara', 'Deporte', 'Talara Cercado y Cono Sur', 'Petróleos del Perú S.A.', 2023, 1599701.12, null, 'Terminado', 'Servicio de acondicionamiento de las losas deportivas en el distrito Pariñas, Talara, para Petróleos del Perú S.A.', true, 7, 'published');

insert into public.clients (name, sort_order, status) values
('Municipalidad Distrital de Mala', 1, 'published'),
('Municipalidad Distrital de El Algarrobal', 2, 'published'),
('Municipalidad Distrital de Samegua', 3, 'published'),
('Gobierno Regional del Callao', 4, 'published'),
('Petróleos del Perú S.A.', 5, 'published'),
('UE 003 Gestión Integral de la Calidad Ambiental', 6, 'published');

insert into public.certifications (name, issuer, sort_order, status) values
('Gestión de calidad en obra', 'LCS', 1, 'published'),
('Seguridad y salud en el trabajo', 'LCS', 2, 'published');

insert into public.seo_meta (path, title, description) values
('/', 'LCS — Luque Construcción y Servicios', 'Construcción, infraestructura y mantenimiento con calidad, seguridad y compromiso.'),
('/nosotros', 'Nosotros | LCS', 'Misión, visión, valores y cobertura de Luque Construcción y Servicios.'),
('/servicios', 'Servicios | LCS', 'Obras de edificación, saneamiento, viales y más.'),
('/proyectos', 'Proyectos | LCS', 'Proyectos públicos y privados ejecutados por LCS.'),
('/clientes', 'Clientes | LCS', 'Entidades y organizaciones que confían en LCS.'),
('/certificaciones', 'Certificaciones | LCS', 'Certificaciones y documentación institucional.'),
('/contacto', 'Contacto | LCS', 'Cotiza tu proyecto con Luque Construcción y Servicios.');
