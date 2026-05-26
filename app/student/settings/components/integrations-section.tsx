import { PlugZap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { Integration } from "../mock-data";

type IntegrationsSectionProps = {
    integrations: Integration[];
};

export function IntegrationsSection({ integrations }: IntegrationsSectionProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                    <PlugZap className="h-4 w-4" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-white">Integrations</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Connected services for code, files, chat, and prototypes.
                    </p>
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                {integrations.map((integration) => {
                    const connected = integration.status === "Connected";

                    return (
                        <div key={integration.name} className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-sm font-black text-orange-300">
                                        {integration.icon}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{integration.name}</p>
                                        <p className="text-xs text-muted-foreground">{integration.lastSynced}</p>
                                    </div>
                                </div>
                                <Badge variant={connected ? "success" : "outline"}>
                                    {integration.status}
                                </Badge>
                            </div>

                            <Button
                                variant={connected ? "outline" : "orange"}
                                size="sm"
                                className="mt-4 rounded-xl border-white/10 bg-white/[0.03]"
                            >
                                {connected ? "Disconnect" : "Connect"}
                            </Button>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
