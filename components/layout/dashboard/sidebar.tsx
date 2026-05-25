"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LayoutDashboard, Calendar, Users, Upload, Trophy, Bell, User } from "lucide-react";

import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";

const menus = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard, },
    { label: "Events", href: "/student/events", icon: Calendar, },
    { label: "Teams", href: "/student/teams", icon: Users, },
    { label: "Submissions", href: "/student/submissions", icon: Upload, },
    { label: "Rankings", href: "/student/rankings", icon: Trophy, },
    { label: "Notifications", href: "/student/notifications", icon: Bell, },
    { label: "Profile", href: "/student/profile", icon: User, },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-[280px] border-r border-white/10 bg-[#120B08] lg:flex lg:flex-col">
            {/* Logo */}
            <div className="border-b border-white/10 p-6">
                <Logo />
            </div>

            {/* Menu */}
            <div className="flex-1 p-4">
                <p className="mb-4 px-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Workspace
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
                                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all",
                                    active
                                        ? "bg-orange-500/15 text-orange-400 shadow-[0_0_30px_rgba(243,112,33,0.15)] border border-orange-500/20"
                                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
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