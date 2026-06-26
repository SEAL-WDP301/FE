"use client"
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { JudgeSidebar } from "../../components/layout/dashboard/judge-sidebar";
import { Topbar } from "@/components/layout/dashboard/topbar";
import { RoleGuard } from "@/components/auth/role-guard";
import { JudgeAreaGuard } from "@/components/auth/judge-area-guard";
import { axiosClient } from "@/lib/axios";

interface MentorLayoutProps {
    children: React.ReactNode;
}

export default function MentorLayout({ children }: MentorLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);

    const { data: user } = useQuery({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const res = await axiosClient.get("/users/profile");
            return res.data?.data ?? null;
        },
    });

    return (
        <RoleGuard allowedRoles={["judge", "stakeholder", "admin"]}>
        <JudgeAreaGuard role={user?.role}>
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
        </JudgeAreaGuard>
        </RoleGuard>
    );
}
