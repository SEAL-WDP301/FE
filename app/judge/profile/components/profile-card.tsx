"use client";

import { Camera, Mail, MapPin, Phone } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";

export function ProfileCard() {
    const { data: user } = useQuery<any>({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const res = await axiosClient.get("/users/profile");
            return res.data?.data ?? null;
        }
    });

    return (
        <Card glow className="overflow-hidden border-orange-500/20 bg-card">
            <CardContent className="p-8 text-center">
                <div className="relative mx-auto w-fit">
                    <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-2xl" />
                    <Avatar className="relative mx-auto h-28 w-28 border border-orange-500/30 ring-4 ring-primary/25">
                        {user?.avatarUrl && <AvatarImage src={user.avatarUrl} alt="Avatar" />}
                        <AvatarFallback className="bg-gradient-to-br from-[#ff8a3d] to-[#f37021] text-3xl font-black text-white">
                            {user?.name ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "J"}
                        </AvatarFallback>
                    </Avatar>

                    <button
                        type="button"
                        aria-label="Change avatar"
                        className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/30 bg-card text-orange-400 shadow-lg shadow-orange-500/10 transition hover:-translate-y-0.5 hover:border-orange-500/50 hover:bg-orange-500/10"
                    >
                        <Camera className="h-4 w-4 text-orange-400" />
                    </button>
                </div>

                <h2 className="mt-5 text-xl font-bold text-foreground">
                    {user?.name || "Loading..."}
                </h2>

                <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground capitalize">
                    {user?.role || "Judge"} · {user?.profile?.jobTitle || "Judge"}
                </div>

                <div className="mt-3 flex items-center justify-center gap-2">
                    <Badge className="border border-primary/30 bg-primary/15 text-primary">
                        Tier 1
                    </Badge>

                    <Badge variant="outline" className="border-border bg-muted text-foreground">
                        FPTU HCMC
                    </Badge>
                </div>

                <div className="mt-5 space-y-2 text-left text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        {user?.email || "N/A"}
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        Vietnam
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
