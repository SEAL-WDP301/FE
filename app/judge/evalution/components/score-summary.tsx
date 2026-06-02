import { Save, Send } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";

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
}

export function ScoreSummary({
    scores,
}: Props) {
    return (
        <GlassCard className="h-fit w-full p-8">
            <div className="text-sx uppercase tracking-widest text-muted-foreground">
                Final Score
            </div>

            <div className="mt-2 text-5xl font-bold text-primary">
                <span className="text-7xl font-black text-orange-500">
                    8.92
                </span>
                <span className="pb-3 text-xl text-muted-foreground">
                    /10
                </span>
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
                Raw average: 8.73
            </div>

            <div className="mt-6 space-y-4">
                {criteria.map((item) => (
                    <div key={item.id}>
                        <div className="mb-1 flex justify-between text-sm">
                            <span>{item.name}</span>

                            <span>
                                {(scores[item.id] * item.weight / 100).toFixed(2)}
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-white/5">
                            <div
                                className="h-full bg-orange-500"
                                style={{
                                    width: `${scores[item.id] * 10}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex gap-2">
                <Button
                    variant="outline"
                    className="flex-1"
                >
                    <Save size={16} />
                    Save Draft
                </Button>

                <Button className="flex-1">
                    <Send size={16} />
                    Submit
                </Button>
            </div>
        </GlassCard >
    );
}