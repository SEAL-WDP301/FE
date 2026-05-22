import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Header from "../components/layout/public/header"
import Footer from "../components/layout/public/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SEAL",
  description: "Software Engineering Agile League",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
