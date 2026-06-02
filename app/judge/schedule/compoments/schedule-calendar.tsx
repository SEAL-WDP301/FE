"use client";

import { useState } from "react";

const mockDays = Array.from({ length: 35 }, (_, i) => i + 1);

export default function ScheduleCalendar() {
    const [selectedDay, setSelectedDay] = useState(1);

    return (
        <div className="rounded-xl border overflow-hidden">
            <div className="grid grid-cols-7 bg-muted">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <div
                        key={day}
                        className="p-3 text-center font-medium"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {mockDays.map((day) => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`border h-28 p-2 text-left transition
            ${selectedDay === day
                                ? "bg-primary/10 border-primary"
                                : ""
                            }`}
                    >
                        <div className="font-medium">{day}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}