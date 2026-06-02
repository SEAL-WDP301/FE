"use client";

import { AlarmClock } from "lucide-react";

const deadlines = [
    {
        title: "Submission Deadline",
        timeLeft: "2d 4h",
        progress: 70,
    },
    {
        title: "Final Scoring Deadline",
        timeLeft: "5d 12h",
        progress: 40,
    },
];

export default function UpcomingDeadlines() {
    return (
        <div className="rounded-xl border p-5">
            <div className="flex items-center gap-2 mb-5">
                <AlarmClock size={18} />
                <h2 className="font-semibold">
                    Upcoming Deadlines
                </h2>
            </div>

            <div className="space-y-4">
                {deadlines.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-lg border p-3"
                    >
                        <div className="flex justify-between">
                            <span>{item.title}</span>

                            <span className="font-medium">
                                {item.timeLeft}
                            </span>
                        </div>

                        <div className="mt-3">
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-primary transition-all duration-500"
                                    style={{
                                        width: `${item.progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}