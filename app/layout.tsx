import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SnackbarProvider } from "../components/providers/snackbar-provider";
import { QueryProvider } from "../components/providers/query-provider";

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
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <SnackbarProvider>
            {children}
          </SnackbarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
