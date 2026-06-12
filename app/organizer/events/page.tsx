"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Search, Calendar, Users, Trophy } from "lucide-react";
import { format } from "date-fns"

export default function OrganizerEventsPage() {
    const { data: events, isLoading, isError } = useQuery({
        queryKey: ['organizerEvents'],
        queryFn: async () => {
            const res = await axiosClient.get('/organizer/events');
            return res.data.data;
        },
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
            case 'ongoing': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            case 'closed': return 'bg-green-500/10 text-green-600 border-green-500/20';
            default: return 'bg-muted text-muted-foreground border-border';
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Events Management</h1>
                    <p className="text-muted-foreground mt-1">Create, manage and monitor all your hackathons.</p>
                </div>
                <Link href="/organizer/events/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Event
                    </Button>
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search events..." 
                        className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    {['All', 'Active', 'Ongoing', 'Closed'].map((filter) => (
                        <button key={filter} className="px-4 py-2 text-sm font-medium bg-card border border-border rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                </div>
            ) : isError ? (
                <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
                    Failed to load events. Please check your permissions or network.
                </div>
            ) : events?.length === 0 ? (
                <div className="p-12 text-center bg-card border border-dashed border-border rounded-xl">
                    <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-1">No events found</h3>
                    <p className="text-muted-foreground mb-6">You haven&apos;t created any events yet.</p>
                    <Link href="/organizer/events/create">
                        <Button variant="outline" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create your first event
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {events?.map((event: any) => (
                        <div key={event.id} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-500/30 transition-all duration-300 group flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(event.status)} uppercase tracking-wider`}>
                                        {event.status}
                                    </div>
                                    <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                        {event.season} {event.year}
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-500 transition-colors line-clamp-1">
                                    {event.name}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                                    {event.description}
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>{event.startDate ? format(new Date(event.startDate), 'MMM dd, yyyy') : 'TBA'}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="h-4 w-4 mr-2" />
                                        <span>{event.tracks?.length || 0} Tracks</span>
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Trophy className="h-4 w-4 mr-2" />
                                        <span>{event.prize1st || 'TBA'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="border-t border-border p-4 bg-muted/30 flex justify-between items-center">
                                <div className="text-xs text-muted-foreground">
                                    Created by Admin
                                </div>
                                <Link href={`/organizer/events/${event.id}`}>
                                    <Button size="sm" variant="outline" className="border-blue-500/20 hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-900/20">
                                        Manage Event
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
