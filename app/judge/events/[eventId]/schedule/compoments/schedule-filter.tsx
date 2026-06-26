"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Filter } from "lucide-react";

export default function ScheduleFilters() {
    return (
        <div className="flex flex-wrap gap-3 items-center rounded-xl border p-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Filter size={16} />
                Filters
            </div>

            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Event" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                </SelectContent>
            </Select>

            <Select>
                <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}