"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Settings, Users, GitMerge, FileText } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamsTab from "./components/teams-tab";

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

                <TabsContent value="overview" className="bg-card border border-border p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Event Settings</h3>
                    <p className="text-muted-foreground">General settings, descriptions, dates, and prize configurations.</p>
                    {/* To be implemented */}
                    <div className="h-64 border border-dashed border-border rounded-lg mt-4 flex items-center justify-center text-muted-foreground">
                        Overview Configuration (Coming Soon)
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
