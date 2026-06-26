import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SecuritySection() {
    return (
        <GlassCard className="p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-orange-500" />

                    <h3 className="text-base font-semibold text-foreground">
                        Password & Security
                    </h3>
                </div>

                <Button variant="outline" size="sm" className="rounded-lg border-border bg-muted">
                    Update Password
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                    <Label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        Current Password
                    </Label>

                    <Input
                        type="password"
                        placeholder="••••••••"
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        New Password
                    </Label>

                    <Input
                        type="password"
                        placeholder="••••••••"
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        Confirm Password
                    </Label>

                    <Input
                        type="password"
                        placeholder="••••••••"
                        className="mt-2"
                    />
                </div>
            </div>
        </GlassCard>
    );
}
