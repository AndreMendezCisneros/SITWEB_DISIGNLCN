export type AppRole =
  | "super_admin"
  | "admin"
  | "editor"
  | "marketing"
  | "viewer";

export type PublishStatus = "draft" | "published" | "archived";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  company_name: string;
  company_short: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  general_manager: string;
  social: Record<string, string>;
  updated_at: string;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  /** Slot del sitio: home.hero, nosotros.hero, etc. */
  placement: string;
  sort_order: number;
  status: PublishStatus;
};

export type AboutSection = {
  id: string;
  key: string;
  title: string;
  body: string;
  image_url: string | null;
  sort_order: number;
  status: PublishStatus;
};

export type HomeStat = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  status: PublishStatus;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  status: PublishStatus;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  location: string | null;
  client_name: string | null;
  entity: string | null;
  year: number | null;
  amount: number | null;
  duration_days: number | null;
  condition: string | null;
  description: string;
  image_url: string | null;
  featured: boolean;
  sort_order: number;
  status: PublishStatus;
};

export type Client = {
  id: string;
  name: string;
  logo_url: string | null;
  website: string | null;
  sort_order: number;
  status: PublishStatus;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string | null;
  document_url: string | null;
  image_url: string | null;
  valid_until: string | null;
  sort_order: number;
  status: PublishStatus;
};

export type CoverageRegion = {
  id: string;
  name: string;
  province: string | null;
  lat: number | null;
  lng: number | null;
  sort_order: number;
  status: PublishStatus;
};

export type ContactMessage = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
};

export type MediaAsset = {
  id: string;
  folder_id: string | null;
  name: string;
  path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export type AuditEvent = {
  id: string;
  created_at: string;
  actor_id: string | null;
  actor_role: string | null;
  actor_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  summary: string | null;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip: string | null;
  user_agent: string | null;
  request_id: string | null;
  metadata: Record<string, unknown>;
};

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Administrador",
  admin: "Administrador",
  editor: "Editor",
  marketing: "Marketing",
  viewer: "Visualizador",
};
