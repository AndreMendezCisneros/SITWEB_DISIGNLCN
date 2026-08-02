import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
  /** Honeypot: cualquier valor se acepta y se descarta en silencio en la API. */
  website: z.string().max(200),
  startedAt: z.number().int().positive(),
  /** Token Cloudflare Turnstile (puede ir vacío en dev sin keys). */
  turnstileToken: z.string().max(2048),
});

export type ContactInput = z.infer<typeof contactSchema>;
