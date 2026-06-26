"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { usePathname } from "next/navigation";

import { Topbar } from "@/components/layout/dashboard/topbar";
import { ProfileChecker } from "@/components/layout/public/profile-checker";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function StudentLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <HomeHeader />
            <ProfileChecker />
            <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
        </RoleGuard>
    );
}

