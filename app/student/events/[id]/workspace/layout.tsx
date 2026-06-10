"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, FileText, Calendar, UserCheck, LayoutDashboard } from "lucide-react";
import HomeHeader from "@/components/layout/dashboard/home-header";


export default function TrackWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const eventId = params.id as string;
  const basePath = `/student/events/${eventId}/workspace`;

  const tabs = [
    { name: "Overview", href: basePath, icon: LayoutDashboard },
    { name: "My Team", href: `${basePath}/my-team`, icon: Users },
    { name: "Mentor", href: `${basePath}/mentor`, icon: UserCheck },
    { name: "Submissions", href: `${basePath}/submissions`, icon: FileText },
    { name: "Schedule", href: `${basePath}/schedule`, icon: Calendar },
  ];

  const customTabsContent = (
    <div className="flex items-center gap-2 md:gap-6 w-full justify-center lg:justify-start overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        // Exact match for base path, startsWith for subpaths
        const isActive = tab.href === basePath ? pathname === basePath : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-all py-2 px-3 rounded-xl whitespace-nowrap",
              isActive
                ? "bg-orange-500/15 text-orange-500 shadow-[0_0_20px_rgba(243,112,33,0.15)] ring-1 ring-orange-500/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col relative z-10">
      <HomeHeader customCenterContent={customTabsContent} />
      
      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </main>
    </div>
  );
}
