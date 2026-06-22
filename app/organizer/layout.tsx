import { RoleGuard } from "@/components/auth/role-guard";
import { ProfileChecker } from "@/components/layout/public/profile-checker";
import { OrganizerShell } from "./organizer-shell";

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={["admin", "organizer"]}>
          <OrganizerShell>
            <ProfileChecker />
            {children}
          </OrganizerShell>
        </RoleGuard>
    );
}
