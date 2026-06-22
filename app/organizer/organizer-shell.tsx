"use client";

import { usePathname } from "next/navigation";

import HomeHeader from "@/components/layout/dashboard/home-header";

export function OrganizerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isEventWorkspace = /^\/organizer\/events\/[^/]+(?:\/|$)/.test(pathname)
    && !pathname.endsWith("/create");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      {!isEventWorkspace && <HomeHeader />}
      <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
