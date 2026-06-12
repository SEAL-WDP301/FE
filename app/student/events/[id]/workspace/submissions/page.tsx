"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi } from "@/lib/api/workspace.api";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  UploadCloud, 
  File, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Loader2
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { useSnackbar } from "notistack";

function useCountdown(targetDate: string | null) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function SubmissionsPage() {
  const params = useParams();
  const eventId = Number(params.id);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [file, setFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["workspace", eventId],
    queryFn: () => workspaceApi.getWorkspaceOverview(eventId),
  });

  const workspaceData = data?.data;
  const currentActiveRound = workspaceData?.currentActiveRound;
  const latestSubmission = workspaceData?.latestSubmission;
  const timeLeft = useCountdown(currentActiveRound?.submissionDeadline || null);

  const isDeadlinePassed = currentActiveRound?.submissionDeadline 
    ? new Date() > new Date(currentActiveRound.submissionDeadline)
    : false;

  // Sync initial state if there's a past submission
  useEffect(() => {
    if (latestSubmission) {
      setGithubUrl(latestSubmission.githubUrl || "");
      setDescription(latestSubmission.description || "");
    }
  }, [latestSubmission]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!currentActiveRound) throw new Error("No active round");
      
      const formData = new FormData();
      formData.append("eventId", String(eventId));
      formData.append("roundId", String(currentActiveRound.id));
      if (githubUrl) formData.append("githubUrl", githubUrl);
      if (description) formData.append("description", description);
      if (file) formData.append("file", file);

      return workspaceApi.submitProject(formData);
    },
    onSuccess: () => {
      enqueueSnackbar("Project submitted successfully!", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["workspace", eventId] });
      setFile(null); // Clear file after successful upload
    },
    onError: (err: any) => {
      const responseData = err?.response?.data;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        responseData.errors.forEach((e: string) => enqueueSnackbar(e, { variant: "error" }));
      } else {
        enqueueSnackbar(responseData?.message || "Failed to submit", { variant: "error" });
      }
    }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const maxSize = currentActiveRound?.maxFileSizeMb || 20;
      if (droppedFile.size > maxSize * 1024 * 1024) {
        enqueueSnackbar(`File must be smaller than ${maxSize}MB`, { variant: "error" });
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const maxSize = currentActiveRound?.maxFileSizeMb || 20;
      if (selectedFile.size > maxSize * 1024 * 1024) {
        enqueueSnackbar(`File must be smaller than ${maxSize}MB`, { variant: "error" });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !githubUrl && !latestSubmission) {
      enqueueSnackbar("Please provide a file or GitHub URL", { variant: "warning" });
      return;
    }
    submitMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!currentActiveRound) {
    return (
      <div className="mx-auto max-w-[1000px] flex items-center justify-center h-[50vh]">
        <GlassCard className="p-12 text-center rounded-[24px]">
          <AlertCircle className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Active Round</h2>
          <p className="text-muted-foreground">There are currently no active submission rounds for your team.</p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px] space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Project Submission</h1>
          <p className="text-muted-foreground mt-1">
            Submit your work for {currentActiveRound.name}
          </p>
        </div>
        
        {/* Countdown Badge */}
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${isDeadlinePassed ? "bg-red-500/10 border-red-500/30 text-red-500" : "bg-orange-500/10 border-orange-500/30 text-orange-500"}`}>
          <Clock className="h-5 w-5" />
          {isDeadlinePassed ? (
            <span className="font-bold tracking-wider">DEADLINE PASSED</span>
          ) : (
            <div className="font-mono font-bold text-lg tracking-wider">
              {timeLeft.days > 0 && <>{timeLeft.days}d : </>}
              {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m
            </div>
          )}
        </div>
      </header>

      {/* Main Form Area */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            
            {/* Dropzone */}
            <GlassCard className="p-8 rounded-[24px]">
              <h2 className="text-xl font-semibold mb-4">Upload File</h2>
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${isDragging ? "border-orange-500 bg-orange-500/5" : "border-border hover:bg-white/[0.02]"} ${isDeadlinePassed ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.zip,.rar"
                  disabled={isDeadlinePassed}
                />
                
                {file ? (
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center mb-4">
                      <File className="h-8 w-8" />
                    </div>
                    <p className="font-semibold text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center pointer-events-none">
                    <div className="h-16 w-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-4">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <p className="font-semibold text-foreground mb-1">
                      Click or drag file to this area to upload
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Support for a single PDF or ZIP upload. Maximum {currentActiveRound?.maxFileSizeMb || 20}MB.
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Links and Description */}
            <GlassCard className="p-8 rounded-[24px] space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <FaGithub className="h-4 w-4" />
                  GitHub Repository URL
                </label>
                <Input 
                  placeholder="https://github.com/your-username/repo" 
                  className="bg-background border-border h-12"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  disabled={isDeadlinePassed}
                />
              </div>

              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Project Description / Notes
                </label>
                <Textarea 
                  placeholder="Briefly describe your project or add any notes for the judges..." 
                  className="bg-background border-border min-h-[120px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isDeadlinePassed}
                />
              </div>
            </GlassCard>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
          <GlassCard className="p-6 rounded-[24px]">
            <h3 className="font-semibold mb-4 text-lg border-b border-border pb-4">Current Submission</h3>
            {latestSubmission ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="pb-4">
                    <p className="font-medium">Submitted</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(latestSubmission.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {latestSubmission.fileUrl && (
                  <Button variant="outline" className="w-full justify-start h-12 text-[15px] font-medium" asChild>
                    <a href={latestSubmission.fileUrl} target="_blank" rel="noreferrer">
                      <File className="h-5 w-5 mr-2 text-orange-500" />
                      View Uploaded File
                    </a>
                  </Button>
                )}

                {latestSubmission.githubUrl && (
                  <Button variant="outline" className="w-full justify-start h-12 text-[15px] font-medium" asChild>
                    <a href={latestSubmission.githubUrl} target="_blank" rel="noreferrer">
                      <FaGithub className="h-5 w-5 mr-2" />
                      View Repository
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-muted-foreground">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">No active submission found for this round.</p>
              </div>
            )}
          </GlassCard>

          {/* Submission History */}
          <GlassCard className="p-6 rounded-[24px]">
            <h3 className="font-semibold mb-4 text-lg border-b border-border pb-4">Audit History</h3>
            {latestSubmission?.history && Array.isArray(latestSubmission.history) && latestSubmission.history.length > 0 ? (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                <div className="relative border-l-2 border-border/60 ml-2 pl-5 space-y-6 py-2">
                  {latestSubmission.history.slice().reverse().slice(0, 5).map((log: any, index: number) => {
                    const isLatest = index === 0;
                    return (
                      <div key={index} className="relative flex gap-4 text-sm">
                        {/* Timeline Dot */}
                        <div className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-background ${isLatest ? "bg-orange-500 shadow-[0_0_0_4px_rgba(249,115,22,0.15)]" : "bg-muted-foreground/30"}`} />
                        
                        <div className={`flex-1 ${isLatest ? "opacity-100" : "opacity-60 hover:opacity-100 transition-opacity duration-300"}`}>
                          <p className={`font-semibold ${isLatest ? "text-orange-500" : "text-foreground/80"}`}>
                            {log.action === "created" ? "Initial Submission" : "File Overwritten"}
                            {isLatest && <span className="ml-2 text-[10px] bg-orange-500/10 text-orange-500 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">Latest</span>}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(log.timestamp).toLocaleString()} by {log.userName || "Leader"}
                          </p>
                          {log.fileName && (
                            <div className="mt-2 inline-flex items-center gap-1.5 bg-muted/50 border border-border/50 px-2 py-1 rounded-md max-w-full">
                              <File className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span className="text-xs text-muted-foreground truncate">{log.fileName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {latestSubmission.history.length > 5 && (
                  <Dialog>
                    <DialogTrigger>
                      <Button variant="outline" className="w-full mt-4" size="sm">
                        View all {latestSubmission.history.length} records
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Full Audit History</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4 mt-4">
                        {latestSubmission.history.slice().reverse().map((log: any, index: number) => (
                          <div key={index} className="flex gap-3 text-sm border-b border-border/50 pb-4 last:border-0 last:pb-0">
                            <div className="mt-1">
                              <div className={`h-2 w-2 rounded-full ${log.action === "created" ? "bg-green-500" : "bg-orange-500"}`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {log.action === "created" ? "Initial Submission" : "File Overwritten"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(log.timestamp).toLocaleString()} by {log.userName || "Leader"}
                              </p>
                              {log.fileName && (
                                <p className="text-xs text-muted-foreground mt-2 bg-muted px-2 py-1 rounded-md inline-block break-all">
                                  {log.fileName}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <p className="text-sm">No history available yet.</p>
              </div>
            )}
            </GlassCard>
          </div>
        </div>

        <Button 
        type="submit" 
        variant="orange" 
        className="w-full h-14 text-lg rounded-xl shadow-[0_0_20px_rgba(243,112,33,0.3)]"
        disabled={isDeadlinePassed || submitMutation.isPending || (!file && !githubUrl && !latestSubmission)}
      >
        {submitMutation.isPending ? (
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
        ) : (
          <CheckCircle2 className="h-5 w-5 mr-2" />
        )}
        {latestSubmission ? "Resubmit Project" : "Submit Project"}
      </Button>
    </form>
  </div>
  );
}
