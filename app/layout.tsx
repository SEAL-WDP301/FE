import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SnackbarProvider } from "../components/providers/snackbar-provider";
import { QueryProvider } from "../components/providers/query-provider";
import { ThemeProvider } from "../components/providers/theme-provider";

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
      className={`${inter.variable} dark`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider>
            <SnackbarProvider>
              {children}
            </SnackbarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
