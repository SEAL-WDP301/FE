import { Camera, Mail, MapPin, Phone } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";


export function ProfileCard() {
    return (
        <Card glow className="overflow-hidden border-orange-500/20 bg-card">
            <CardContent className="p-8 text-center">
                <div className="relative mx-auto w-fit">
                    <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-2xl" />
                    <Avatar className="relative mx-auto h-28 w-28 border border-orange-500/30 ring-4 ring-primary/25">
                        <AvatarFallback className="bg-gradient-to-br from-[#ff8a3d] to-[#f37021] text-3xl font-black text-white">
                            NM
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
                    Dr. Nguyen Minh
                </h2>

                <div className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    Senior Judge · AI / ML Track
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
                        minh.n@fpt.edu.vn
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        +84 90 123 4567
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        Ho Chi Minh City, Vietnam
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
