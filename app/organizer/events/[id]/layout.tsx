"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getOrganizerEvent } from "@/lib/api/organizer-events.api";
import {
  LayoutDashboard,
  GitMerge,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function EventDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const eventId = params.id as string;
  const roundId = params.roundId as string | undefined;
  const baseUrl = `/organizer/events/${eventId}`;

  const navItems = [
    { name: "Overview", href: `${baseUrl}/overview`, icon: LayoutDashboard },
    { name: "Tracks & Rounds", href: `${baseUrl}/tracks`, icon: GitMerge },
  ];

  const { data: event, isLoading, isError } = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: () => getOrganizerEvent(eventId),
  });

  const eventName = isLoading
    ? "Loading event..."
    : isError
      ? "Event unavailable"
      : event?.name || "Event Control";
  const eventIconUrl = event?.icons?.[0]?.url;

  const sortedRounds = [...(event?.rounds || [])].sort((a, b) => a.roundNumber - b.roundNumber);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Global Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex h-16 items-center px-6 gap-6 max-w-[1600px] mx-auto w-full">
          {/* Event Info */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-8 w-8 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center font-bold overflow-hidden shrink-0">
              {eventIconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={eventIconUrl} alt={`${eventName} icon`} className="h-full w-full object-cover" />
              ) : (
                eventName.charAt(0).toUpperCase()
              )}
            </div>
            <h2 className="font-bold tracking-tight truncate max-w-[200px] sm:max-w-[300px]">{eventName}</h2>
          </div>

          <div className="h-6 w-px bg-border shrink-0" />

          {/* Global Nav */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-full flex items-center gap-2",
                    isActive
                      ? "text-blue-500 bg-blue-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="globalNavIndicator"
                      className="absolute inset-0 bg-blue-500/10 rounded-full border border-blue-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Round Line Timeline */}
          {sortedRounds.length > 0 && (
            <>
              <div className="h-6 w-px bg-border shrink-0 ml-auto" />
              <div className="overflow-x-auto no-scrollbar flex items-center gap-2 pl-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2 shrink-0 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                  Workspace
                </span>
                <div className="flex items-center gap-2">
                  {sortedRounds.map((round, index) => {
                    const isRoundActive = roundId === String(round.id);
                    return (
                      <div key={round.id} className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`${baseUrl}/rounds/${round.id}/teams`}
                          className={cn(
                            "relative px-4 py-1.5 text-sm font-semibold transition-all duration-300 rounded-full border shadow-sm flex items-center gap-2 group",
                            isRoundActive
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent ring-2 ring-blue-500/30 scale-105"
                              : "bg-background text-muted-foreground border-border hover:border-blue-500/50 hover:text-foreground hover:bg-blue-50/50 dark:hover:bg-blue-950/30"
                          )}
                        >
                          {isRoundActive && (
                            <motion.div 
                              layoutId="activeRoundGlow" 
                              className="absolute inset-0 rounded-full bg-white/20 blur-md pointer-events-none" 
                            />
                          )}
                          <span className="relative z-10">{round.name}</span>
                        </Link>
                        {index < sortedRounds.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground/30" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden bg-gradient-to-br from-background to-muted/20">
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}

