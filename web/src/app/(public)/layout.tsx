import { SiteFooter } from "@/components/public/site-footer";
import { SiteHeader } from "@/components/public/site-header";
import { WhatsAppFloat } from "@/components/public/whatsapp-float";
import { getSiteSettings } from "@/services/content";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  return (
    <div className="min-h-screen bg-lcs-black text-lcs-white">
      <SiteHeader />
      {children}
      <SiteFooter settings={settings} />
      <WhatsAppFloat />
    </div>
  );
}
