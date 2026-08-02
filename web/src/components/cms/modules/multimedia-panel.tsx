import { MediaGallery } from "@/components/admin/media-gallery";
import { MediaUpload } from "@/components/admin/media-upload";
import { CmsPageHeader } from "@/components/cms/page-header";
import { canWriteModule } from "@/lib/auth/roles";
import { hasSupabaseEnv } from "@/lib/env";
import { listAdminRows } from "@/services/content";
import type { AppRole, MediaAsset } from "@/types/database";

export async function MultimediaPanel({
  role,
}: {
  basePath: string;
  role: AppRole;
}) {
  const canWrite = canWriteModule(role, "multimedia");

  if (!hasSupabaseEnv()) {
    return (
      <div className="space-y-3">
        <CmsPageHeader title="Multimedia" description="Conecta Supabase Storage." />
      </div>
    );
  }

  const rows = await listAdminRows<MediaAsset>("media_assets");
  return (
    <div className="space-y-4">
      <CmsPageHeader
        title="Multimedia"
        description={
          canWrite
            ? "Galería visual: elige una imagen para ver sus datos. Úsala luego en Hero, Servicios, Proyectos, etc."
            : "Biblioteca de medios — solo consulta"
        }
        readOnly={!canWrite}
      />
      {canWrite ? <MediaUpload /> : null}
      <MediaGallery items={rows} />
    </div>
  );
}
