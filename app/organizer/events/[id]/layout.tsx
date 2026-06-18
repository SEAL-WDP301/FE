"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getOrganizerEvent } from "@/lib/api/organizer-events.api";
import {
  LayoutDashboard,
  GitMerge,
  Users,
  Award,
  Settings,
  ArrowLeft,
  GraduationCap,
  FileText,
  ChevronLeft,
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
  const baseUrl = `/organizer/events/${eventId}`;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    { name: "Overview", href: `${baseUrl}/overview`, icon: LayoutDashboard },
    { name: "Tracks & Rounds", href: `${baseUrl}/rounds`, icon: GitMerge },
    { name: "Teams", href: `${baseUrl}/teams`, icon: Users },
    { name: "Mentors & Judges", href: `${baseUrl}/staff`, icon: GraduationCap },
    { name: "Submissions", href: `${baseUrl}/submissions`, icon: FileText },
    { name: "Grading Criteria", href: `${baseUrl}/criteria`, icon: Award },

    { name: "Settings", href: `${baseUrl}/settings`, icon: Settings },
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

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "relative hidden border-r border-border bg-card/50 backdrop-blur-xl flex-col sticky top-0 h-screen overflow-visible transition-all duration-300 md:flex",
          isSidebarCollapsed ? "w-[92px]" : "w-64"
        )}
      >

        <button
          type="button"
          onClick={() => setIsSidebarCollapsed((current) => !current)}
          className="absolute -right-4 top-6 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-md transition-transform hover:scale-105"
          aria-label={isSidebarCollapsed ? "Expand Event Control" : "Collapse Event Control"}
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        <div className="flex h-full flex-col overflow-y-auto">
          <div className={cn("p-6 transition-all duration-300", isSidebarCollapsed ? "px-3" : "px-6")}>
            <Link
              href="/organizer/events"
              className={cn(
                "group flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6",
                isSidebarCollapsed ? "justify-center" : ""
              )}
            >
              <ArrowLeft
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1",
                  !isSidebarCollapsed && "mr-2"
                )}
              />
              <span className={cn("whitespace-nowrap transition-all duration-200", isSidebarCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100")}>Back to Events</span>

            </Link>
            <div className={cn("flex items-center gap-2 mb-2", isSidebarCollapsed ? "justify-center" : "")}>
              <div className="h-8 w-8 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center font-bold">
                {eventIconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={eventIconUrl} alt={`${eventName} icon`} className="h-8 w-8 rounded-xl object-cover" />
                ) : (
                  eventName.charAt(0).toUpperCase()
                )}
              </div>
              <h2 className={cn("truncate  font-bold tracking-tight transition-all duration-200", isSidebarCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100")}>{eventName}</h2>
            </div>
            {/* <p className={cn("text-xs text-muted-foreground transition-all duration-200", isSidebarCollapsed ? "w-0 overflow-hidden opacity-0 ml-0" : "ml-10 w-auto opacity-100")}>Manage everything here</p> */}
          </div>

          <nav className={cn("flex-1 pb-4 space-y-1 mt-4", isSidebarCollapsed ? "px-3" : "px-4")}>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center rounded-xl text-sm font-medium transition-all duration-300",
                    isSidebarCollapsed ? "justify-center px-0 py-2.5" : "gap-3 px-3 py-2.5",
                    isActive
                      ? "text-blue-500 bg-blue-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-500/10 rounded-xl border border-blue-500/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <item.icon className={cn("h-4 w-4 z-10", isActive ? "text-blue-500" : "")} />
                  <span className={cn("z-10 whitespace-nowrap transition-all duration-200", isSidebarCollapsed ? "w-0 overflow-hidden opacity-0" : "w-auto opacity-100")}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

      </aside>



      {/* Main Content Area */}
      <main className="min-h-screen min-w-0 flex-1 overflow-x-hidden bg-gradient-to-br from-background to-muted/20">
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
