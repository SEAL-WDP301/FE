import { Bell } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";

import { SettingsToggle } from "./settings-toggle";

type NotificationSettingsSectionProps = {
    items: Array<{
        label: string;
        enabled: boolean;
    }>;
};

export function NotificationSettingsSection({ items }: NotificationSettingsSectionProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                    <Bell className="h-4 w-4" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Keep the team aligned without noisy updates.
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white/[0.035] p-3">
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                        <SettingsToggle enabled={item.enabled} />
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
