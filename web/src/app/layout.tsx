import type { Metadata } from "next";
import { Manrope, Bebas_Neue } from "next/font/google";
import "./globals.css";

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "LCS — Luque Construcción y Servicios",
    template: "%s | LCS",
  },
  description:
    "Construcción, infraestructura y mantenimiento con calidad, seguridad y compromiso.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${body.variable} ${display.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
