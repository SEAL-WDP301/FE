import { ImageIcon, Palette, Smile } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";

export function TeamBrandingSection() {
    return (
        <GlassCard className="rounded-[24px] bg-card p-6 hover:-translate-y-1">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Team Branding</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    Personalize the team workspace without leaving the SEAL visual system.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                        <Palette className="h-5 w-5 text-orange-400" />
                        <p className="mt-3 text-sm font-semibold text-white">Accent Color</p>
                        <div className="mt-4 flex gap-2">
                            {["#f37021", "#ff8a3d", "#c8470f"].map((color) => (
                                <span
                                    key={color}
                                    className="h-9 w-9 rounded-full border border-white/15"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                        <ImageIcon className="h-5 w-5 text-orange-400" />
                        <p className="mt-3 text-sm font-semibold text-white">Banner Image</p>
                        <p className="mt-2 text-xs text-muted-foreground">Upload a team header for public previews.</p>
                        <Button variant="soft" size="sm" className="mt-4 rounded-xl">Upload</Button>
                    </div>

                    <div className="rounded-[20px] border border-white/10 bg-white/[0.035] p-4">
                        <Smile className="h-5 w-5 text-orange-400" />
                        <p className="mt-3 text-sm font-semibold text-white">Team Icon</p>
                        <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl">⚡</div>
                    </div>
                </div>

                <div className="rounded-[22px] border border-orange-500/20 bg-orange-500/10 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-300">
                        Live Preview
                    </p>
                    <div className="mt-4 rounded-[20px] border border-white/10 bg-background/60 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff8a3d] to-[#f37021] font-black text-black">
                                SW
                            </div>
                            <div>
                                <p className="font-semibold text-white">SEAL Warriors</p>
                                <p className="text-xs text-muted-foreground">Ship fast. Review clean.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
