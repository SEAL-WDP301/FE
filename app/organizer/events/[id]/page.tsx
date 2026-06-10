"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams} from "next/navigation";
import { ArrowLeft, Settings, Users, GitMerge, FileText } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsTab from "./components/teams-tab";
import { Button } from "@/components/ui/button";

export default function OrganizerEventControlRoom() {
    const params = useParams();
    const eventId = params.id as string;

    const { data: event, isLoading, isError } = useQuery({
        queryKey: ['organizerEvent', eventId],
        queryFn: async () => {
            const res = await axiosClient.get(`/public/events/${eventId}`);
            return res.data.data;
        },
    });

    if (isLoading) {
        return (
            <div className="p-8 flex justify-center items-center h-full">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isError || !event) {
        return (
            <div className="p-8">
                <div className="text-center text-red-500 bg-red-500/10 p-6 rounded-xl border border-red-500/20 max-w-lg mx-auto mt-20">
                    Failed to load event details.
                    <br />
                    <Link href="/organizer/events" className="text-blue-500 hover:underline mt-4 block">
                        &larr; Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link href="/organizer/events" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Events
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">{event.name}</h1>
                        <p className="text-muted-foreground mt-1 text-sm">
                            Control Room • {event.season} {event.year} • <span className="uppercase text-blue-500 font-medium">{event.status}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Tabs */}
            <Tabs defaultValue="teams" className="space-y-6">
                <TabsList className="bg-card border border-border">
                    <TabsTrigger value="overview" className="gap-2">
                        <Settings className="h-4 w-4" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="tracks" className="gap-2">
                        <GitMerge className="h-4 w-4" /> Tracks
                    </TabsTrigger>
                    <TabsTrigger value="teams" className="gap-2">
                        <Users className="h-4 w-4" /> Teams
                    </TabsTrigger>
                    <TabsTrigger value="submissions" className="gap-2">
                        <FileText className="h-4 w-4" /> Submissions
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="bg-card border border-border p-6 rounded-xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold mb-1">Event Settings</h3>
                            <p className="text-muted-foreground text-sm">General settings, descriptions, dates, and prize configurations.</p>
                        </div>
                        <Link href={`/organizer/events/${eventId}/edit`}>
                            <Button variant="outline" className="gap-2 border-blue-500/20 text-blue-600 hover:bg-blue-50">
                                <Settings className="h-4 w-4" />
                                Edit Event
                            </Button>
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                        <div>
                            <p className="text-sm text-muted-foreground">Description</p>
                            <p className="font-medium mt-1">{event.description || "No description provided."}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">GitHub Organization</p>
                            <p className="font-medium mt-1">
                                {event.githubOrgUrl ? (
                                    <a href={event.githubOrgUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                        {event.githubOrgUrl}
                                    </a>
                                ) : "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Registration Deadline</p>
                            <p className="font-medium mt-1">{event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleString() : "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Start Date</p>
                            <p className="font-medium mt-1">{event.startDate ? new Date(event.startDate).toLocaleString() : "N/A"}</p>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                        <h4 className="font-medium mb-3">Prizes</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-muted p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">1st Prize</p>
                                <p className="font-semibold">{event.prize1st || "TBA"}</p>
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">2nd Prize</p>
                                <p className="font-semibold">{event.prize2nd || "TBA"}</p>
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">3rd Prize</p>
                                <p className="font-semibold">{event.prize3rd || "TBA"}</p>
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">Honorable Mention</p>
                                <p className="font-semibold">{event.prizeHonorable || "TBA"}</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="tracks" className="bg-card border border-border p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Competition Tracks</h3>
                    <p className="text-muted-foreground">Manage the different tracks available for this event.</p>
                    <div className="h-64 border border-dashed border-border rounded-lg mt-4 flex items-center justify-center text-muted-foreground">
                        Tracks Configuration (Coming Soon)
                    </div>
                </TabsContent>

                <TabsContent value="teams">
                    {/* Dedicated component for Team Management */}
                    <TeamsTab event={event} />
                </TabsContent>

                <TabsContent value="submissions" className="bg-card border border-border p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Submissions</h3>
                    <p className="text-muted-foreground">Review and grade team submissions.</p>
                    <div className="h-64 border border-dashed border-border rounded-lg mt-4 flex items-center justify-center text-muted-foreground">
                        Submissions Review (Coming Soon)
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
