"use client";
/* eslint-disable react-hooks/incompatible-library */
import { useForm } from "react-hook-form"; import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RegistrationListItem, WaitlistRegistrationInput } from "@/lib/organizer/registrations/registration-types";
import { waitlistRegistrationSchema } from "@/lib/organizer/registrations/registration-validation";
export function WaitlistRegistrationDialog({ registration, open, onOpenChange, onConfirm, pending }: { registration: RegistrationListItem | null; open: boolean; onOpenChange: (open: boolean) => void; onConfirm: (input: WaitlistRegistrationInput) => void; pending: boolean }) {
  const form = useForm<WaitlistRegistrationInput>({ resolver: zodResolver(waitlistRegistrationSchema), defaultValues: { reason: "Event capacity is currently limited.", priority: "Normal", sendNotification: true } });
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-lg"><DialogHeader><DialogTitle>Move to waitlist</DialogTitle><DialogDescription>{registration?.student.fullName} will be placed at estimated position #37.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={form.handleSubmit(onConfirm)}>
    <label className="block space-y-1.5 text-sm font-medium">Reason<Textarea {...form.register("reason")} className="mt-1" />{form.formState.errors.reason && <span className="text-xs text-red-400">{form.formState.errors.reason.message}</span>}</label>
    <label className="block space-y-1.5 text-sm font-medium">Priority<Select value={form.watch("priority")} onValueChange={(value) => value && form.setValue("priority", value as WaitlistRegistrationInput["priority"])}><SelectTrigger className="mt-1 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Normal">Normal</SelectItem><SelectItem value="High Priority">High Priority</SelectItem></SelectContent></Select></label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("sendNotification")} className="size-4 accent-orange-500" /> Send notification</label>
    <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={pending}>{pending ? "Updating..." : "Move to Waitlist"}</Button></DialogFooter>
  </form></DialogContent></Dialog>;
}
