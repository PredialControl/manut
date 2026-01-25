import type { Metadata } from "next";
import { Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "Manut App",
  description: "Sistema de Manutenção Predial",
  icons: {
    icon: "/logo.png.png",
  },
};

import { AppBackground } from "@/components/AppBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} ${greatVibes.variable} font-sans bg-transparent min-h-screen`}>
        <AppBackground />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
