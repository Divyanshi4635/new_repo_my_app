import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { SoundProvider } from "@/components/SoundProvider";
import { StreakProvider } from "@/components/StreakProvider";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Calcy's Calculator Carnival",
  description:
    "A rainbow of friendly calculators for math, science, money, health, shapes, units, and party fun — built for curious kids (and grown-ups too)!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-carnival text-slate-800">
        <SoundProvider>
          <StreakProvider>{children}</StreakProvider>
        </SoundProvider>
      </body>
    </html>
  );
}
