import { ChevronDown, Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

type WorkspacePreferencesSectionProps = {
    preferences: Array<{
        label: string;
        value: string;
    }>;
};

export function WorkspacePreferencesSection({ preferences }: WorkspacePreferencesSectionProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                    <Settings2 className="h-4 w-4" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Workspace Preferences</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Regional, calendar, and activity defaults.
                    </p>
                </div>
            </div>

            <div className="grid gap-3">
                {preferences.map((preference) => (
                    <div key={preference.label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                        <div>
                            <p className="text-sm font-medium text-white">{preference.label}</p>
                            <p className="text-xs text-muted-foreground">{preference.value}</p>
                        </div>
                        <Button variant="ghost" size="icon-sm" className="rounded-xl text-muted-foreground hover:bg-white/[0.05] hover:text-white">
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
