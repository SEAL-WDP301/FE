"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const EVENT_CATEGORIES = ["All", "AI", "Web3", "Hackathon", "Research"];

const MOCK_EVENTS = [
    {
        id: 1,
        title: "AI Innovation Challenge 2025",
        description: "A groundbreaking competition focusing on generative AI solutions for real-world problems. Over 500 participants showcased incredible projects.",
        category: "AI",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop",
        tags: ["#AI", "#Innovation", "#Finished"]
    },
    {
        id: 2,
        title: "Web3 Builders Hackathon",
        description: "Empowering developers to build decentralized applications. Winning projects included innovative DeFi protocols and NFT platforms.",
        category: "Web3",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop",
        tags: ["#Web3", "#Blockchain", "#Finished"]
    },
    {
        id: 3,
        title: "Global Tech Hackathon",
        description: "A 48-hour intense coding marathon where teams built creative solutions across various domains from healthcare to education.",
        category: "Hackathon",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop",
        tags: ["#Hackathon", "#Coding", "#Finished"]
    },
    {
        id: 4,
        title: "Deep Learning Symposium",
        description: "Researchers gathered to present cutting-edge papers on deep learning architectures and optimization techniques.",
        category: "Research",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
        tags: ["#Research", "#DeepLearning", "#Finished"]
    },
    {
        id: 5,
        title: "DeFi Solutions Sprint",
        description: "Focused on creating the next generation of decentralized finance tools to improve financial inclusion globally.",
        category: "Web3",
        image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1600&auto=format&fit=crop",
        tags: ["#Web3", "#DeFi", "#Finished"]
    },
    {
        id: 6,
        title: "NLP Model Fine-tuning Contest",
        description: "Teams competed to achieve the highest accuracy and efficiency in fine-tuning large language models on custom datasets.",
        category: "AI",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1600&auto=format&fit=crop",
        tags: ["#AI", "#NLP", "#Finished"]
    }
];

export default function PastEvents() {
    const [activeTab, setActiveTab] = useState("All");

    const filteredEvents = activeTab === "All" 
        ? MOCK_EVENTS 
        : MOCK_EVENTS.filter(event => event.category === activeTab);

    return (
        <section className="bg-background py-20">
            <div className="container mx-auto px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-12 border-b border-border pb-6">
                    <h2 className="text-3xl font-semibold text-foreground">Our Completed Competitions</h2>
                    <p className="mt-2 text-muted-foreground">Explore past events and see what our community has built.</p>
                </div>

                {/* Filter / Tabs */}
                <div className="mb-10 flex flex-wrap gap-2">
                    {EVENT_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                                activeTab === category 
                                    ? "bg-orange-500 text-primary-foreground" 
                                    : "bg-card text-muted-foreground hover:bg-card/80 hover:text-foreground border border-border"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEvents.map((event) => (
                        <div 
                            key={event.id} 
                            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/10"
                        >
                            {/* Header Image (16:9) */}
                            <div className="relative aspect-video w-full overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-6">
                                {/* Tags */}
                                <div className="mb-3 flex flex-wrap gap-2">
                                    {event.tags.map(tag => (
                                        <span key={tag} className="text-xs font-semibold text-orange-500">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Title */}
                                <h3 className="mb-3 text-xl font-bold text-card-foreground transition-colors duration-300 group-hover:text-orange-500">
                                    {event.title}
                                </h3>

                                {/* Description */}
                                <p className="mb-6 text-sm text-muted-foreground line-clamp-3">
                                    {event.description}
                                </p>

                                {/* Footer Card */}
                                <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                                    <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                        <span className="size-2 rounded-full bg-muted-foreground"></span>
                                        Ended
                                    </span>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="border-border bg-transparent text-foreground hover:bg-foreground hover:text-background"
                                    >
                                        View Highlights
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
