import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { SnackbarProvider } from "../components/providers/snackbar-provider";
import { QueryProvider } from "../components/providers/query-provider";
import { ThemeProvider } from "../components/providers/theme-provider";
import { ScrollFloatProvider } from "../components/ScrollFloat";
import SplashCursor from "../components/SplashCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SEAL",
  description: "Software Engineering Agile League",
};

import { SseProvider } from "../components/providers/sse-provider";
import { AuthProvider } from "../components/providers/auth-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SplashCursor
          COLOR="#ff7a00"
          RAINBOW_MODE={false}
          SPLAT_RADIUS={0.16}
          SPLAT_FORCE={5200}
          DYE_RESOLUTION={1024}
          BACK_COLOR={{ r: 0, g: 0, b: 0 }}
          TRANSPARENT
        />
        <QueryProvider>
          <ThemeProvider>
            <SnackbarProvider>
              <AuthProvider>
                <SseProvider>
                  <ScrollFloatProvider>{children}</ScrollFloatProvider>
                </SseProvider>
              </AuthProvider>
            </SnackbarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
