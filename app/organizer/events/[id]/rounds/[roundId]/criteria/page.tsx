"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { Edit2, Loader2, Plus, RefreshCcw, Save, Trash2, X } from "lucide-react";

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
  updateOrganizerRubric,
  type OrganizerRubric,
  type OrganizerRubricPayload,
} from "@/lib/api/organizer-events.api";
import { cn } from "@/lib/utils";

type RubricDraft = {
  roundId: string;
  trackId: string;
  name: string;
  description: string;
  maxScore: number | string;
  weight: number | string;
};

const emptyRubric = (): RubricDraft => ({
  roundId: "",
  trackId: "",
  name: "",
  description: "",
  maxScore: 10,
  weight: 1,
});

function getApiMessage(error: unknown, fallback: string) {
  const apiError = error as {
    response?: { data?: { message?: string; errors?: string[] } };
  };
  const errors = apiError.response?.data?.errors;
  if (Array.isArray(errors) && errors.length > 0) return errors.join(", ");
  return apiError.response?.data?.message || fallback;
}

export default function EventCriteriaPage() {
  const params = useParams();
  const eventId = params.id as string;
  const queryClient = useQueryClient();

  const [roundFilter, setRoundFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");
  const [rubricDraft, setRubricDraft] = useState<RubricDraft>(emptyRubric);
  const [editingRubricId, setEditingRubricId] = useState<number | null>(null);

  const eventQuery = useQuery({
    queryKey: ["organizerEvent", eventId],
    queryFn: () => getOrganizerEvent(eventId),
  });

  const rubricsQuery = useQuery({
    queryKey: ["organizerRubrics", eventId],
    queryFn: () => getOrganizerRubrics(eventId),
  });

  const event = eventQuery.data;
  const rounds = useMemo(
    () => [...(event?.rounds || [])].sort((a, b) => a.roundNumber - b.roundNumber),
    [event?.rounds]
  );
  const tracks = useMemo(() => event?.tracks || [], [event?.tracks]);
  const canManageRubrics = event?.status === "draft";

  const roundById = useMemo(
    () => new Map(rounds.map((round) => [round.id, round])),
    [rounds]
  );
  const trackById = useMemo(
    () => new Map(tracks.map((track) => [track.id, track])),
    [tracks]
  );

  const rubrics = useMemo(() => rubricsQuery.data || [], [rubricsQuery.data]);
  const filteredRubrics = useMemo(
    () =>
      rubrics.filter((rubric) => {
        const matchesRound =
          roundFilter === "all" || String(rubric.roundId) === roundFilter;
        const matchesTrack =
          trackFilter === "all" || String(rubric.trackId) === trackFilter;
        return matchesRound && matchesTrack;
      }),
    [roundFilter, rubrics, trackFilter]
  );

  const selectedScopeWeight = useMemo(() => {
    if (!rubricDraft.roundId || !rubricDraft.trackId) return 0;

    return rubrics.reduce((sum, rubric) => {
      if (
        rubric.id !== editingRubricId &&
        String(rubric.roundId) === rubricDraft.roundId &&
        String(rubric.trackId) === rubricDraft.trackId
      ) {
        return sum + Number(rubric.weight || 0);
      }
      return sum;
    }, 0);
  }, [editingRubricId, rubricDraft.roundId, rubricDraft.trackId, rubrics]);

  const resetForm = () => {
    setEditingRubricId(null);
    setRubricDraft(emptyRubric());
  };

  const saveRubricMutation = useMutation({
    mutationFn: async () => {
      if (!canManageRubrics) {
        throw new Error("Only draft events can manage grading criteria.");
      }
      if (!rubricDraft.roundId) throw new Error("Round is required.");
      if (!rubricDraft.trackId) throw new Error("Track is required.");
      if (!rubricDraft.name.trim()) throw new Error("Criterion name is required.");

      const maxScore = Number(rubricDraft.maxScore);
      const weight = Number(rubricDraft.weight);

      if (!Number.isFinite(maxScore) || maxScore < 1) {
        throw new Error("Max score must be at least 1.");
      }
      if (!Number.isFinite(weight) || weight <= 0) {
        throw new Error("Weight must be greater than 0.");
      }

      const payload: OrganizerRubricPayload = {
        name: rubricDraft.name.trim(),
        description: rubricDraft.description.trim() || undefined,
        maxScore,
        weight,
        roundId: Number(rubricDraft.roundId),
        trackId: Number(rubricDraft.trackId),
      };

      return editingRubricId
        ? updateOrganizerRubric(eventId, editingRubricId, payload)
        : createOrganizerRubric(eventId, payload);
    },
    onSuccess: () => {
      enqueueSnackbar(editingRubricId ? "Rubric updated" : "Rubric created", {
        variant: "success",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["organizerRubrics", eventId] });
    },
    onError: (error) => {
      enqueueSnackbar(getApiMessage(error, "Failed to save rubric"), {
        variant: "error",
      });
    },
  });

  const deleteRubricMutation = useMutation({
    mutationFn: (rubricId: number) => deleteOrganizerRubric(eventId, rubricId),
    onSuccess: (_, deletedRubricId) => {
      enqueueSnackbar("Rubric deleted", { variant: "success" });
      if (editingRubricId === deletedRubricId) resetForm();
      queryClient.invalidateQueries({ queryKey: ["organizerRubrics", eventId] });
    },
    onError: (error) => {
      enqueueSnackbar(getApiMessage(error, "Failed to delete rubric"), {
        variant: "error",
      });
    },
  });

  const startEditRubric = (rubric: OrganizerRubric) => {
    if (!rubric.trackId) {
      enqueueSnackbar("This rubric has no track and cannot be edited in the required format.", {
        variant: "warning",
      });
      return;
    }

    setEditingRubricId(rubric.id);
    setRubricDraft({
      roundId: String(rubric.roundId),
      trackId: String(rubric.trackId),
      name: rubric.name,
      description: rubric.description || "",
      maxScore: rubric.maxScore,
      weight: rubric.weight,
    });
  };

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

  const hasRequiredConfiguration = rounds.length > 0 && tracks.length > 0;
  const canSubmit =
    canManageRubrics &&
    Boolean(rubricDraft.roundId) &&
    Boolean(rubricDraft.trackId) &&
    Boolean(rubricDraft.name.trim()) &&
    !saveRubricMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline">{event.season} {event.year}</Badge>
            <Badge variant={event.status === "draft" ? "warning" : "success"}>
              {event.status}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Grading Criteria</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit, and delete rubrics for {event.name}. Every rubric must belong to a round and a track.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={rubricsQuery.isFetching}
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["organizerRubrics", eventId] })
          }
        >
          <RefreshCcw
            className={cn("h-4 w-4", rubricsQuery.isFetching && "animate-spin")}
          />
          Refresh
        </Button>
      </div>

      {!hasRequiredConfiguration && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          At least one round and one track must be configured before a rubric can be added.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <GlassCard className="min-w-0 rounded-[24px] p-5">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-xl font-bold">Rubric List</h2>
              <p className="text-sm text-muted-foreground">
                {filteredRubrics.length} of {rubrics.length} criteria
              </p>
            </div>

            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[440px]">
              <Field label="Filter by round">
                <select
                  value={roundFilter}
                  onChange={(event) => setRoundFilter(event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="all">All rounds</option>
                  {rounds.map((round) => (
                    <option key={round.id} value={round.id}>
                      Round {round.roundNumber}: {round.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Filter by track">
                <select
                  value={trackFilter}
                  onChange={(event) => setTrackFilter(event.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="all">All tracks</option>
                  {tracks.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {rubricsQuery.isLoading ? (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-border text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading rubrics...
            </div>
          ) : filteredRubrics.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <Plus className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="font-semibold">No rubrics found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a round and track in the form to add the first rubric.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Rubric</th>
                    <th className="px-4 py-3 font-semibold">Round</th>
                    <th className="px-4 py-3 font-semibold">Track</th>
                    <th className="w-24 px-4 py-3 text-center font-semibold">Max</th>
                    <th className="w-24 px-4 py-3 text-center font-semibold">Weight</th>
                    <th className="w-28 px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRubrics.map((rubric) => {
                    const round = rubric.round || roundById.get(rubric.roundId);
                    const track =
                      rubric.track ||
                      (rubric.trackId ? trackById.get(rubric.trackId) : undefined);

                    return (
                      <tr
                        key={rubric.id}
                        className="border-t border-border bg-background/40 align-top"
                      >
                        <td className="px-4 py-4">
                          <div className="font-semibold">{rubric.name}</div>
                          <div className="mt-1 max-w-md line-clamp-2 text-xs text-muted-foreground">
                            {rubric.description || "No description"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {round ? `Round ${round.roundNumber}: ${round.name}` : "Unknown"}
                        </td>
                        <td className="px-4 py-4">
                          {track ? (
                            <Badge variant="outline">{track.name}</Badge>
                          ) : (
                            <Badge variant="secondary">All tracks</Badge>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">{rubric.maxScore}</td>
                        <td className="px-4 py-4 text-center">{rubric.weight}</td>
                        <td className="px-4 py-4">
                          <div 
                            className="flex justify-end gap-2"
                            title={!canManageRubrics ? `Rubrics are read-only because this event is ${event.status}. Only draft events can add, edit, or delete grading criteria.` : undefined}
                          >
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              title="Edit rubric"
                              disabled={!canManageRubrics}
                              onClick={() => startEditRubric(rubric)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              title="Delete rubric"
                              disabled={
                                !canManageRubrics || deleteRubricMutation.isPending
                              }
                              onClick={() => {
                                if (window.confirm(`Delete rubric "${rubric.name}"?`)) {
                                  deleteRubricMutation.mutate(rubric.id);
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>

        <GlassCard className="h-fit rounded-[24px] p-5 xl:sticky xl:top-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">
                {editingRubricId ? "Edit Rubric" : "Add Rubric"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Round and track are required.
              </p>
            </div>

            {editingRubricId && (
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                title="Cancel editing"
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-4">
            <Field label="Round *">
              <select
                value={rubricDraft.roundId}
                disabled={!canManageRubrics}
                onChange={(event) =>
                  setRubricDraft((draft) => ({
                    ...draft,
                    roundId: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select round</option>
                {rounds.map((round) => (
                  <option key={round.id} value={round.id}>
                    Round {round.roundNumber}: {round.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Track *">
              <select
                value={rubricDraft.trackId}
                disabled={!canManageRubrics}
                onChange={(event) =>
                  setRubricDraft((draft) => ({
                    ...draft,
                    trackId: event.target.value,
                  }))
                }
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select track</option>
                {tracks.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Rubric name *">
              <Input
                value={rubricDraft.name}
                placeholder="Technical Implementation"
                disabled={!canManageRubrics}
                onChange={(event) =>
                  setRubricDraft((draft) => ({
                    ...draft,
                    name: event.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Description">
              <Textarea
                value={rubricDraft.description}
                className="min-h-24 resize-none"
                placeholder="Describe what judges should evaluate."
                disabled={!canManageRubrics}
                onChange={(event) =>
                  setRubricDraft((draft) => ({
                    ...draft,
                    description: event.target.value,
                  }))
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Max score *">
                <Input
                  type="number"
                  min={1}
                  value={rubricDraft.maxScore}
                  disabled={!canManageRubrics}
                  onChange={(event) =>
                    setRubricDraft((draft) => ({
                      ...draft,
                      maxScore: event.target.value,
                    }))
                  }
                />
              </Field>

              <Field label="Weight *">
                <Input
                  type="number"
                  min={0.01}
                  step="0.01"
                  value={rubricDraft.weight}
                  disabled={!canManageRubrics}
                  onChange={(event) =>
                    setRubricDraft((draft) => ({
                      ...draft,
                      weight: event.target.value,
                    }))
                  }
                />
              </Field>
            </div>

            {rubricDraft.roundId && rubricDraft.trackId && (
              <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                Current weight for this round and track:{" "}
                <strong className="text-foreground">{selectedScopeWeight}</strong>
              </div>
            )}

            <div title={!canManageRubrics ? `Rubrics are read-only because this event is ${event.status}. Only draft events can add, edit, or delete grading criteria.` : undefined}>
              <Button
                type="button"
                className="w-full"
                disabled={!canSubmit}
                onClick={() => saveRubricMutation.mutate()}
              >
              {saveRubricMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingRubricId ? (
                <Save className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {editingRubricId ? "Update Rubric" : "Add Rubric"}
            </Button>
            </div>

            {!rubricDraft.roundId || !rubricDraft.trackId ? (
              <p className="text-center text-xs text-amber-600 dark:text-amber-400">
                Select both a round and a track to enable this action.
              </p>
            ) : null}
          </div>
        </GlassCard>
      </div>
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
