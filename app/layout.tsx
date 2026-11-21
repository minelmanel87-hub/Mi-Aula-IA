import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mi Aula IA — Aprende a tu ritmo",
  description: "Tu espacio de estudio con inteligencia artificial: exámenes, deberes y explicaciones paso a paso."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}