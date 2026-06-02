"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { TeamListPanel } from "./components/team-list-pannel";
import { TeamHeader } from "./components/team-header";
import { SubmissionLinks } from "./components/submisson-link";
import { CriteriaScoring } from "./components/criteria-score";
import { ScoreSummary } from "./components/score-summary";
import { PanelLeftOpen } from "lucide-react";

export default function EvaluationPage() {
    const [selectedTeam, setSelectedTeam] = useState("1");
    const [collapsed, setCollapsed] = useState(false);
    const [scores, setScores] = useState<Record<string, number>>({
        "1": 8.5,
        "2": 9.0,
        "3": 8.0,
        "4": 8.8,
        "5": 9.1,
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="mt-3 text-5xl font-bold tracking-tight text-muted-foreground">
                    Evalution
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    Unified judging workspace — pick a team on the left, review submissions and score them on the right.
                </p>
            </div>

            <div className="mt-6 flex h-[calc(100vh-120px)] gap-5 overflow-hidden">
                <motion.aside
                    animate={{
                        width: collapsed ? 0 : 340,
                        opacity: collapsed ? 0 : 1,
                    }}
                    transition={{
                        duration: 0.35,
                        ease: "easeInOut",
                    }}
                    className="shrink-0 overflow-hidden"
                >
                    <TeamListPanel
                        selectedTeam={selectedTeam}
                        setSelectedTeam={setSelectedTeam}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                    />
                </motion.aside>

                <main className="flex-1 overflow-y-auto pr-2">

                    {collapsed && (
                        <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setCollapsed(false)}
                            className="
                    mb-5
                    flex items-center gap-2
                    rounded-2xl
                    border border-white/10
                    bg-card/40
                    px-5 py-3
                    hover:border-orange-500/40
                    hover:bg-orange-500/10
                "
                        >
                            <PanelLeftOpen size={16} />
                            Show teams
                        </motion.button>
                    )}

                    <TeamHeader teamId={selectedTeam} />

                    <div className="mt-8">
                        <SubmissionLinks />
                    </div>
                    
                    <div className="mt-10">
                        <h2 className="mb-6 text-3xl font-bold">
                            Criteria & Scoring
                        </h2>
                        <div className="mt-8 grid gap-8 xl:grid-cols-12">
                            <div className="xl:col-span-8">
                                <CriteriaScoring
                                    scores={scores}
                                    setScores={setScores}
                                />
                            </div>

                            <div className="xl:col-span-4">
                                <ScoreSummary
                                    scores={scores}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div >
    );
}