import { ArrowRight, Rocket, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export function EventHubHero() {
    return (
        <GlassCard glow className="relative rounded-[26px] bg-card p-6 hover:-translate-y-1 lg:p-7">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-[100px]" />
            <div className="absolute bottom-0 left-1/3 h-48 w-80 rounded-full bg-sky-500/10 blur-[100px]" />
            <div className="absolute inset-x-7 top-7 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

            <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-center">
                <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-300">
                        <Rocket className="h-4 w-4" />
                        SEAL Hackathon Ecosystem
                    </div>

                    <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
                        Software Engineering Agile League
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                        Join, collaborate, and compete in modern software engineering hackathons.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Button variant="orange" size="lg" className="rounded-2xl">
                            Explore Events
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-2xl border-border bg-card">
                            <UsersRound className="h-4 w-4" />
                            Create Team
                        </Button>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                    {[
                        ["Live events", "12", "Registration, judging, finals"],
                        ["Teams shipping", "348", "Across 6 active tracks"],
                        ["Prize pool", "420M", "Available this season"],
                    ].map(([label, value, helper]) => (
                        <div key={label} className="rounded-[20px] border border-border bg-muted/40 p-4 backdrop-blur-xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                                {label}
                            </p>
                            <p className="mt-2 text-2xl font-semibold text-foreground">
                                {value}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {helper}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </GlassCard>
    );
}
