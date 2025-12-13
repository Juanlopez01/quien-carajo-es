import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "¿Quién Carajo Es? - Edición Argentina",
  description: "El clásico juego de adivinar personajes, versión cultura argentina. ¡Jugá online con amigos! Messi, Maradona, Fort, Moria y más.",
  icons: {
    icon: '/icon.svg', // Por si Next.js no lo detecta automático en app/
  },
  openGraph: {
    title: "¿Quién Carajo Es? 🕵️‍♂️🇦🇷",
    description: "¡Desafiá a un amigo! ¿Podés adivinar su personaje secreto antes que él?",
    type: 'website',
    locale: 'es_AR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
