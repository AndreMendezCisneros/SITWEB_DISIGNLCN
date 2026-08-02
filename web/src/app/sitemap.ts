import type { MetadataRoute } from "next";
import { getProjects } from "@/services/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const projects = await getProjects();
  const staticRoutes = [
    "",
    "/nosotros",
    "/servicios",
    "/proyectos",
    "/clientes",
    "/certificaciones",
    "/contacto",
  ].map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date(),
  }));

  return [
    ...staticRoutes,
    ...projects.map((p) => ({
      url: `${site}/proyectos/${p.slug}`,
      lastModified: new Date(),
    })),
  ];
}
