"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";

  // Placeholder fields, we'll map real data to this later

export function PersonalInformation() {
    const { data: user } = useQuery<any>({
        queryKey: ["userProfile"],
        queryFn: async () => {
            const res = await axiosClient.get("/users/profile");
            return res.data?.data ?? null;
        }
    });

    const fields = [
        {
            label: "Full name",
            value: user?.name || "N/A",
        },
        {
            label: "Email",
            value: user?.email || "N/A",
        },
        {
            label: "Title",
            value: user?.profile?.jobTitle || "Judge",
        },
        {
            label: "Organization",
            value: user?.profile?.organization || "N/A",
        },
    ];

    return (
        <GlassCard>
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                    Personal Information
                </h3>

                <Button size="sm">
                    <Save className="h-3.5 w-3.5" />
                    Save
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {fields.map((field) => (
                    <div key={field.label}>
                        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            {field.label}
                        </Label>

                        <Input
                            defaultValue={field.value}
                            className="mt-2"
                        />
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}