"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CalendarDays, MessageSquareText, Settings, Trophy, UploadCloud, User, UserRoundCog, UsersRound } from "lucide-react";

import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";

const menus = [
    {
        label: "Overview",
        href: "/student/dashboard",
        icon: UserRoundCog,
    },

    {
        label: "Events",
        href: "/student/events",
        icon: Trophy,
    },

    {
        label: "Members",
        href: "/student/teams",
        icon: UsersRound,
    },

    {
        label: "Mentor",
        href: "/student/mentor",
        icon: MessageSquareText,
    },

    {
        label: "Submissions",
        href: "/student/submissions",
        icon: UploadCloud,
    },

    {
        label: "Schedule",
        href: "/student/schedule",
        icon: CalendarDays,
    },

    {
        label: "Profile",
        href: "/student/profile",
        icon: User,
    },

    {
        label: "Settings",
        href: "/student/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-[280px] border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl lg:flex lg:flex-col">
            {/* Logo */}
            <div className="border-b border-sidebar-border p-6">
                <Logo href="/home" />
            </div>

            {/* Menu */}
            <div className="flex-1 p-4">
                <p className="mb-4 px-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Navigation
                </p>

                <nav className="space-y-2">
                    {menus.map((item) => {
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
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5" />

                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

        </aside>
    );
}
