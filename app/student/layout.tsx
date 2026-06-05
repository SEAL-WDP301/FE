"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Topbar } from "@/components/layout/dashboard/topbar";
import { ProfileChecker } from "@/components/layout/public/profile-checker";
import { Sidebar } from "@/components/layout/dashboard/sidebar";

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function StudentLayout({
    children,
}: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <div className="flex h-screen flex-1 flex-col overflow-hidden">
                    <Topbar />
                    <ProfileChecker />

                    {/* Content */}
                    <main className="flex-1 overflow-y-auto">

                        <div className="p-6 max-w-7xl mx-auto w-full">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}