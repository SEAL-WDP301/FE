"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, FileText, Calendar, UserCheck } from "lucide-react";

export default function TrackWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const eventId = params.id as string;
  const trackId = params.trackId as string;

  const basePath = `/home/events/${eventId}/tracks/${trackId}`;

  const tabs = [
    { name: "My Team", href: `${basePath}/teams`, icon: Users },
    { name: "Mentor", href: `${basePath}/mentor`, icon: UserCheck },
    { name: "Submissions", href: `${basePath}/submissions`, icon: FileText },
    { name: "Schedule", href: `${basePath}/schedule`, icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-6 h-14 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors border-b-2 py-4 whitespace-nowrap",
                    isActive
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}
