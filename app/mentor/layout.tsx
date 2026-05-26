import type { ReactNode } from "react";

import { MentorSidebar } from "./_components/mentor-sidebar";

export default function MentorLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex h-screen overflow-hidden">
                <MentorSidebar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
