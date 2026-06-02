import { Building2, Tag, Users } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";

interface TeamHeaderProps {
    teamId: string;
}

const mockTeams = [
    {
        id: "1",
        name: "Hexavolt",
        university: "FPTU HCMC",
        category: "AI/ML",
        round: "Semi Final",
        status: "Submitted",
        members: 4,
    },
    {
        id: "2",
        name: "Neon Pulse",
        university: "FPTU HCMC",
        category: "Cloud",
        round: "Final",
        status: "Completed",
        members: 5,
    },
    {
        id: "3",
        name: "Aether Stack",
        university: "FPTU Hanoi",
        category: "AI/ML",
        round: "Round 2",
        status: "Submitted",
        members: 4,
    },
    {
        id: "4",
        name: "Quantum Foxes",
        university: "FPTU HCMC",
        category: "Web3",
        round: "Round 1",
        status: "In Review",
        members: 4,
    },
    {
        id: "5",
        name: "Apex Coders",
        university: "RMIT",
        category: "Cloud",
        round: "Semi Final",
        status: "Pending",
        member: 5,
    },
];

export function TeamHeader({ teamId }: TeamHeaderProps) {
    const team = mockTeams.find((t) => t.id === teamId);

    if (!team) {
        return (
            <GlassCard className="p-6">
                <p>Team not found</p>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-black">
                    {team.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">
                            {team.name}
                        </h2>

                        <Badge>
                            {team.status}
                        </Badge>
                    </div>

                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm">
                            <Building2 size={16} />
                            {team.university}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Tag size={16} />
                            {team.category}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <Users size={16} />
                            {team.members} Members
                        </div>
                    </div>
                </div>

                <Badge variant="success">
                    {team.round}
                </Badge>
            </div>
        </GlassCard>
    );
}