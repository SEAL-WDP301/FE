"use client";

import {
    Clock,
    Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

const schedules = [
    {
        id: 1,
        title: "AI Track Evaluation",
        time: "09:00",
        teams: 8,
        status: "Upcoming",
    },
    {
        id: 2,
        title: "Final Review",
        time: "14:00",
        teams: 4,
        status: "Upcoming",
    },
];

export default function ScheduleDetailPanel() {
    return (
        <div className="rounded-xl border p-4 h-full">
            <h3 className="font-semibold mb-4">
                Schedule Details
            </h3>

            <div className="space-y-3">
                {schedules.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-lg p-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="font-medium">
                                {item.title}
                            </div>

                            <Badge>{item.status}</Badge>
                        </div>

                        <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                {item.time}
                            </div>

                            <div className="flex items-center gap-1">
                                <Users size={14} />
                                {item.teams} Teams
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}