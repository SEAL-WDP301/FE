"use client";

import { SnackbarProvider as NotistackProvider } from "notistack";

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotistackProvider 
      maxSnack={3} 
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      style={{ 
        backgroundColor: "#161311", 
        color: "#fff", 
        border: "1px solid rgba(255,118,41,0.3)",
        borderRadius: "12px",
        fontFamily: "var(--font-inter)",
        boxShadow: "0 4px 12px rgba(255,118,41,0.15)"
      }}
    >
      {children}
    </NotistackProvider>
  );
}
