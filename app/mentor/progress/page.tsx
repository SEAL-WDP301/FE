import { Eye, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { MentorPageHeader } from "../_components/mentor-page-header";
import { ProgressBar } from "../_components/progress-bar";
import { RiskBadge, TeamStatusBadge } from "../_components/status-badges";
import { teams } from "../mock-data";

export default function TeamProgressPage() {
    return (
        <div className="mx-auto max-w-[1500px] space-y-6">
            <MentorPageHeader title="Team Progress" subtitle="Progress analytics, milestone tracking, heatmaps, and team risk monitoring." />

            <section className="grid gap-4 md:grid-cols-4">
                {[
                    ["Average Progress", "69%"],
                    ["Behind Schedule", "3"],
                    ["Milestone Completion", "74%"],
                    ["Active Teams", "11"],
                ].map(([label, value]) => (
                    <GlassCard key={label} className="rounded-[22px] bg-card p-5">
                        <TrendingUp className="h-5 w-5 text-orange-400" />
                        <p className="mt-4 text-sm text-muted-foreground">{label}</p>
                        <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
                    </GlassCard>
                ))}
            </section>

            <GlassCard className="rounded-[24px] bg-card p-6">
                <h2 className="text-lg font-semibold text-white">Progress Management Table</h2>
                <div className="mt-5">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-white/10 hover:bg-transparent">
                                {["Team", "Project", "Current milestone", "Completion", "Last update", "Risk", "Mentor status", "Actions"].map((head) => (
                                    <TableHead key={head} className="text-muted-foreground">{head}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teams.map((team) => (
                                <TableRow key={team.name} className="border-white/10 hover:bg-white/[0.03]">
                                    <TableCell className="font-semibold text-white">{team.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{team.project}</TableCell>
                                    <TableCell className="text-muted-foreground">{team.milestone}</TableCell>
                                    <TableCell className="min-w-36">
                                        <ProgressBar value={team.progress} />
                                        <span className="mt-1 block text-xs text-orange-300">{team.progress}%</span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{team.lastActivity}</TableCell>
                                    <TableCell><RiskBadge risk={team.risk} /></TableCell>
                                    <TableCell><TeamStatusBadge status={team.status} /></TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" className="rounded-xl text-orange-400">
                                            <Eye className="h-4 w-4" />
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </GlassCard>
        </div>
    );
}
