import { Camera, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { TeamProfile } from "../mock-data";

type TeamProfileSectionProps = {
    profile: TeamProfile;
};

export function TeamProfileSection({ profile }: TeamProfileSectionProps) {
    return (
        <GlassCard glow className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground">Team Profile</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Core identity displayed across SEAL workspaces and review pages.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
                <div className="flex flex-col items-center rounded-[22px] border border-border bg-white/[0.035] p-5">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-[28px] bg-orange-500/25 blur-xl" />
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-[24px] border border-orange-500/30 bg-gradient-to-br from-[#ff8a3d] to-[#f37021] text-3xl font-black text-black">
                            SW
                        </div>
                    </div>
                    <Button variant="soft" className="mt-5 rounded-2xl">
                        <Camera className="h-4 w-4" />
                        Upload Avatar
                    </Button>
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                        PNG or JPG. Recommended 512x512.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Team Name
                        </span>
                        <Input defaultValue={profile.name} className="h-11 rounded-2xl border-border bg-muted" />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Team Slogan
                        </span>
                        <Input defaultValue={profile.slogan} className="h-11 rounded-2xl border-border bg-muted" />
                    </label>

                    <label className="block md:col-span-2">
                        <span className="mb-2 flex justify-between text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Description
                            <span>{profile.description.length}/160</span>
                        </span>
                        <Textarea defaultValue={profile.description} className="min-h-24 rounded-2xl border-border bg-muted" />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Track / Category
                        </span>
                        <Button variant="outline" className="h-11 w-full justify-between rounded-2xl border-border bg-muted">
                            {profile.track}
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            University
                        </span>
                        <Input defaultValue={profile.university} className="h-11 rounded-2xl border-border bg-muted" />
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Team Visibility
                        </span>
                        <Button variant="outline" className="h-11 w-full justify-between rounded-2xl border-border bg-muted">
                            {profile.visibility}
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>
                    </label>
                </div>
            </div>
        </GlassCard>
    );
}
