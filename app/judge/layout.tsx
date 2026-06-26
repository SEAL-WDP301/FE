"use client"
import { useState } from "react";

import { JudgeSidebar } from "../../components/layout/dashboard/judge-sidebar";
import { Topbar } from "@/components/layout/dashboard/topbar";
import { RoleGuard } from "@/components/auth/role-guard";
import { StakeholderPortalGuard } from "@/components/auth/stakeholder-portal-guard";

interface JudgeLayoutProps {
    children: React.ReactNode;
}

export default function JudgeLayout({ children }: JudgeLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <RoleGuard allowedRoles={["judge", "stakeholder", "admin"]}>
        <StakeholderPortalGuard required="judge">
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex h-screen overflow-hidden">
                <JudgeSidebar
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />

                <div className="flex h-screen flex-1 flex-col overflow-hidden">
                    <Topbar />

                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>

            </div>
        </div>
        </StakeholderPortalGuard>
        </RoleGuard>
    );
}
