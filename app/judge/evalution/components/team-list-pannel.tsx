"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    ChevronDown,
    ArrowUpDown,
    PanelLeftClose,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const teams = [
    {
        id: "1",
        name: "Hexavolt",
        university: "FPTU HCMC",
        category: "AI/ML",
        score: 9.1,
        status: "In Review",
    },
    {
        id: "2",
        name: "Neon Pulse",
        university: "FPTU HCMC",
        category: "Cloud",
        score: 8.7,
        status: "Completed",
    },
    {
        id: "3",
        name: "Aether Stack",
        university: "FPTU Hanoi",
        category: "AI/ML",
        score: 8.5,
        status: "In Review",
    },
    {
        id: "4",
        name: "Quantum Foxes",
        university: "FPTU HCMC",
        category: "Web3",
        score: 8.2,
        status: "In Review",
    },
    {
        id: "5",
        name: "Apex Coders",
        university: "RMIT",
        category: "Cloud",
        score: 7.9,
        status: "Pending",
    },
];

interface Props {
    selectedTeam: string;
    setSelectedTeam: (id: string) => void;
    collapsed: boolean;
    setCollapsed: (value: boolean) => void;
}

export function TeamListPanel({
    selectedTeam,
    setSelectedTeam,
    collapsed,
    setCollapsed,
}: Props) {
    const [status, setStatus] = useState("All");
    const [search, setSearch] = useState("");

    const filteresTeam = useMemo(() => {
        return teams.filter((team) => {
            const matchSearch = team.name.toLowerCase().includes(search.toLowerCase());

            const matchStatus = status === "All" ? true : team.status === status;

            return matchSearch && matchStatus;
        });
    }, [search, status]);

    return (
        <motion.aside
            initial={false}
            animate={{
                width: collapsed ? 0 : 340,
                opacity: collapsed ? 0 : 1,
                x: collapsed ? -40 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
            }}
            className="
        hidden
        lg:flex
        shrink-0
        overflow-hidden
      "
        >
            <GlassCard className="flex h-[calc(100vh-180px)] w-[340px] flex-col overflow-hidden">
                {/* Header */}
                <div className="shrink-0 border-b border-white/10 p-5">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            Assigned Teams · {teams.length}
                        </h3>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setCollapsed(true)}
                        >
                            <PanelLeftClose size={16} />
                        </Button>
                    </div>

                    {/* Search */}
                    <div className="relative mb-3">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />

                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search teams..."
                            className="pl-10"
                        />
                    </div>

                    {/* Filters */}
                    <div className="mb-3 flex gap-2">
                        <Button
                            variant="outline"
                            className="flex-1 justify-between"
                        >
                            All categories
                            <ChevronDown size={16} />
                        </Button>

                        <Button
                            variant="outline"
                            className="w-28"
                        >
                            <ArrowUpDown
                                size={14}
                                className="mr-2"
                            />
                            Score
                        </Button>
                    </div>

                    {/* Tabs */}
                    <div className="flex rounded-xl bg-muted/20 p-1">
                        {["All", "Pending", "In Review", "Completed"].map((item) => (
                            <button
                                key={item}
                                onClick={() => setStatus(item)}
                                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium capitalize transition
                            ${status === item
                                        ? "bg-orange-500 text-black"
                                        : "text-muted-foreground hover:text-white"
                                    }`}
                            >
                                {item === "In Review"
                                    ? "Review"
                                    : item === "Completed"
                                        ? "Done"
                                        : item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Team List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {filteresTeam.map((team) => (
                        <button
                            key={team.id}
                            onClick={() => setSelectedTeam(team.id)}
                            className={`
                            w-full rounded-2xl border p-4 text-left transition-all
                            ${selectedTeam === team.id
                                    ? "border-orange-500 bg-orange-500/10 shadow-[0_0_25px_rgba(249,115,22,.25)]"
                                    : "border-white/10 hover:border-orange-500/30"
                                }
                        `}
                        >
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 font-bold text-black">
                                    {team.name
                                        .split(" ")
                                        .map((word) => word[0])
                                        .join("")
                                        .slice(0, 2)}
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold">
                                                {team.name}
                                            </h4>

                                            <p className="text-xs text-muted-foreground">
                                                {team.university}
                                            </p>
                                        </div>

                                        <span className="text-lg font-bold text-orange-500">
                                            {team.score}
                                        </span>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge variant="outline">
                                            {team.category}
                                        </Badge>

                                        <span className="text-xs text-orange-400">
                                            • {team.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </GlassCard>
        </motion.aside>
    );
}