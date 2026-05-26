import { DangerZoneSection } from "./components/danger-zone-section";
import { IntegrationsSection } from "./components/integrations-section";
import { MemberPermissionsSection } from "./components/member-permissions-section";
import { NotificationSettingsSection } from "./components/notification-settings-section";
import { SettingsHeader } from "./components/settings-header";
import { TeamBrandingSection } from "./components/team-branding-section";
import { TeamProfileSection } from "./components/team-profile-section";
import { WorkspacePreferencesSection } from "./components/workspace-preferences-section";
import {
    integrations,
    notifications,
    permissions,
    teamProfile,
    workspacePreferences,
} from "./mock-data";

export default function TeamSettingsPage() {
    return (
        <div className="space-y-6">
            <SettingsHeader />

            <div className="mx-auto max-w-[1500px] space-y-6">
                <TeamProfileSection profile={teamProfile} />
                <TeamBrandingSection />
                <MemberPermissionsSection members={permissions} />

                <div className="grid gap-5 xl:grid-cols-2">
                    <NotificationSettingsSection items={notifications} />
                    <WorkspacePreferencesSection preferences={workspacePreferences} />
                </div>

                <IntegrationsSection integrations={integrations} />
                <DangerZoneSection />
            </div>
        </div>
    );
}
