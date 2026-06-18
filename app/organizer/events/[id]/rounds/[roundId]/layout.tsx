"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users, GraduationCap, FileText, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RoundWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const eventId = params.id as string;
  const roundId = params.roundId as string;
  const baseUrl = `/organizer/events/${eventId}/rounds/${roundId}`;

  const roundNavItems = [
    { name: "Teams", href: `${baseUrl}/teams`, icon: Users },
    { name: "Mentors & Judges", href: `${baseUrl}/stakeholders`, icon: GraduationCap },
    { name: "Submissions", href: `${baseUrl}/submissions`, icon: FileText },
    { name: "Grading Criteria", href: `${baseUrl}/criteria`, icon: Award },
  ];

  return (
    <div className="space-y-6">
      {/* Round Sub-navigation */}
      <div className="flex items-center gap-2 border-b pb-4 overflow-x-auto no-scrollbar">
        {roundNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0",
                isActive
                  ? "text-blue-500 bg-blue-500/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="roundNavIndicator"
                  className="absolute inset-0 border-b-2 border-blue-500"
                  style={{ borderRadius: 0, borderBottomWidth: '2px' }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Round Content */}
      <div className="animate-in fade-in duration-500">
        {children}
      </div>
    </div>
  );
}
