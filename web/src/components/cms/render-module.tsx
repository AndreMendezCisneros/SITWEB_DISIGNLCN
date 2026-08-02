import { AuditoriaPanel } from "@/components/cms/modules/auditoria-panel";
import { CertificacionesPanel } from "@/components/cms/modules/certificaciones-panel";
import { ClientesPanel } from "@/components/cms/modules/clientes-panel";
import { ConfigPanel } from "@/components/cms/modules/config-panel";
import { HeroPanel } from "@/components/cms/modules/hero-panel";
import { MensajesPanel } from "@/components/cms/modules/mensajes-panel";
import { MultimediaPanel } from "@/components/cms/modules/multimedia-panel";
import { NosotrosPanel } from "@/components/cms/modules/nosotros-panel";
import { ProyectosPanel } from "@/components/cms/modules/proyectos-panel";
import { ServiciosPanel } from "@/components/cms/modules/servicios-panel";
import { UsuariosPanel } from "@/components/cms/modules/usuarios-panel";
import type { AdminModule } from "@/lib/auth/roles";
import type { AppRole } from "@/types/database";

export async function RenderModule({
  module,
  basePath,
  role,
}: {
  module: Exclude<AdminModule, "dashboard">;
  basePath: string;
  role: AppRole;
}) {
  switch (module) {
    case "hero":
      return <HeroPanel basePath={basePath} role={role} />;
    case "nosotros":
      return <NosotrosPanel basePath={basePath} role={role} />;
    case "servicios":
      return <ServiciosPanel basePath={basePath} role={role} />;
    case "proyectos":
      return <ProyectosPanel basePath={basePath} role={role} />;
    case "clientes":
      return <ClientesPanel basePath={basePath} role={role} />;
    case "certificaciones":
      return <CertificacionesPanel basePath={basePath} role={role} />;
    case "mensajes":
      return <MensajesPanel role={role} />;
    case "multimedia":
      return <MultimediaPanel basePath={basePath} role={role} />;
    case "configuracion":
      return <ConfigPanel basePath={basePath} role={role} />;
    case "auditoria":
      return <AuditoriaPanel />;
    case "usuarios":
      return <UsuariosPanel />;
    default:
      return null;
  }
}
