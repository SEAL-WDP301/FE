"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getPublicEvents } from "@/lib/api/public-events.api";

export default function FeaturedHero() {
    const { data: events, isLoading } = useQuery({
        queryKey: ['publicEvents'],
        queryFn: getPublicEvents,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    if (isLoading) {
        return (
            <section className="relative overflow-hidden bg-background py-24 sm:py-32 flex justify-center items-center min-h-[600px]">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-orange-500"></div>
            </section>
        );
    }

    const latestEvent = events?.[0];

    if (!latestEvent) {
        return null; // or a fallback static hero
    }

    // Generic highlight logic: Take the last two words and highlight them
    const words = latestEvent.name ? latestEvent.name.split(' ') : ['Featured', 'Event'];
    const highlightWords = words.length >= 2 ? words.slice(-2).join(' ') : words.slice(-1).join(' ');
    const regularWords = words.length >= 2 ? words.slice(0, -2).join(' ') : '';

    const imageUrl = latestEvent.image_url || "/images/rag_system.png";
    
    let formattedDate = `${latestEvent.season || ''} ${latestEvent.year || ''}`;
    try {
        if (latestEvent.registration_deadline) {
            formattedDate = `Deadline: ${format(new Date(latestEvent.registration_deadline), "MMM dd, yyyy")}`;
        }
    } catch {
        // fallback to season/year if parsing fails
    }

    return (
        <section className="relative overflow-hidden bg-background py-24 sm:py-32">
            {/* Background Grid and Glow */}
            <div className="absolute inset-0 seal-grid opacity-50"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none"></div>

            <div className="container relative z-10 mx-auto px-6 lg:px-8 grid gap-12 lg:grid-cols-2 lg:items-center">
                {/* Left Column: Image */}
                <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border shadow-2xl seal-glow-soft">
                    <Image 
                        src={imageUrl} 
                        alt={latestEvent.name || "Event Image"} 
                        fill 
                        className="object-cover" 
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                    />
                </div>

                {/* Right Column: Content */}
                <div className="flex flex-col items-start text-left">
                    {/* Headlines */}
                    <h1 className="mb-6 max-w-4xl font-sans text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                        {regularWords} <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">{highlightWords}</span>
                    </h1>

                    <p className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                        {latestEvent.description || "Join a community of innovators and future-proof your skills with cutting-edge technologies that are reshaping our digital landscape."}
                    </p>

                    {/* Metadata */}
                    <div className="mb-12 flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
                        <div className="flex items-center gap-2 rounded-xl bg-card/50 px-4 py-2 border border-border backdrop-blur-sm">
                            <CalendarDays className="size-4 text-orange-500" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl bg-card/50 px-4 py-2 border border-border backdrop-blur-sm">
                            <MapPin className="size-4 text-orange-500" />
                            <span>Online / Innovation Hub</span>
                        </div>
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-1.5 text-sm font-medium text-green-400 backdrop-blur-sm">
                            {latestEvent.status === 'active' ? (
                                <span className="relative flex size-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
                                </span>
                            ) : (
                                <span className="relative flex size-2">
                                    <span className="relative inline-flex size-2 rounded-full bg-muted-foreground"></span>
                                </span>
                            )}
                            <span className="uppercase">{latestEvent.status === 'active' ? 'LIVE' : (latestEvent.status || 'CLOSED')}</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <Button 
                        asChild
                        size="lg" 
                        className="relative h-14 rounded-lg bg-orange-500 px-8 text-lg font-bold text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-orange-600 hover:shadow-[0_0_40px_-10px_rgba(243,112,33,0.8)]"
                    >
                        <Link href={`/home/events/${latestEvent.id}`}>
                            View detail
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
