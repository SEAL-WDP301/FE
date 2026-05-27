import { Brain, Cloud, Code2, Cpu, Palette, Smartphone } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";

import type { TrackCategory } from "../overview-data";

const icons = [Code2, Brain, Smartphone, Cloud, Palette, Cpu];

type EventTracksSectionProps = {
    tracks: TrackCategory[];
};

export function EventTracksSection({ tracks }: EventTracksSectionProps) {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold text-foreground">Event Tracks</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Choose a category and find hackathons that match your team.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {tracks.map((track, index) => {
                    const Icon = icons[index];

                    return (
                        <GlassCard key={track.title} className="rounded-[22px] bg-card p-4 hover:-translate-y-1">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-orange-400">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div className="mt-4 flex items-start justify-between gap-3">
                                <div>
                                    <h3 className="font-semibold text-foreground">{track.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{track.description}</p>
                                </div>
                                <span className="rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-semibold text-orange-300">
                                    {track.count}
                                </span>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>
        </section>
    );
}
