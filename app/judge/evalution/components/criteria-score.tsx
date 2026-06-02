"use client";

import { useState } from "react";

import { GlassCard } from "@/components/ui/glass-card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const criteria = [
    {
        id: "1",
        name: "Innovation",
        weight: 30,
        description: "Originality, creative problem framing & novel approach.",
    },
    {
        id: "2",
        name: "Technical",
        weight: 25,
        description: "Code quality, architecture, performance & engineering rigor.",
    },
    {
        id: "3",
        name: "UX/UI Design",
        weight: 20,
        description: "Usability, visual polish, interaction design & accessibility.",
    },
    {
        id: "4",
        name: "Business Potential",
        weight: 15,
        description: "Market fit, scalability & monetization strategy.",
    },
    {
        id: "5",
        name: "Presentation",
        weight: 10,
        description: "Storytelling, demo clarity & pitch effectiveness.",
    },
];

interface Props {
    scores: Record<string, number>;
    setScores: React.Dispatch<
        React.SetStateAction<Record<string, number>>
    >;
}

export function CriteriaScoring({
    scores,
    setScores,
}: Props) {

    return (
        <div className="space-y-6 w-full">
            {criteria.map((item) => (
                <GlassCard
                    key={item.id}
                    className="p-8"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold">
                                    {item.name}
                                </h3>

                                <Badge variant="highlight">
                                    Weight {item.weight}%
                                </Badge>
                            </div>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {item.description}
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="text-4xl font-bold text-orange-500">
                                {scores[item.id].toFixed(1)}
                            </div>

                            <span className="text-xs text-muted-foreground">
                                /10
                            </span>
                        </div>
                    </div>
                    <div className="mt-5 flex items-center gap-4">
                        <Slider
                            value={[scores[item.id]]}
                            max={10}
                            min={0}
                            step={0.5}
                            className="flex-1"
                        />

                        <Input
                            value={scores[item.id]}
                            className="w-24 text-center"
                        />
                    </div>

                    <Textarea
                        className="mt-4 min-h-[90px]"
                        placeholder="Judge note - optional comments"
                    />
                </GlassCard>
            ))}
        </div>
    );
}