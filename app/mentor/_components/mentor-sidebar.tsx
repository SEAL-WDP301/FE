"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bell,
    ChartNoAxesCombined,
    FileCheck2,
    LayoutDashboard,
    Megaphone,
    MessageSquareText,
    Settings,
    UsersRound,
    Video,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logo from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/mentor", icon: LayoutDashboard },
    { label: "My Teams", href: "/mentor/teams", icon: UsersRound },
    { label: "Team Progress", href: "/mentor/progress", icon: ChartNoAxesCombined },
    { label: "Mentoring Sessions", href: "/mentor/sessions", icon: Video },
    { label: "Feedback", href: "/mentor/feedback", icon: MessageSquareText, badge: "7" },
    { label: "Submissions Review", href: "/mentor/submissions", icon: FileCheck2, badge: "4" },
    { label: "Announcements", href: "/mentor/announcements", icon: Megaphone },
    { label: "Settings", href: "/mentor/settings", icon: Settings },
];

export function MentorSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-[290px] border-r border-white/10 bg-[#120B08]/95 lg:flex lg:flex-col">
            <div className="border-b border-white/10 p-6">
                <Logo />
                <div className="mt-5 rounded-3xl border border-orange-500/15 bg-orange-500/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
                        Mentor Portal
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                        SEAL Spring 2026
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        12 assigned teams
                    </p>
                </div>
            </div>

            <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                                active
                                    ? "bg-orange-500/15 text-orange-400 shadow-[0_0_30px_rgba(243,112,33,0.15)] ring-1 ring-orange-500/20"
                                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge ? (
                                <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold text-black">
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <Avatar className="h-10 w-10 border border-orange-500/25">
                        <AvatarFallback>HN</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">Huy Nguyen</p>
                        <p className="truncate text-xs text-muted-foreground">Senior Mentor</p>
                    </div>
                    <Bell className="h-4 w-4 text-orange-400" />
                </div>
            </div>
        </aside>
    );
}
