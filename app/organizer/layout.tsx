import HomeHeader from "@/components/layout/dashboard/home-header";
import { RoleGuard } from "@/components/auth/role-guard";
import { ProfileChecker } from "@/components/layout/public/profile-checker";

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={["admin", "organizer"]}>
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <HomeHeader />
            <ProfileChecker />
            <main className="flex-1 overflow-y-auto w-full">
                {children}
            </main>
        </div>
        </RoleGuard>
    );
}
