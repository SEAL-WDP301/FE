import { Archive, Crown, LogOut, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

const dangerActions = [
    { label: "Leave Team", icon: LogOut },
    { label: "Transfer Leadership", icon: Crown },
    { label: "Archive Team", icon: Archive },
    { label: "Delete Team", icon: Trash2 },
];

export function DangerZoneSection() {
    return (
        <GlassCard className="rounded-[24px] border-red-500/20 bg-red-500/5 p-6 hover:-translate-y-1">
            <div className="mb-5">
                <h2 className="text-xl font-semibold text-red-200">Danger Zone</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Sensitive actions require confirmation. Deleting this team cannot be undone.
                </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {dangerActions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <Button
                            key={action.label}
                            variant="outline"
                            className="h-12 justify-start rounded-2xl border-red-500/25 bg-red-500/5 text-red-200 hover:bg-red-500/10 hover:text-red-100"
                        >
                            <Icon className="h-4 w-4" />
                            {action.label}
                        </Button>
                    );
                })}
            </div>

            <div className="mt-5 rounded-[20px] border border-red-500/20 bg-background/50 p-4">
                <p className="text-sm font-semibold text-foreground">
                    Confirmation modal preview
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                    Are you sure you want to delete this team? This action cannot be undone.
                </p>
            </div>
        </GlassCard>
    );
}
