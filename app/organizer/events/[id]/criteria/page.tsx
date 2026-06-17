"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import {
  ArrowRight,
  CheckCircle2,
  Edit2,
  GitMerge,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createOrganizerRubric,
  deleteOrganizerRubric,
  getOrganizerEvent,
  getOrganizerRubrics,
  updateOrganizerEvent,
  updateOrganizerEventStatus,
  updateOrganizerRubric,
  type OrganizerEvent,
  type OrganizerEventPayload,
  type OrganizerRoundInput,
  type OrganizerRubric,
  type OrganizerRubricPayload,
  type OrganizerTrackInput,
  type SubmissionType,
} from "@/lib/api/organizer-events.api";
import { cn } from "@/lib/utils";

type WizardStep = "rounds" | "tracks" | "rubrics";
type TrackScope = "global" | string;

type RoundDraft = {
  id?: number;
  roundNumber: number | string;
  name: string;
  submissionType: SubmissionType;
  submissionDeadline: string;
  maxFileSizeMb: number | string;
  isTrackSpecific: boolean;
};

type TrackDraft = {
  id?: number;
  name: string;
  description: string;
  maxTeams: number | string;
  maxMembersPerTeam: number | string;
};

type RubricDraft = {
  name: string;
  description: string;
  maxScore: number | string;
  weight: number | string;
};

const stepOrder: WizardStep[] = ["rounds", "tracks", "rubrics"];

const emptyRound = (roundNumber: number): RoundDraft => ({
  roundNumber,
  name: "",
  submissionType: "file",
  submissionDeadline: "",
  maxFileSizeMb: 20,
  isTrackSpecific: true,
});

const emptyTrack = (): TrackDraft => ({
  name: "",
  description: "",
  maxTeams: "",
  maxMembersPerTeam: 4,
});

const emptyRubric = (): RubricDraft => ({
  name: "",
  description: "",
  maxScore: 10,
  weight: 1,
});

function toDateTimeInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

function optionalNumber(value: number | string) {
  if (value === "") return undefined;
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : undefined;
}

function getApiMessage(error: unknown, fallback: string) {
  const apiError = error as { response?: { data?: { message?: string; errors?: string[] } } };
  const errors = apiError.response?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) return errors.join(", ");
  return apiError.response?.data?.message || fallback;
}

function mapRounds(event?: OrganizerEvent): RoundDraft[] {
  return (event?.rounds || [])
    .slice()
    .sort((a, b) => a.roundNumber - b.roundNumber)
    .map((round) => ({
      id: round.id,
      roundNumber: round.roundNumber,
      name: round.name,
      submissionType: round.submissionType,
      submissionDeadline: toDateTimeInput(round.submissionDeadline),
      maxFileSizeMb: round.maxFileSizeMb ?? 20,
      isTrackSpecific: round.isTrackSpecific,
    }));
}

function mapTracks(event?: OrganizerEvent): TrackDraft[] {
  return (event?.tracks || []).map((track) => ({
    id: track.id,
    name: track.name,
    description: track.description || "",
    maxTeams: track.maxTeams ?? "",
    maxMembersPerTeam: track.maxMembersPerTeam ?? "",
  }));
}

function buildEventPayload(
  event: OrganizerEvent,
  rounds: OrganizerRoundInput[],
  tracks: OrganizerTrackInput[]
): OrganizerEventPayload {
  return {
    name: event.name,
    description: event.description || undefined,
    season: event.season,
    year: event.year,
    status: event.status,
    registrationDeadline: event.registrationDeadline || undefined,
    startDate: event.startDate || undefined,
    githubOrgUrl: event.githubOrgUrl || undefined,
    prize1st: event.prize1st || undefined,
    prize2nd: event.prize2nd || undefined,
    prize3rd: event.prize3rd || undefined,
    prizeHonorable: event.prizeHonorable || undefined,
    rounds,
    tracks,
  };
}

function buildRoundInputs(rounds: RoundDraft[]) {
  return rounds.map((round) => ({
    id: round.id,
    roundNumber: Number(round.roundNumber),
    name: round.name.trim(),
    submissionType: round.submissionType,
    submissionDeadline: round.submissionDeadline
      ? new Date(round.submissionDeadline).toISOString()
      : undefined,
    maxFileSizeMb: Number(round.maxFileSizeMb),
    isTrackSpecific: round.isTrackSpecific,
  }));
}

function buildTrackInputs(tracks: TrackDraft[]) {
  return tracks.map((track) => ({
    id: track.id,
    name: track.name.trim(),
    description: track.description || undefined,
    maxTeams: optionalNumber(track.maxTeams),
    maxMembersPerTeam: optionalNumber(track.maxMembersPerTeam),
  }));
}

export default function EventCriteriaPage() {
  const params = useParams();
  const eventId = params.id as string;
  const queryClient = useQueryClient();

  const [activeStep, setActiveStep] = useState<WizardStep>("rounds");
  const [roundDrafts, setRoundDrafts] = useState<RoundDraft[]>([]);
  const [trackDrafts, setTrackDrafts] = useState<TrackDraft[]>([]);
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [trackScope, setTrackScope] = useState<TrackScope>("global");
  const [rubricDraft, setRubricDraft] = useState<RubricDraft>(emptyRubric);
  const [editingRubricId, setEditingRubricId] = useState<number | null>(null);
  const [roundsDirty, setRoundsDirty] = useState(false);
  const [tracksDirty, setTracksDirty] = useState(false);

  const eventQuery = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: () => getOrganizerEvent(eventId),
  });

  const event = eventQuery.data;
  const rounds = event?.rounds || [];
  const tracks = event?.tracks || [];
  const canEditEventStructure = event?.status === "draft";
  const selectedRound = rounds.find((round) => String(round.id) === selectedRoundId);
  const selectedTrackId = trackScope === "global" ? null : Number(trackScope);
  const selectedTrack = tracks.find((track) => track.id === selectedTrackId);

  const rubricsQuery = useQuery({
    queryKey: ["organizerRubrics", eventId, selectedRoundId, trackScope],
    enabled: Boolean(selectedRoundId),
    queryFn: async () => {
      const data = await getOrganizerRubrics(eventId, {
        roundId: selectedRoundId,
        trackId: selectedTrackId,
      });

      return data.filter((rubric) => {
        if (String(rubric.roundId) !== selectedRoundId) return false;
        if (trackScope === "global") return rubric.trackId === null || rubric.trackId === undefined;
        return String(rubric.trackId) === trackScope;
      });
    },
  });

  const currentRubrics = useMemo(() => rubricsQuery.data || [], [rubricsQuery.data]);
  const totalWeight = useMemo(
    () => currentRubrics.reduce((sum, rubric) => sum + Number(rubric.weight || 0), 0),
    [currentRubrics]
  );

  const updateStatusMutation = useMutation({
    mutationFn: () => updateOrganizerEventStatus(eventId, "draft"),
    onSuccess: (updatedEvent) => {
      enqueueSnackbar("Event status changed to draft", { variant: "success" });
      queryClient.setQueryData(["organizerEvent", eventId], updatedEvent);
      queryClient.invalidateQueries({ queryKey: ["organizerEvent", eventId] });
    },
    onError: (error) => {
      enqueueSnackbar(getApiMessage(error, "Failed to change event status"), { variant: "error" });
    },
  });

  useEffect(() => {
    if (!event) return;

    const nextRounds = mapRounds(event);
    const nextTracks = mapTracks(event);

    // Sync editable drafts with the latest server event after load/refetch.
    if (!roundsDirty) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoundDrafts(nextRounds);
    }

    if (!tracksDirty) {
      setTrackDrafts(nextTracks);
    }

    setSelectedRoundId((currentRoundId) => {
      const hasSelectedRound = nextRounds.some((round) => String(round.id) === currentRoundId);
      return hasSelectedRound ? currentRoundId : nextRounds[0]?.id ? String(nextRounds[0].id) : "";
    });
  }, [event, roundsDirty, tracksDirty]);

  useEffect(() => {
    // Reset scope/form whenever the selected round changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrackScope("global");
    setRubricDraft(emptyRubric());
    setEditingRubricId(null);
  }, [selectedRoundId]);

  const saveRoundsMutation = useMutation({
    mutationFn: async () => {
      if (!event) throw new Error("Event is not loaded");
      if (!canEditEventStructure) {
        throw new Error("Only draft events can be edited. Please change the status to draft first.");
      }

      const payloadRounds: OrganizerRoundInput[] = buildRoundInputs(roundDrafts);

      if (payloadRounds.some((round) => !round.name || round.roundNumber < 1)) {
        throw new Error("Round number and name are required.");
      }

      if (payloadRounds.some((round) => !round.maxFileSizeMb || round.maxFileSizeMb < 1)) {
        throw new Error("Max file size must be at least 1 MB.");
      }

      const payloadTracks = buildTrackInputs(trackDrafts);

      return updateOrganizerEvent(eventId, buildEventPayload(event, payloadRounds, payloadTracks));
    },
    onSuccess: (updatedEvent) => {
      enqueueSnackbar("Rounds saved", { variant: "success" });
      setRoundsDirty(false);
      queryClient.setQueryData(["organizerEvent", eventId], updatedEvent);
      queryClient.invalidateQueries({ queryKey: ["organizerEvent", eventId] });
      setActiveStep("tracks");
    },
    onError: (error) => {
      enqueueSnackbar(getApiMessage(error, "Failed to save rounds"), { variant: "error" });
    },
  });

  const saveTracksMutation = useMutation({
    mutationFn: async () => {
      if (!event) throw new Error("Event is not loaded");
      if (!canEditEventStructure) {
        throw new Error("Only draft events can be edited. Please change the status to draft first.");
      }

      const payloadTracks: OrganizerTrackInput[] = buildTrackInputs(trackDrafts);

      if (payloadTracks.some((track) => !track.name)) {
        throw new Error("Track name is required.");
      }

      const payloadRounds = buildRoundInputs(roundDrafts);

      return updateOrganizerEvent(eventId, buildEventPayload(event, payloadRounds, payloadTracks));
    },
    onSuccess: (updatedEvent) => {
      enqueueSnackbar("Tracks saved", { variant: "success" });
      setTracksDirty(false);
      queryClient.setQueryData(["organizerEvent", eventId], updatedEvent);
      queryClient.invalidateQueries({ queryKey: ["organizerEvent", eventId] });
      setActiveStep("rubrics");
    },
    onError: (error) => {
      enqueueSnackbar(getApiMessage(error, "Failed to save tracks"), { variant: "error" });
    },
  });

  const saveRubricMutation = useMutation({
    mutationFn: async () => {
      if (!canEditEventStructure) {
        throw new Error("Only draft events can be edited. Please change the status to draft first.");
      }
      if (!selectedRoundId) throw new Error("Do not create a rubric without roundId.");

      const maxScore = Number(rubricDraft.maxScore);
      const weight = Number(rubricDraft.weight);

      if (!rubricDraft.name.trim()) throw new Error("Criterion name is required.");
      if (!Number.isFinite(maxScore) || maxScore < 1) throw new Error("Max score must be at least 1.");
      if (!Number.isFinite(weight) || weight < 0) throw new Error("Weight must be 0 or greater.");

      const payload: OrganizerRubricPayload = {
        name: rubricDraft.name.trim(),
        description: rubricDraft.description || undefined,
        maxScore,
        weight,
        roundId: Number(selectedRoundId),
        ...(selectedTrackId ? { trackId: selectedTrackId } : {}),
      };

      return editingRubricId
        ? updateOrganizerRubric(eventId, editingRubricId, payload)
        : createOrganizerRubric(eventId, payload);
    },
    onSuccess: () => {
      enqueueSnackbar(editingRubricId ? "Criterion updated" : "Criterion created", {
        variant: "success",
      });
      setRubricDraft(emptyRubric());
      setEditingRubricId(null);
      queryClient.invalidateQueries({
        queryKey: ["organizerRubrics", eventId, selectedRoundId, trackScope],
      });
    },
    onError: (error) => {
      enqueueSnackbar(getApiMessage(error, "Failed to save criterion"), { variant: "error" });
    },
  });

  const deleteRubricMutation = useMutation({
    mutationFn: (rubricId: number) => deleteOrganizerRubric(eventId, rubricId),
    onSuccess: () => {
      enqueueSnackbar("Criterion deleted", { variant: "success" });
      queryClient.invalidateQueries({
        queryKey: ["organizerRubrics", eventId, selectedRoundId, trackScope],
      });
    },
    onError: (error) => {
      enqueueSnackbar(getApiMessage(error, "Failed to delete criterion"), { variant: "error" });
    },
  });

  const updateRoundDraft = <K extends keyof RoundDraft>(
    index: number,
    key: K,
    value: RoundDraft[K]
  ) => {
    setRoundsDirty(true);
    setRoundDrafts((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    );
  };

  const updateTrackDraft = <K extends keyof TrackDraft>(
    index: number,
    key: K,
    value: TrackDraft[K]
  ) => {
    setTracksDirty(true);
    setTrackDrafts((items) =>
      items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    );
  };

  const addRoundDraft = () => {
    if (!canEditEventStructure) return;
    setRoundsDirty(true);
    setRoundDrafts((items) => [...items, emptyRound(items.length + 1)]);
  };

  const removeRoundDraft = (index: number) => {
    if (!canEditEventStructure) return;
    const round = roundDrafts[index];
    const message = round?.id
      ? "Delete this saved round from the event? Click Save Rounds to persist the deletion."
      : "Remove this unsaved round?";

    if (!window.confirm(message)) return;

    setRoundsDirty(true);
    setRoundDrafts((items) => items.filter((_, itemIndex) => itemIndex !== index));
  };

  const addTrackDraft = () => {
    if (!canEditEventStructure) return;
    setTracksDirty(true);
    setTrackDrafts((items) => [...items, emptyTrack()]);
  };

  const removeTrackDraft = (index: number) => {
    if (!canEditEventStructure) return;
    const track = trackDrafts[index];
    const message = track?.id
      ? "Delete this saved track from the event? Click Save Tracks to persist the deletion."
      : "Remove this unsaved track?";

    if (!window.confirm(message)) return;

    setTracksDirty(true);
    setTrackDrafts((items) => items.filter((_, itemIndex) => itemIndex !== index));
  };

  const startEditRubric = (rubric: OrganizerRubric) => {
    setEditingRubricId(rubric.id);
    setRubricDraft({
      name: rubric.name,
      description: rubric.description || "",
      maxScore: rubric.maxScore,
      weight: rubric.weight,
    });
  };

  const steps = [
    { id: "rounds" as const, label: "Rounds", description: `${rounds.length} configured` },
    { id: "tracks" as const, label: "Tracks", description: tracks.length ? `${tracks.length} configured` : "Optional" },
    { id: "rubrics" as const, label: "Rubrics", description: rounds.length ? "Criteria setup" : "Needs a round" },
  ];

  if (eventQuery.isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (eventQuery.isError || !event) {
    return (
      <div className="mx-auto mt-20 max-w-lg rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-500">
        Failed to load event details.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <GlassCard className="rounded-[20px] p-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">Selected event</Badge>
              <Badge variant={event.status === "draft" ? "warning" : "success"}>
                {event.status || "draft"}
              </Badge>
            </div>
            <h1 className="truncate text-3xl font-bold tracking-tight">{event.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {event.season} {event.year} · Setup order: rounds, tracks, then rubrics.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/organizer/events">Select Event</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/organizer/events/create">Create Event</Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={eventQuery.isFetching}
                onClick={() => queryClient.invalidateQueries({ queryKey: ["organizerEvent", eventId] })}
              >
                <RefreshCcw className={cn("h-4 w-4", eventQuery.isFetching && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid w-full gap-2 sm:grid-cols-3 xl:w-[460px]">
            {steps.map((step, index) => {
              const disabled = step.id === "rubrics" && rounds.length === 0;
              const isActive = activeStep === step.id;
              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => setActiveStep(step.id)}
                  className={cn(
                    "min-h-[86px] rounded-xl border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                    isActive
                      ? "border-blue-500/40 bg-blue-500/10 text-blue-500"
                      : "border-border bg-background/50 hover:bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Step {index + 1}</span>
                    {index < stepOrder.indexOf(activeStep) && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className="mt-2 font-semibold">{step.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{step.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {!canEditEventStructure && (
        <StatusEditNotice
          status={event.status || "unknown"}
          isLoading={updateStatusMutation.isPending}
          onChangeToDraft={() => updateStatusMutation.mutate()}
        />
      )}

      {activeStep === "rounds" && (
        <GlassCard className="rounded-[20px] p-5">
          <SectionHeader
            title="Rounds"
            description="Create a round before adding rubrics."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={addRoundDraft}
                disabled={!canEditEventStructure}
              >
                <Plus className="h-4 w-4" />
                Add Round
              </Button>
            }
          />

          {roundsDirty && <DirtyNotice text="Round changes are not saved yet." />}

          {roundDrafts.length === 0 ? (
            <EmptyState text="Create a round before adding rubrics." />
          ) : (
            <div className="space-y-3">
              {roundDrafts.map((round, index) => (
                <div
                  key={round.id || index}
                  className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-background/50 p-4 lg:grid-cols-12"
                >
                  <Field className="lg:col-span-1" label="Round #">
                    <Input
                      type="number"
                      min={1}
                      value={round.roundNumber}
                      disabled={!canEditEventStructure}
                      onChange={(event) => updateRoundDraft(index, "roundNumber", event.target.value)}
                    />
                  </Field>
                  <Field className="lg:col-span-3" label="Name">
                    <Input
                      value={round.name}
                      placeholder="Semi-final"
                      disabled={!canEditEventStructure}
                      onChange={(event) => updateRoundDraft(index, "name", event.target.value)}
                    />
                  </Field>
                  <Field className="lg:col-span-2" label="Submission">
                    <select
                      value={round.submissionType}
                      disabled={!canEditEventStructure}
                      onChange={(event) =>
                        updateRoundDraft(index, "submissionType", event.target.value as SubmissionType)
                      }
                      className="h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="file">file</option>
                      <option value="github_link">github_link</option>
                    </select>
                  </Field>
                  <Field className="lg:col-span-3" label="Deadline">
                    <Input
                      type="datetime-local"
                      value={round.submissionDeadline}
                      disabled={!canEditEventStructure}
                      onChange={(event) => updateRoundDraft(index, "submissionDeadline", event.target.value)}
                    />
                  </Field>
                  <Field className="lg:col-span-1" label="Max MB">
                    <Input
                      type="number"
                      min={1}
                      value={round.maxFileSizeMb}
                      disabled={!canEditEventStructure}
                      onChange={(event) => updateRoundDraft(index, "maxFileSizeMb", event.target.value)}
                    />
                  </Field>
                  <div className="flex items-end justify-between gap-3 lg:col-span-2">
                    <label className="flex items-center gap-2 pb-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={round.isTrackSpecific}
                        disabled={!canEditEventStructure}
                        onChange={(event) =>
                          updateRoundDraft(index, "isTrackSpecific", event.target.checked)
                        }
                      />
                      Track-specific
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Delete round"
                      disabled={!canEditEventStructure}
                      onClick={() => removeRoundDraft(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <StepActions
            primaryLabel="Save Rounds"
            primaryIcon={<ArrowRight className="h-4 w-4" />}
            onPrimary={() => saveRoundsMutation.mutate()}
            primaryDisabled={!canEditEventStructure || saveRoundsMutation.isPending}
            isLoading={saveRoundsMutation.isPending}
          />
        </GlassCard>
      )}

      {activeStep === "tracks" && (
        <GlassCard className="rounded-[20px] p-5">
          <SectionHeader
            title="Tracks"
            description="Tracks are optional for global round rubrics, but needed for track-specific rubrics."
            action={
              <Button
                type="button"
                variant="outline"
                onClick={addTrackDraft}
                disabled={!canEditEventStructure}
              >
                <Plus className="h-4 w-4" />
                Add Track
              </Button>
            }
          />

          {tracksDirty && <DirtyNotice text="Track changes are not saved yet." />}

          {trackDrafts.length === 0 ? (
            <EmptyState text="Create tracks if this rubric should be track-specific." />
          ) : (
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {trackDrafts.map((track, index) => (
                <div
                  key={track.id || index}
                  className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-background/50 p-4 md:grid-cols-12"
                >
                  <Field className="md:col-span-5" label="Name">
                    <Input
                      value={track.name}
                      placeholder="AI Track"
                      disabled={!canEditEventStructure}
                      onChange={(event) => updateTrackDraft(index, "name", event.target.value)}
                    />
                  </Field>
                  <Field className="md:col-span-3" label="Max Teams">
                    <Input
                      type="number"
                      min={1}
                      value={track.maxTeams}
                      disabled={!canEditEventStructure}
                      onChange={(event) => updateTrackDraft(index, "maxTeams", event.target.value)}
                    />
                  </Field>
                  <Field className="md:col-span-3" label="Max Members">
                    <Input
                      type="number"
                      min={1}
                      value={track.maxMembersPerTeam}
                      disabled={!canEditEventStructure}
                      onChange={(event) => updateTrackDraft(index, "maxMembersPerTeam", event.target.value)}
                    />
                  </Field>
                  <div className="flex items-end justify-end md:col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Delete track"
                      disabled={!canEditEventStructure}
                      onClick={() => removeTrackDraft(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <Field className="md:col-span-12" label="Description">
                    <Textarea
                      value={track.description}
                      className="min-h-[72px]"
                      placeholder="Track focus and eligibility."
                      disabled={!canEditEventStructure}
                      onChange={(event) => updateTrackDraft(index, "description", event.target.value)}
                    />
                  </Field>
                </div>
              ))}
            </div>
          )}

          <StepActions
            secondaryLabel="Back"
            onSecondary={() => setActiveStep("rounds")}
            primaryLabel="Save Tracks"
            primaryIcon={<ArrowRight className="h-4 w-4" />}
            onPrimary={() => saveTracksMutation.mutate()}
            primaryDisabled={!canEditEventStructure || saveTracksMutation.isPending}
            isLoading={saveTracksMutation.isPending}
          />
        </GlassCard>
      )}

      {activeStep === "rubrics" && (
        <GlassCard className="rounded-[20px] p-5">
          <SectionHeader
            title="Rubrics / Criteria"
            description="Criteria belong to a round and can optionally be scoped to a track."
          />

          {rounds.length === 0 ? (
            <EmptyState text="Create a round before adding rubrics." />
          ) : (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <div className="space-y-4 xl:col-span-8">
                <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-background/50 p-4 md:grid-cols-2">
                  <Field label="Round">
                    <select
                      value={selectedRoundId}
                      onChange={(event) => setSelectedRoundId(event.target.value)}
                      className="h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      {rounds.map((round) => (
                        <option key={round.id} value={round.id}>
                          Round {round.roundNumber}: {round.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Track scope">
                    <select
                      value={trackScope}
                      onChange={(event) => setTrackScope(event.target.value)}
                      className="h-8 w-full rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="global">All tracks / whole round</option>
                      {tracks.map((track) => (
                        <option key={track.id} value={track.id}>
                          {track.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/50 p-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">
                      {selectedRound
                        ? `Round ${selectedRound.roundNumber}: ${selectedRound.name}`
                        : "Select a round"}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <GitMerge className="h-3.5 w-3.5" />
                      {selectedTrack ? selectedTrack.name : "All tracks / whole round"}
                    </div>
                  </div>
                  <Badge variant={totalWeight === 100 ? "success" : "outline"}>
                    Total weight: {totalWeight}
                  </Badge>
                </div>

                {tracks.length === 0 && (
                  <EmptyState text="Create tracks if this rubric should be track-specific." compact />
                )}

                {rubricsQuery.isLoading ? (
                  <div className="flex items-center justify-center rounded-2xl border border-dashed border-border p-10 text-muted-foreground">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading criteria...
                  </div>
                ) : currentRubrics.length === 0 ? (
                  <EmptyState text="Add the first criterion for this round." />
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-border">
                    <table className="min-w-[680px] w-full text-left text-sm">
                      <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Criterion</th>
                          <th className="w-28 px-4 py-3 font-semibold">Max</th>
                          <th className="w-28 px-4 py-3 font-semibold">Weight</th>
                          <th className="w-28 px-4 py-3 text-right font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRubrics.map((rubric) => (
                          <tr key={rubric.id} className="border-t border-border bg-background/40">
                            <td className="px-4 py-3">
                              <div className="font-semibold">{rubric.name}</div>
                              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {rubric.description || "No description"}
                              </div>
                            </td>
                            <td className="px-4 py-3">{rubric.maxScore}</td>
                            <td className="px-4 py-3">{rubric.weight}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon-sm"
                                  title="Edit criterion"
                                  disabled={!canEditEventStructure}
                                  onClick={() => startEditRubric(rubric)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  title="Delete criterion"
                                  disabled={!canEditEventStructure || deleteRubricMutation.isPending}
                                  onClick={() => {
                                    if (window.confirm("Delete this criterion?")) {
                                      deleteRubricMutation.mutate(rubric.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="xl:col-span-4">
                <div className="sticky top-6 rounded-2xl border border-border bg-background/50 p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{editingRubricId ? "Edit criterion" : "Add criterion"}</h3>
                      <p className="text-xs text-muted-foreground">
                        roundId {selectedRoundId || "required"}
                        {selectedTrackId ? ` · trackId ${selectedTrackId}` : " · global scope"}
                      </p>
                    </div>
                    {editingRubricId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setEditingRubricId(null);
                          setRubricDraft(emptyRubric());
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Field label="Name">
                      <Input
                        value={rubricDraft.name}
                        placeholder="Technical Implementation"
                        disabled={!canEditEventStructure}
                        onChange={(event) =>
                          setRubricDraft((draft) => ({ ...draft, name: event.target.value }))
                        }
                      />
                    </Field>
                    <Field label="Description">
                      <Textarea
                        value={rubricDraft.description}
                        className="min-h-[88px]"
                        placeholder="Code quality, architecture, correctness"
                        disabled={!canEditEventStructure}
                        onChange={(event) =>
                          setRubricDraft((draft) => ({ ...draft, description: event.target.value }))
                        }
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Max Score">
                        <Input
                          type="number"
                          min={1}
                          value={rubricDraft.maxScore}
                          disabled={!canEditEventStructure}
                          onChange={(event) =>
                            setRubricDraft((draft) => ({ ...draft, maxScore: event.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Weight">
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          value={rubricDraft.weight}
                          disabled={!canEditEventStructure}
                          onChange={(event) =>
                            setRubricDraft((draft) => ({ ...draft, weight: event.target.value }))
                          }
                        />
                      </Field>
                    </div>
                    <Button
                      type="button"
                      className="w-full"
                      disabled={!canEditEventStructure || !selectedRoundId || saveRubricMutation.isPending}
                      onClick={() => saveRubricMutation.mutate()}
                    >
                      {saveRubricMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {editingRubricId ? "Update Criterion" : "Create Criterion"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <StepActions secondaryLabel="Back" onSecondary={() => setActiveStep("tracks")} />
        </GlassCard>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}

function EmptyState({ text, compact = false }: { text: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border bg-muted/20 text-center text-sm text-muted-foreground",
        compact ? "p-4" : "p-8"
      )}
    >
      {text}
    </div>
  );
}

function StatusEditNotice({
  status,
  isLoading,
  onChangeToDraft,
}: {
  status: string;
  isLoading: boolean;
  onChangeToDraft: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-500 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="font-semibold">Only draft events can be edited.</div>
        <div className="mt-1 text-amber-500/80">
          Current status is <span className="font-semibold">{status}</span>. Change the event back to draft before editing rounds, tracks, or criteria.
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
        disabled={isLoading}
        onClick={onChangeToDraft}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit2 className="h-4 w-4" />}
        Change to Draft
      </Button>
    </div>
  );
}

function DirtyNotice({ text }: { text: string }) {
  return (
    <div className="mb-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500">
      {text}
    </div>
  );
}

function StepActions({
  secondaryLabel,
  onSecondary,
  primaryLabel,
  primaryIcon,
  onPrimary,
  primaryDisabled,
  isLoading,
}: {
  secondaryLabel?: string;
  onSecondary?: () => void;
  primaryLabel?: string;
  primaryIcon?: ReactNode;
  onPrimary?: () => void;
  primaryDisabled?: boolean;
  isLoading?: boolean;
}) {
  if (!secondaryLabel && !primaryLabel) return null;

  return (
    <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
      {secondaryLabel && (
        <Button type="button" variant="outline" onClick={onSecondary}>
          {secondaryLabel}
        </Button>
      )}
      {primaryLabel && (
        <Button type="button" onClick={onPrimary} disabled={primaryDisabled}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : primaryIcon}
          {primaryLabel}
        </Button>
      )}
    </div>
  );
}
