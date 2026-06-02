"use client"
import { useState } from "react";

import { Sidebar } from "@/components/layout/dashboard/sidebar";
import { Topbar } from "@/components/layout/dashboard/topbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
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
                    setCollapsed={setCollapsed} />

                {/* Main */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Topbar />

                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}


