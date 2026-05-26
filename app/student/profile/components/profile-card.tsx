import { Camera, GraduationCap, Trophy } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, } from "@/components/ui/card";


export function ProfileCard() {
    return (
        <Card glow className="overflow-hidden border border-orange-500/20 bg-[#140d0a]">
            <CardContent className="p-8 text-center">
                <div className="relative mx-auto w-fit">
                    <Avatar className="h-28 w-28 ring-4 ring-primary/40 mx-auto">
                        <AvatarFallback className="bg-[var(--gradient-primary)] text-primary-foreground text-3xl font-black">
                            MK
                        </AvatarFallback>
                    </Avatar>

                    <button className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/30 bg-[#1a120d] transition hover:bg-orange-500/20">
                        <Camera className="h-4 w-4 text-orange-400" />
                    </button>
                </div>

                <h2 className="mt-4 text-xl font-bold text-white">
                    Nguyễn Minh Khoa
                </h2>

                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-center mt-1 text-[#b9aaa2]">
                    <GraduationCap className="h-3 w-3" />
                    FPT University · HCMC · K17
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                    <Badge className="bg-primary/15 text-primary border border-primary/30">
                        <Trophy className="h-3 w-3" />
                        Champion
                    </Badge>

                    <Badge variant="outline" className="border-white/10 bg-white/5 text-white">
                        Lv. 14
                    </Badge>
                </div>

                {/* STATS */}
                <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                    {[
                        { label: "EVENTS", value: 6 },
                        { label: "TEAMS", value: 3 },
                        { label: "AWARDS", value: 4 },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-xl border border-white/10 bg-black/40 py-2.5"
                        >
                            <div className="text-[10px] tracking-wider uppercase text-[#8d7d74]">
                                {item.label}
                            </div>

                            <div className="text-primary text-base font-bold text-orange-500">
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* SOCIAL */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:border-orange-500/30">
                        <FaGithub className="h-4 w-4 text-white" />
                    </button>

                    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition hover:border-orange-500/30">
                        <FaLinkedinIn className="h-4 w-4 text-white" />
                    </button>
                </div>
            </CardContent>
        </Card >
    );
}