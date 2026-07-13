"use client";

import { useForm, useFieldArray, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Info, Trophy, GitMerge, FileText, Calendar, Link as LinkIcon, Loader2, Save, X, CheckCircle2, MapPin, Phone, HelpCircle, ListChecks, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    createOrganizerEvent,
    updateOrganizerEvent,
    type OrganizerEvent,
    type OrganizerEventPayload,
} from "@/lib/api/organizer-events.api";

const defaultLocation = {
    venueName: "FPT University Ho Chi Minh City",
    room: "Innovation Hall",
    address: "Lô E2a-7, Đường D1, Khu Công nghệ cao, TP. Thủ Đức, TP.HCM",
    meetingPlatform: "Google Meet",
    meetingUrl: "",
    mapUrl: "",
    note: "Teams will receive detailed room allocation before the event day.",
};

const defaultContacts = [
    {
        label: "Organizer Support",
        name: "SEAL Organizing Committee",
        email: "seal@fe.edu.vn",
        phone: "",
        detail: "Questions about registration, teams, schedules, and event logistics.",
        responseTime: "Within 24 hours",
    },
    {
        label: "Technical Support",
        name: "SEAL Technical Team",
        email: "tech.seal@fe.edu.vn",
        phone: "",
        detail: "Support for GitHub, submissions, file upload, and workspace access.",
        responseTime: "During competition hours",
    },
];

const defaultRuleGroups = [
    {
        title: "Team Rules",
        itemsText: [
            "Each team must follow the official team size configured for its track.",
            "Participants must use their registered account and team workspace.",
            "Team members are responsible for keeping project work original and transparent.",
        ].join("\n"),
    },
    {
        title: "Submission Rules",
        itemsText: [
            "Submit before the round deadline shown in the event workspace.",
            "GitHub repositories or uploaded files must be accessible to organizers and judges.",
            "Late, inaccessible, or incomplete submissions may not be evaluated.",
        ].join("\n"),
    },
    {
        title: "Judging Rules",
        itemsText: [
            "Projects are evaluated using the official rubric for each round.",
            "Judge decisions are based on submitted work, presentation, and rule compliance.",
            "Organizers may request clarification when submission evidence is unclear.",
        ].join("\n"),
    },
];

const defaultFaqItems = [
    {
        question: "Who can join this event?",
        answer: "Students who meet the event eligibility rules can register individually or as part of a team, depending on organizer settings.",
    },
    {
        question: "Can a team update its submission?",
        answer: "Teams can update submissions while the round is still open. After the deadline, submissions are locked for evaluation.",
    },
    {
        question: "Where will announcements be posted?",
        answer: "Official announcements are posted in the event workspace and may also be sent through registered contact channels.",
    },
];

function linesToList(value?: string) {
    return (value || "")
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function normalizeRuleGroups(event?: OrganizerEvent) {
    if (!event?.ruleGroups?.length) return defaultRuleGroups;
    return event.ruleGroups.map((group) => ({
        title: group.title || group.name || group.category || "Rules",
        itemsText: (group.rules || []).join("\n"),
    }));
}

function normalizeFaqItems(event?: OrganizerEvent) {
    if (!event?.faqItems?.length) return defaultFaqItems;
    return event.faqItems.map((faq) => ({
        question: faq.question || faq.q || faq.title || "",
        answer: faq.answer || faq.a || faq.content || "",
    }));
}

const createEventSchema = (isEdit: boolean) => z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    description: z.string().max(2000, "Description is too long").optional(),
    imageUrl: z.string().url("Invalid image URL").optional().or(z.literal('')),
    season: z.enum(["Spring", "Summer", "Fall"]),
    year: z.coerce.number().int("Year must be an integer").min(2020, "Year must be >= 2020").max(new Date().getFullYear() + 5, "Year cannot exceed 5 years in the future"),
    status: z.enum(["draft", "active", "ongoing", "closed"]).optional(),
    registrationDeadline: z.string().optional(),
    startDate: z.string().optional(),
    githubOrgUrl: z.string().url("Invalid GitHub URL").includes("github.com", { message: "Must be a github.com URL" }).optional().or(z.literal('')),
    prize1st: z.string().optional(),
    prize2nd: z.string().optional(),
    prize3rd: z.string().optional(),
    prizeHonorable: z.string().optional(),
    tracks: z.array(z.object({
        id: z.number().optional(),
        _count: z.object({ teams: z.number().optional() }).optional(),
        name: z.string().min(1, "Track name is required"),
        description: z.string().optional(),
        maxTeams: z.union([z.coerce.number().int().min(1, "Must be >= 1").max(1000, "Max 1000 teams"), z.literal("")]).optional().transform(v => v === "" ? undefined : v as number | undefined),
        maxMembersPerTeam: z.union([z.coerce.number().int().min(1, "Must be >= 1").max(20, "Max 20 members"), z.literal("")]).optional().transform(v => v === "" ? undefined : v as number | undefined),
    })).min(1, "At least one track is required").default([{ name: "", description: "", maxTeams: 50, maxMembersPerTeam: 4 }]),
    rounds: z.array(z.object({
        id: z.number().optional(),
        _count: z.object({ submissions: z.number().optional() }).optional(),
        roundNumber: z.coerce.number().int().min(1, "Must be >= 1"),
        name: z.string().min(1, "Round name is required"),
        submissionType: z.enum(["github_link", "file"]),
        submissionDeadline: z.string().optional(),
        maxFileSizeMb: z.coerce.number().int().min(1, "Must be >= 1").max(500, "Max 500MB").default(20),
        isTrackSpecific: z.boolean().default(true),
    })).min(1, "At least one round is required").default([{ roundNumber: 1, name: "", submissionType: "file", submissionDeadline: "", maxFileSizeMb: 20, isTrackSpecific: true }]),
    location: z.object({
        venueName: z.string().optional(),
        room: z.string().optional(),
        address: z.string().optional(),
        meetingPlatform: z.string().optional(),
        meetingUrl: z.string().url("Invalid meeting URL").optional().or(z.literal("")),
        mapUrl: z.string().url("Invalid map URL").optional().or(z.literal("")),
        note: z.string().optional(),
    }).default(defaultLocation),
    contacts: z.array(z.object({
        label: z.string().optional(),
        name: z.string().optional(),
        email: z.string().email("Invalid email").optional().or(z.literal("")),
        phone: z.string().optional(),
        detail: z.string().optional(),
        responseTime: z.string().optional(),
    })).default(defaultContacts),
    ruleGroups: z.array(z.object({
        title: z.string().min(1, "Rule group title is required"),
        itemsText: z.string().optional(),
    })).default(defaultRuleGroups),
    faqItems: z.array(z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
    })).default(defaultFaqItems),
}).superRefine((data, ctx) => {
    const now = new Date();

    if (!isEdit && data.startDate) {
        if (new Date(data.startDate) <= now) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start date must be in the future", path: ["startDate"] });
        }
    }

    if (!isEdit && data.registrationDeadline) {
        if (new Date(data.registrationDeadline) <= now) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Registration deadline must be in the future", path: ["registrationDeadline"] });
        }
    }

    if (data.registrationDeadline && data.startDate) {
        if (new Date(data.registrationDeadline) > new Date(data.startDate)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Registration deadline must be before or equal to the event start date", path: ["registrationDeadline"] });
        }
    }

    const trackNames = data.tracks.map(t => t.name.trim().toLowerCase());
    if (new Set(trackNames).size !== trackNames.length) {
        trackNames.forEach((name, idx) => {
            if (trackNames.indexOf(name) !== idx) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Track names must be unique", path: ["tracks", idx, "name"] });
            }
        });
    }

    const roundNumbers = data.rounds.map(r => r.roundNumber);
    if (new Set(roundNumbers).size !== roundNumbers.length) {
        roundNumbers.forEach((num, idx) => {
            if (roundNumbers.indexOf(num) !== idx) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Round numbers must be unique", path: ["rounds", idx, "roundNumber"] });
            }
        });
    }

    data.rounds.forEach((round, idx) => {
        if (round.submissionDeadline) {
            const roundDate = new Date(round.submissionDeadline);
            if (data.startDate && roundDate < new Date(data.startDate)) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Round deadline must be after or at the same time as event start date", path: ["rounds", idx, "submissionDeadline"] });
            }
            if (idx > 0) {
                const prevRound = data.rounds[idx - 1];
                if (prevRound.submissionDeadline) {
                    if (roundDate < new Date(prevRound.submissionDeadline)) {
                        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Deadline must be after or equal to Round ${prevRound.roundNumber}`, path: ["rounds", idx, "submissionDeadline"] });
                    }
                }
            }
        }
    });
});

type EventFormValues = z.infer<ReturnType<typeof createEventSchema>>;

interface EventFormProps {
    initialData?: OrganizerEvent;
}

export default function EventForm({ initialData }: EventFormProps) {
    const router = useRouter();
    const isEdit = !!initialData;
    const [isLoading, setIsLoading] = useState(false);

    const defaultValues: Partial<EventFormValues> = {
        name: initialData?.name || "",
        description: initialData?.description || "",
        imageUrl: initialData?.imageUrl || initialData?.image_url || "",
        season: initialData?.season || "Spring",
        year: initialData?.year || new Date().getFullYear(),
        status: initialData?.status || "draft",
        registrationDeadline: initialData?.registrationDeadline ? new Date(initialData.registrationDeadline).toISOString().slice(0, 16) : "",
        startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 16) : "",
        githubOrgUrl: initialData?.githubOrgUrl || "https://github.com/DEMO-SEAL-HackaThon-ORG",
        prize1st: initialData?.prize1st || "",
        prize2nd: initialData?.prize2nd || "",
        prize3rd: initialData?.prize3rd || "",
        prizeHonorable: initialData?.prizeHonorable || "",
        tracks: initialData?.tracks?.map((track) => ({
            ...track,
            description: track.description || "",
            maxTeams: track.maxTeams ?? 50,
            maxMembersPerTeam: track.maxMembersPerTeam ?? 4,
        })) || [{ name: "", description: "", maxTeams: 50, maxMembersPerTeam: 4 }],
        rounds: initialData?.rounds?.map((r) => ({
            ...r,
            submissionDeadline: r.submissionDeadline ? new Date(r.submissionDeadline).toISOString().slice(0, 16) : "",
            maxFileSizeMb: r.maxFileSizeMb || 20,
            isTrackSpecific: r.isTrackSpecific !== undefined ? r.isTrackSpecific : true,
        })) || [{ roundNumber: 1, name: "", submissionType: "file", submissionDeadline: "", maxFileSizeMb: 20, isTrackSpecific: true }],
        location: {
            ...defaultLocation,
            ...(initialData?.location || {}),
        },
        contacts: initialData?.contacts?.length ? initialData.contacts.map((contact) => ({
            label: contact.label || contact.type || "",
            name: contact.name || contact.title || "",
            email: contact.email || "",
            phone: contact.phone || "",
            detail: contact.detail || "",
            responseTime: contact.responseTime || "",
        })) : defaultContacts,
        ruleGroups: normalizeRuleGroups(initialData),
        faqItems: normalizeFaqItems(initialData),
    };

    const eventSchema = useMemo(() => createEventSchema(isEdit), [isEdit]);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema) as Resolver<EventFormValues>,
        defaultValues,
    });

    const watchedStatus = useWatch({ control: form.control, name: "status" });
    const watchedRegistrationDeadline = useWatch({ control: form.control, name: "registrationDeadline" });

    const canModifyStructure = !isEdit || (
        watchedStatus === "draft" &&
        (!watchedRegistrationDeadline || new Date(watchedRegistrationDeadline) > new Date())
    );

    const control = form.control;

    const { fields: trackFields, append: appendTrack, remove: removeTrack } = useFieldArray({
        control: form.control,
        name: "tracks",
    });

    const { fields: roundFields, append: appendRound, remove: removeRound } = useFieldArray({
        control: form.control,
        name: "rounds",
    });

    const { fields: contactFields, append: appendContact, remove: removeContact } = useFieldArray({
        control: form.control,
        name: "contacts",
    });

    const { fields: ruleGroupFields, append: appendRuleGroup, remove: removeRuleGroup } = useFieldArray({
        control: form.control,
        name: "ruleGroups",
    });

    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
        control: form.control,
        name: "faqItems",
    });

    const handleRemoveTrack = (index: number) => {
        const track = form.getValues(`tracks.${index}`);
        const teamCount = track._count?.teams ?? 0;
        if (track.id && teamCount > 0) {
            if (!window.confirm(`Warning: This track currently has ${teamCount} participating teams.\nDelete it will PERMANENTLY REMOVE all associated teams and submissions.\nAre you sure to delete?`)) {
                return;
            }
        }
        removeTrack(index);
    };

    const handleRemoveRound = (index: number) => {
        const round = form.getValues(`rounds.${index}`);
        const submissionCount = round._count?.submissions ?? 0;
        if (round.id && submissionCount > 0) {
            if (!window.confirm(`Warning: This round currently has ${submissionCount} submissions.\nThe deletion will PERMANENTLY DELETE all submissions and examiner assignments.\nAre you sure to delete?`)) {
                return;
            }
        }
        removeRound(index);
    };

    const onSubmit = async (data: EventFormValues) => {
        setIsLoading(true);
        try {
            const payload: OrganizerEventPayload = {
                ...data,
                registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString() : undefined,
                startDate: data.startDate ? new Date(data.startDate).toISOString() : undefined,
                githubOrgUrl: data.githubOrgUrl || undefined,
                imageUrl: data.imageUrl || undefined,
                tracks: data.tracks?.map(t => ({
                    id: t.id,
                    name: t.name,
                    description: t.description,
                    maxTeams: t.maxTeams ? Number(t.maxTeams) : undefined,
                    maxMembersPerTeam: t.maxMembersPerTeam ? Number(t.maxMembersPerTeam) : undefined
                })),
                rounds: data.rounds?.map(r => ({
                    id: r.id,
                    roundNumber: r.roundNumber,
                    name: r.name,
                    submissionType: r.submissionType,
                    submissionDeadline: r.submissionDeadline ? new Date(r.submissionDeadline).toISOString() : undefined,
                    maxFileSizeMb: r.maxFileSizeMb,
                    isTrackSpecific: r.isTrackSpecific,
                })),
                location: {
                    venueName: data.location.venueName || undefined,
                    room: data.location.room || undefined,
                    address: data.location.address || undefined,
                    meetingPlatform: data.location.meetingPlatform || undefined,
                    meetingUrl: data.location.meetingUrl || undefined,
                    mapUrl: data.location.mapUrl || undefined,
                    note: data.location.note || undefined,
                },
                contacts: data.contacts
                    .filter((contact) => contact.label || contact.name || contact.email || contact.phone || contact.detail)
                    .map((contact) => ({
                        label: contact.label || undefined,
                        name: contact.name || undefined,
                        email: contact.email || undefined,
                        phone: contact.phone || undefined,
                        detail: contact.detail || undefined,
                        responseTime: contact.responseTime || undefined,
                    })),
                ruleGroups: data.ruleGroups
                    .map((group) => ({
                        title: group.title,
                        rules: linesToList(group.itemsText),
                    }))
                    .filter((group) => group.title && group.rules.length > 0),
                faqItems: data.faqItems
                    .filter((faq) => faq.question && faq.answer)
                    .map((faq) => ({
                        question: faq.question,
                        answer: faq.answer,
                    })),
            };

            if (isEdit && initialData?.id) {
                await updateOrganizerEvent(initialData.id, payload);
                enqueueSnackbar("Event updated successfully", { variant: "success" });
                router.push(`/organizer/events/${initialData.id}`);
            } else {
                const event = await createOrganizerEvent(payload);
                enqueueSnackbar("Event created successfully", { variant: "success" });
                router.push(`/organizer/events/${event.id}`);
            }
        } catch (error: unknown) {
            console.error("Event form error", error);
            const apiError = error as { response?: { data?: { errors?: string[]; message?: string } } };
            const errData = apiError.response?.data?.errors || apiError.response?.data?.message;
            let errorMessage = "Failed to save event";

            if (Array.isArray(errData)) {
                errorMessage = errData.join(", ");
            } else if (typeof errData === "string") {
                errorMessage = errData;
            }

            enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" as const }
        })
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-32" suppressHydrationWarning>

                {/* GENERAL INFORMATION */}
                <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible" className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl transition-all duration-500 group-hover:from-blue-500/10 group-hover:to-purple-500/10" />
                    <div className="relative bg-card/40 backdrop-blur-2xl border border-border/50 p-8 rounded-3xl shadow-sm transition-all duration-500 hover:shadow-md">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl text-blue-600 ring-1 ring-blue-500/20">
                                <Info className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">General Information</h3>
                                <p className="text-muted-foreground mt-1">Basic details and scheduling for your event.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-6">
                            <FormField control={control} name="name" render={({ field }) => (
                                <FormItem className="md:col-span-12">
                                    <FormLabel className="text-foreground/80 font-medium">Event Name <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input className="bg-background/50 border-border/50 focus-visible:ring-blue-500/30 rounded-xl" placeholder="E.g. SEAL Hackathon 2026" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={control} name="season" render={({ field }) => (
                                <FormItem className="md:col-span-6">
                                    <FormLabel className="text-foreground/80 font-medium">Season <span className="text-red-500">*</span></FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-background/50 border-border/50 focus:ring-blue-500/30 rounded-xl">
                                                <SelectValue placeholder="Select Season" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="rounded-xl">
                                            <SelectItem value="Spring">Spring</SelectItem>
                                            <SelectItem value="Summer">Summer</SelectItem>
                                            <SelectItem value="Fall">Fall</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={control} name="year" render={({ field }) => (
                                <FormItem className="md:col-span-6">
                                    <FormLabel className="text-foreground/80 font-medium">Year <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="number" className="bg-background/50 border-border/50 focus-visible:ring-blue-500/30 rounded-xl" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={control} name="registrationDeadline" render={({ field }) => (
                                <FormItem className="md:col-span-6">
                                    <FormLabel className="text-foreground/80 font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> Registration Deadline</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" className="bg-background/50 border-border/50 focus-visible:ring-blue-500/30 rounded-xl" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={control} name="startDate" render={({ field }) => (
                                <FormItem className="md:col-span-6">
                                    <FormLabel className="text-foreground/80 font-medium flex items-center gap-2"><Calendar className="w-4 h-4" /> Start Date</FormLabel>
                                    <FormControl>
                                        <Input type="datetime-local" className="bg-background/50 border-border/50 focus-visible:ring-blue-500/30 rounded-xl" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={control} name="githubOrgUrl" render={({ field }) => (
                                <FormItem className="md:col-span-12">
                                    <FormLabel className="text-foreground/80 font-medium flex items-center gap-2"><LinkIcon className="w-4 h-4" /> GitHub Organization URL</FormLabel>
                                    <FormControl>
                                        <Input className="bg-background/50 border-border/50 focus-visible:ring-blue-500/30 rounded-xl" placeholder="https://github.com/your-org" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={control} name="imageUrl" render={({ field }) => (
                                <FormItem className="md:col-span-12">
                                    <FormLabel className="text-foreground/80 font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Cover Image URL</FormLabel>
                                    <FormControl>
                                        <Input className="bg-background/50 border-border/50 focus-visible:ring-blue-500/30 rounded-xl" placeholder="https://images.unsplash.com/..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={control} name="description" render={({ field }) => (
                                <FormItem className="md:col-span-12">
                                    <FormLabel className="text-foreground/80 font-medium">Description</FormLabel>
                                    <FormControl>
                                        <Textarea className="bg-background/50 border-border/50 focus-visible:ring-blue-500/30 rounded-xl min-h-[120px] resize-y" placeholder="Event description..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                    </div>
                </motion.div>

                {/* PRIZES */}
                <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible" className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl blur-xl transition-all duration-500 group-hover:from-amber-500/10 group-hover:to-orange-500/10" />
                    <div className="relative bg-card/40 backdrop-blur-2xl border border-border/50 p-8 rounded-3xl shadow-sm transition-all duration-500 hover:shadow-md">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-2xl text-amber-600 ring-1 ring-amber-500/20">
                                <Trophy className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">Prizes & Awards</h3>
                                <p className="text-muted-foreground mt-1">Configure the winning rewards for the participants.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <FormField control={control} name="prize1st" render={({ field }) => (
                                <FormItem><FormLabel className="text-foreground/80 font-medium">1st Prize</FormLabel><FormControl><Input className="bg-background/50 rounded-xl border-amber-500/20 focus-visible:ring-amber-500/30" placeholder="E.g. $1000 & MacBooks" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={control} name="prize2nd" render={({ field }) => (
                                <FormItem><FormLabel className="text-foreground/80 font-medium">2nd Prize</FormLabel><FormControl><Input className="bg-background/50 rounded-xl border-border/50 focus-visible:ring-amber-500/30" placeholder="E.g. $500 & AirPods" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={control} name="prize3rd" render={({ field }) => (
                                <FormItem><FormLabel className="text-foreground/80 font-medium">3rd Prize</FormLabel><FormControl><Input className="bg-background/50 rounded-xl border-border/50 focus-visible:ring-amber-500/30" placeholder="E.g. $250 & Keyboards" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={control} name="prizeHonorable" render={({ field }) => (
                                <FormItem><FormLabel className="text-foreground/80 font-medium">Honorable Mention</FormLabel><FormControl><Input className="bg-background/50 rounded-xl border-border/50 focus-visible:ring-amber-500/30" placeholder="E.g. Swag bag & Vouchers" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    </div>
                </motion.div>

                {/* EVENT DETAILS */}
                <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible" className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 rounded-3xl blur-xl transition-all duration-500 group-hover:from-orange-500/10 group-hover:to-yellow-500/10" />
                    <div className="relative bg-card/40 backdrop-blur-2xl border border-border/50 p-8 rounded-3xl shadow-sm transition-all duration-500 hover:shadow-md">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-gradient-to-br from-orange-500/20 to-yellow-600/20 rounded-2xl text-orange-600 ring-1 ring-orange-500/20">
                                <ListChecks className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">Event Details</h3>
                                <p className="text-muted-foreground mt-1">Default public information. You can edit, add, or remove it before publishing.</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="rounded-2xl border border-border/50 bg-background/50 p-5">
                                <div className="mb-5 flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-orange-500" />
                                    <h4 className="font-semibold text-foreground">Location</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <FormField control={control} name="location.venueName" render={({ field }) => (
                                        <FormItem className="md:col-span-6"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Venue</FormLabel><FormControl><Input className="bg-card/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={control} name="location.room" render={({ field }) => (
                                        <FormItem className="md:col-span-6"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Room / Hall</FormLabel><FormControl><Input className="bg-card/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={control} name="location.address" render={({ field }) => (
                                        <FormItem className="md:col-span-12"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Address</FormLabel><FormControl><Input className="bg-card/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={control} name="location.meetingPlatform" render={({ field }) => (
                                        <FormItem className="md:col-span-4"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Online Platform</FormLabel><FormControl><Input className="bg-card/50 rounded-lg" placeholder="Google Meet / Zoom" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={control} name="location.meetingUrl" render={({ field }) => (
                                        <FormItem className="md:col-span-4"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Meeting URL</FormLabel><FormControl><Input className="bg-card/50 rounded-lg" placeholder="https://..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={control} name="location.mapUrl" render={({ field }) => (
                                        <FormItem className="md:col-span-4"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Map URL</FormLabel><FormControl><Input className="bg-card/50 rounded-lg" placeholder="https://..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={control} name="location.note" render={({ field }) => (
                                        <FormItem className="md:col-span-12"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Location Note</FormLabel><FormControl><Textarea className="bg-card/50 rounded-lg min-h-[80px]" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/50 bg-background/50 p-5">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-orange-500" />
                                        <h4 className="font-semibold text-foreground">Contact</h4>
                                    </div>
                                    <Button type="button" variant="outline" className="gap-2 rounded-xl" onClick={() => appendContact({ label: "", name: "", email: "", phone: "", detail: "", responseTime: "" })}>
                                        <Plus className="h-4 w-4" /> Add Contact
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {contactFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-xl border border-border/50 bg-card/40 p-4">
                                            <FormField control={control} name={`contacts.${index}.label`} render={({ field }) => (
                                                <FormItem className="md:col-span-3"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Label</FormLabel><FormControl><Input className="bg-background/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={control} name={`contacts.${index}.name`} render={({ field }) => (
                                                <FormItem className="md:col-span-3"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Name</FormLabel><FormControl><Input className="bg-background/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={control} name={`contacts.${index}.email`} render={({ field }) => (
                                                <FormItem className="md:col-span-3"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Email</FormLabel><FormControl><Input className="bg-background/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={control} name={`contacts.${index}.phone`} render={({ field }) => (
                                                <FormItem className="md:col-span-3"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Phone</FormLabel><FormControl><Input className="bg-background/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={control} name={`contacts.${index}.detail`} render={({ field }) => (
                                                <FormItem className="md:col-span-8"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Detail</FormLabel><FormControl><Input className="bg-background/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={control} name={`contacts.${index}.responseTime`} render={({ field }) => (
                                                <FormItem className="md:col-span-3"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Response Time</FormLabel><FormControl><Input className="bg-background/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <div className="md:col-span-1 flex items-end justify-end">
                                                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:bg-red-100/50 hover:text-red-600" onClick={() => removeContact(index)} aria-label="Remove contact">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/50 bg-background/50 p-5">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-orange-500" />
                                        <h4 className="font-semibold text-foreground">Rules</h4>
                                    </div>
                                    <Button type="button" variant="outline" className="gap-2 rounded-xl" onClick={() => appendRuleGroup({ title: "New Rule Group", itemsText: "" })}>
                                        <Plus className="h-4 w-4" /> Add Rule Group
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {ruleGroupFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-xl border border-border/50 bg-card/40 p-4">
                                            <FormField control={control} name={`ruleGroups.${index}.title`} render={({ field }) => (
                                                <FormItem className="md:col-span-11"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Group Title</FormLabel><FormControl><Input className="bg-background/50 rounded-lg" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <div className="md:col-span-1 flex items-end justify-end">
                                                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:bg-red-100/50 hover:text-red-600" onClick={() => removeRuleGroup(index)} aria-label="Remove rule group">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormField control={control} name={`ruleGroups.${index}.itemsText`} render={({ field }) => (
                                                <FormItem className="md:col-span-12"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Rules, one per line</FormLabel><FormControl><Textarea className="bg-background/50 rounded-lg min-h-[120px]" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-border/50 bg-background/50 p-5">
                                <div className="mb-5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <HelpCircle className="h-5 w-5 text-orange-500" />
                                        <h4 className="font-semibold text-foreground">FAQ</h4>
                                    </div>
                                    <Button type="button" variant="outline" className="gap-2 rounded-xl" onClick={() => appendFaq({ question: "", answer: "" })}>
                                        <Plus className="h-4 w-4" /> Add FAQ
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {faqFields.map((field, index) => (
                                        <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-xl border border-border/50 bg-card/40 p-4">
                                            <FormField control={control} name={`faqItems.${index}.question`} render={({ field }) => (
                                                <FormItem className="md:col-span-11"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Question</FormLabel><FormControl><Input className="bg-background/50 rounded-lg" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <div className="md:col-span-1 flex items-end justify-end">
                                                <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:bg-red-100/50 hover:text-red-600" onClick={() => removeFaq(index)} aria-label="Remove FAQ">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <FormField control={control} name={`faqItems.${index}.answer`} render={({ field }) => (
                                                <FormItem className="md:col-span-12"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Answer</FormLabel><FormControl><Textarea className="bg-background/50 rounded-lg min-h-[90px]" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* TRACKS */}
                <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible" className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-3xl blur-xl transition-all duration-500 group-hover:from-emerald-500/10 group-hover:to-teal-500/10" />
                    <div className="relative bg-card/40 backdrop-blur-2xl border border-border/50 p-8 rounded-3xl shadow-sm transition-all duration-500 hover:shadow-md">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl text-emerald-600 ring-1 ring-emerald-500/20">
                                    <GitMerge className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">Tracks</h3>
                                    <p className="text-muted-foreground mt-1">Define categories or themes for the competition.</p>
                                </div>
                            </div>
                            {canModifyStructure && (
                                <Button type="button" variant="outline" className="gap-2 rounded-xl border-emerald-500/20 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950" onClick={() => appendTrack({ name: "", description: "", maxTeams: 50, maxMembersPerTeam: 4 })}>
                                    <Plus className="h-4 w-4" /> Add Track
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {trackFields.map((field, index) => (
                                    <motion.div
                                        key={field.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-background/50 border border-border/50 rounded-2xl items-start relative group/item hover:border-emerald-500/30 hover:shadow-sm transition-all"
                                    >
                                        <div className="md:col-span-4">
                                            <FormField control={control} name={`tracks.${index}.name`} render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Track Name *</FormLabel><FormControl><Input className="bg-card/50 rounded-lg" placeholder="e.g. AI Track" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="md:col-span-8">
                                            <FormField control={control} name={`tracks.${index}.description`} render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Description</FormLabel><FormControl><Input className="bg-card/50 rounded-lg" placeholder="Track focus area..." {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="md:col-span-4">
                                            <FormField control={control} name={`tracks.${index}.maxTeams`} render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Max Teams</FormLabel><FormControl><Input type="number" className="bg-card/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="md:col-span-4">
                                            <FormField control={control} name={`tracks.${index}.maxMembersPerTeam`} render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Max Members</FormLabel><FormControl><Input type="number" className="bg-card/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="md:col-span-4 flex justify-end items-end">
                                            {trackFields.length > 1 && canModifyStructure && (
                                                <Button type="button" variant="ghost" className="text-red-500/70 hover:text-red-600 hover:bg-red-100/50 rounded-xl transition-colors" onClick={() => handleRemoveTrack(index)}>
                                                    <Trash2 className="h-4 w-4 mr-2" /> Remove Track
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* ROUNDS */}
                <motion.div custom={4} variants={sectionVariants} initial="hidden" animate="visible" className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 rounded-3xl blur-xl transition-all duration-500 group-hover:from-rose-500/10 group-hover:to-pink-500/10" />
                    <div className="relative bg-card/40 backdrop-blur-2xl border border-border/50 p-8 rounded-3xl shadow-sm transition-all duration-500 hover:shadow-md">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gradient-to-br from-rose-500/20 to-pink-600/20 rounded-2xl text-rose-600 ring-1 ring-rose-500/20">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-pink-500">Rounds</h3>
                                    <p className="text-muted-foreground mt-1">Configure submission stages for the participants.</p>
                                </div>
                            </div>
                            {canModifyStructure && (
                                <Button type="button" variant="outline" className="gap-2 rounded-xl border-rose-500/20 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950" onClick={() => appendRound({ roundNumber: roundFields.length + 1, name: "", submissionType: "file", submissionDeadline: "", maxFileSizeMb: 20, isTrackSpecific: true })}>
                                    <Plus className="h-4 w-4" /> Add Round
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {roundFields.map((field, index) => (
                                    <motion.div
                                        key={field.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 bg-background/50 border border-border/50 rounded-2xl items-start relative group/item hover:border-rose-500/30 hover:shadow-sm transition-all"
                                    >
                                        <div className="md:col-span-2">
                                            <FormField control={control} name={`rounds.${index}.roundNumber`} render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Round # *</FormLabel><FormControl><Input type="number" className="bg-card/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="md:col-span-5">
                                            <FormField control={control} name={`rounds.${index}.name`} render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Round Name *</FormLabel><FormControl><Input className="bg-card/50 rounded-lg" placeholder="e.g. Semi-final" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="md:col-span-5 flex justify-between items-end gap-3">
                                            <FormField control={control} name={`rounds.${index}.submissionDeadline`} render={({ field }) => (
                                                <FormItem className="flex-1"><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Deadline</FormLabel><FormControl><Input type="datetime-local" className="bg-card/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="md:col-span-4">
                                            <FormField control={control} name={`rounds.${index}.submissionType`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Submission Type *</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl><SelectTrigger className="bg-card/50 rounded-lg"><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent className="rounded-xl">
                                                            <SelectItem value="file">Project File (ZIP/RAR)</SelectItem>
                                                            <SelectItem value="github_link">GitHub Link</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        </div>
                                        <div className="md:col-span-4">
                                            <FormField control={control} name={`rounds.${index}.maxFileSizeMb`} render={({ field }) => (
                                                <FormItem><FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Max File Size (MB)</FormLabel><FormControl><Input type="number" className="bg-card/50 rounded-lg" {...field} value={field.value ?? ""} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <div className="md:col-span-4 flex items-center justify-end mt-6">
                                            {roundFields.length > 1 && canModifyStructure && (
                                                <Button type="button" variant="ghost" className="text-red-500/70 hover:text-red-600 hover:bg-red-100/50 rounded-xl transition-colors" onClick={() => handleRemoveRound(index)}>
                                                    <Trash2 className="h-4 w-4 mr-2" /> Remove Round
                                                </Button>
                                            )}
                                        </div>
                                        <div className="md:col-span-12 flex items-center justify-between mt-2 pt-4 border-t border-border/50">
                                            <FormField control={control} name={`rounds.${index}.isTrackSpecific`} render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-border text-blue-600 focus:ring-blue-500"
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-sm font-medium text-foreground">Separate submissions by Track</FormLabel>
                                                        <p className="text-xs text-muted-foreground">If checked, files will be saved in track-specific folders.</p>
                                                    </div>
                                                </FormItem>
                                            )} />
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                {/* BOTTOM ACTIONS BAR */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 z-50 flex justify-end gap-4 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)]"
                >
                    <div className="max-w-7xl mx-auto w-full flex justify-end gap-4 px-4 md:px-8">
                        <Button type="button" variant="ghost" className="rounded-xl px-6 hover:bg-muted" onClick={() => router.back()} disabled={isLoading}>
                            <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 rounded-xl px-8" disabled={isLoading}>
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                            ) : (
                                <>{isEdit ? <><Save className="w-4 h-4 mr-2" /> Save Changes</> : <><CheckCircle2 className="w-4 h-4 mr-2" /> Create Event</>}</>
                            )}
                        </Button>
                    </div>
                </motion.div>
            </form>
        </Form>
    );
}
