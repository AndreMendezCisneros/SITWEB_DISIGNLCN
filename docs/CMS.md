# CMS — Guía de contenido

## Menú agrupado (como el sitio)

1. **Dashboard**
2. **Inicio** — Banners (cabeceras); Marketing también ve “Estadísticas del inicio”
3. **Páginas** — Nosotros, Servicios, Proyectos, Clientes, Certificaciones
4. **Medios y sistema** — Multimedia, Mensajes, Configuración, Auditoría, Usuarios

Código: `navGroupsForRole` en `web/src/lib/auth/roles.ts`.

## Banners / cabeceras (slots)

Catálogo: `web/src/lib/cms/placements.ts`.

| Placement | Dónde se ve |
|-----------|-------------|
| `home.hero` | Inicio (hero full-bleed) — **solo 1 publicado** |
| `nosotros.hero` | Cabecera `/nosotros` |
| `servicios.hero` | Cabecera `/servicios` |
| `proyectos.hero` | Cabecera `/proyectos` |
| `clientes.hero` | Cabecera `/clientes` |
| `certificaciones.hero` | Cabecera `/certificaciones` |
| `contacto.hero` | Cabecera `/contacto` |

Al crear/editar: campo **“Dónde irá (página → sección)”**.  
Si ya hay uno publicado en ese slot → error claro (o pásalo a borrador/archivado).

UI: `PageHero` en páginas internas; `Hero` en home. Sin borde duro gris en fondos negros (separador difuminado).

## Nosotros

Clave (`key`) solo por select:

- `historia` — Inicio + Nosotros (imagen)
- `mision`, `vision`, `valores` — página Nosotros

## Proyectos

- Listado en `/proyectos`
- **Aparece en Inicio (destacados)** = `featured`

## Multimedia

- Galería tipo Pinterest (`MediaGallery`): miniaturas → modal (tipo, tamaño, URL, abrir/copiar)
- Upload: `/api/admin/media/upload` (JPEG/PNG/WebP/PDF, máx 10 MB, Sharp→WebP)
- Recorte opcional en campos imagen del CRUD (`react-easy-crop`)

## Validación server

Tablas mutables vía `saveEntityAction`: allowlist + Zod en `web/src/lib/validators/content.ts`.  
Tablas desconocidas → denegado (también `canMutateTable`).

## Permisos resumidos

| Módulo | Write |
|--------|-------|
| Hero/Nosotros/Clientes/Multimedia | sa, admin, editor, marketing |
| Servicios/Proyectos/Certificaciones | sa, admin, editor |
| Mensajes/Config | sa, admin (marketing: stats vía config panel) |
| Usuarios | solo super_admin |
| Viewer | ningún write |
