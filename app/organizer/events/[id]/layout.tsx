"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GitMerge,
  Users,
  Award,
  Settings,
  ArrowLeft,
  GraduationCap,
  FileText,
  ShieldCheck
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

  const navItems = [
    { name: "Overview", href: `${baseUrl}/overview`, icon: LayoutDashboard },
    { name: "Tracks & Rounds", href: `${baseUrl}/rounds`, icon: GitMerge },
    { name: "Teams", href: `${baseUrl}/teams`, icon: Users },
    { name: "Mentors & Judges", href: `${baseUrl}/stakeholders`, icon: GraduationCap },
    { name: "Submissions", href: `${baseUrl}/submissions`, icon: FileText },
    { name: "Grading Criteria", href: `${baseUrl}/criteria`, icon: Award },

    { name: "Settings", href: `${baseUrl}/settings`, icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col hidden md:flex sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <Link
            href="/organizer/events"
            className="group flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Events
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center font-bold">
              E
            </div>
            <h2 className="text-xl font-bold tracking-tight">Event Control</h2>
          </div>
          <p className="text-xs text-muted-foreground ml-10">Manage everything here</p>
        </div>

        <nav className="flex-1 px-4 pb-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
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
                <span className="z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
