import { Download, FileText, GitBranch, Workflow } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

import type { SharedResource } from "../mock-data";

const icons = [FileText, GitBranch, Workflow];

type SharedResourcesCardProps = {
    resources: SharedResource[];
};

export function SharedResourcesCard({ resources }: SharedResourcesCardProps) {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-white">
                    Shared Resources
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Documents, examples, and diagrams shared by mentor.
                </p>
            </div>

            <div className="grid gap-3">
                {resources.map((resource, index) => {
                    const Icon = icons[index];

                    return (
                        <div
                            key={resource.title}
                            className="flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-white/[0.035] p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white">
                                        {resource.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {resource.type} · {resource.uploadedAt}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon-sm" className="rounded-xl text-orange-400 hover:bg-orange-500/10 hover:text-orange-300">
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    );
                })}
            </div>
        </GlassCard>
    );
}
