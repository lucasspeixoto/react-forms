import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "React Hook Form and Zod",
  description:
    "Formulários avançados para React/NextJs com React Hook Form e Zod",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-zinc-950 text-zinc-300 flex flex-col w-full h-screen py-10 items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  );
}
