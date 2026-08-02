import { MessagesInbox } from "@/components/admin/messages-inbox";
import { CmsPageHeader } from "@/components/cms/page-header";
import { canWriteModule } from "@/lib/auth/roles";
import { hasSupabaseEnv } from "@/lib/env";
import { listMessages } from "@/services/messages";
import type { AppRole } from "@/types/database";

export async function MensajesPanel({ role }: { role: AppRole }) {
  if (!hasSupabaseEnv()) {
    return <p className="text-sm">Configura Supabase para ver mensajes.</p>;
  }
  const rows = await listMessages();
  const canWrite = canWriteModule(role, "mensajes");
  return (
    <div className="space-y-4">
      <CmsPageHeader
        title="Mensajes de contacto"
        description="Bandeja del formulario público. Usa Abrir para ver nombre, empresa, teléfono y mensaje completo."
        readOnly={!canWrite}
      />
      <MessagesInbox rows={rows} canWrite={canWrite} />
    </div>
  );
}
