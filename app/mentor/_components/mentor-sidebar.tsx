"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  ChevronLeft,
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  Megaphone,
  MessageSquareText,
  Settings,
  UsersRound,
  Video,
  type LucideIcon,
} from "lucide-react";

import Logo from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getMentorFeedback, getMentorSubmissions } from "@/lib/api/mentor.api";

interface MentorSidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  id?: string;
  badge?: string;
}

const baseNavItems: NavItem[] = [
  { label: "Dashboard", href: "/mentor", icon: LayoutDashboard },
  {
    label: "Judge Evaluation",
    href: "/judge/evaluation",
    icon: ClipboardCheck,
  },
  { label: "My Teams", href: "/mentor/teams", icon: UsersRound },
  {
    label: "Team Progress",
    href: "/mentor/progress",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Mentoring Sessions",
    href: "/mentor/sessions",
    icon: Video,
  },
  {
    label: "Feedback",
    href: "/mentor/feedback",
    icon: MessageSquareText,
    id: "feedback",
  },
  {
    label: "Submissions Review",
    href: "/mentor/submissions",
    icon: FileCheck2,
    id: "submissions",
  },
  {
    label: "Announcements",
    href: "/mentor/announcements",
    icon: Megaphone,
  },
  { label: "Settings", href: "/mentor/settings", icon: Settings },
];

export function MentorSidebar({
  collapsed,
  setCollapsed,
}: MentorSidebarProps) {
  const pathname = usePathname();

  const { data: feedbacks } = useQuery({
    queryKey: ["mentor-feedbacks"],
    queryFn: getMentorFeedback,
  });

  const { data: submissions } = useQuery({
    queryKey: ["mentor-submissions"],
    queryFn: getMentorSubmissions,
  });

  const feedbackCount = feedbacks?.length || 0;
  const submissionsCount = submissions?.length || 0;

  const navItems = baseNavItems.map((item) => {
    if (item.id === "feedback" && feedbackCount > 0)
      return { ...item, badge: feedbackCount > 99 ? "99+" : feedbackCount.toString() };
    if (item.id === "submissions" && submissionsCount > 0)
      return { ...item, badge: submissionsCount > 99 ? "99+" : submissionsCount.toString() };
    return item;
  });

  return (
    <aside
      className={cn(
        "relative hidden h-screen shrink-0 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-all duration-300 lg:flex lg:flex-col",
        collapsed ? "w-[92px]" : "w-[280px]"
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border transition-all duration-300",
          collapsed ? "justify-center p-4" : "justify-start p-6"
        )}
      >
        <Logo collapsed={collapsed} />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/mentor"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex items-center rounded-2xl text-sm font-medium transition-all duration-300",
                  collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
                  active
                    ? "bg-orange-500/15 text-orange-400 shadow-[0_0_30px_rgba(243,112,33,0.15)] ring-1 ring-orange-500/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed ? (
                  <div className="flex flex-1 items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                ) : (
                  item.badge && (
                    <span className="absolute right-2 top-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-500 px-1 text-[8px] font-bold text-white">
                      {item.badge}
                    </span>
                  )
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand mentor sidebar" : "Collapse mentor sidebar"}
        className="absolute -right-4 top-1/2 z-50 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-lg transition-all hover:scale-105"
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-300",
            collapsed && "rotate-180"
          )}
        />
      </button>
    </aside>
  );
}
