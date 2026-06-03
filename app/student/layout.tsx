<<<<<<< HEAD
import type { ReactNode } from "react";
import HomeHeader from "@/components/layout/dashboard/home-header";
import { ProfileChecker } from "@/components/layout/public/profile-checker";
=======
"use client"
import { useState } from "react";

import { Sidebar } from "@/components/layout/dashboard/sidebar";
import { Topbar } from "@/components/layout/dashboard/topbar";
>>>>>>> c0d3cfc6fa0ab242060b0a0ed20c4046d0418916

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function StudentLayout({
    children,
}: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
<<<<<<< HEAD
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <HomeHeader />
            <ProfileChecker />
            <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
                {children}
            </main>
=======
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <Sidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed} />

                {/* Main */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Topbar />

                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
>>>>>>> c0d3cfc6fa0ab242060b0a0ed20c4046d0418916
        </div>
    );
}


