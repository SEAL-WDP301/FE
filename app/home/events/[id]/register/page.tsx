"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosClient } from '@/lib/axios';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { enqueueSnackbar } from 'notistack';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [teamName, setTeamName] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [memberEmails, setMemberEmails] = useState<string[]>(['']);

  // Fetch Event Details to get Tracks
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['publicEvent', eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/public/events/${eventId}`);
      return res.data.data;
    },
  });

  // Fetch Student Registration Status
  const { data: studentInfo, isLoading: isStudentLoading } = useQuery({
    queryKey: ['studentEventStatus', eventId],
    queryFn: async () => {
      const res = await axiosClient.get(`/student/events/${eventId}`);
      return res.data.data;
    },
  });

  const teamStatus = studentInfo?.teamInfo?.team?.status;
  const isEditing = !!studentInfo?.teamInfo && teamStatus !== 'eliminated';

  // Pre-fill form if editing or re-registering after elimination
  useEffect(() => {
    if (studentInfo?.teamInfo?.team) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTeamName(studentInfo.teamInfo.team.name);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTrack(studentInfo.teamInfo.team.trackId);
      
      // Pre-fill member emails (excluding the current user / leader)
      if (studentInfo.teamInfo.team.members) {
        const otherMembers = studentInfo.teamInfo.team.members
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((m: any) => m.role === 'member')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((m: any) => m.user?.email)
          .filter(Boolean);
          
        if (otherMembers.length > 0) {
          setMemberEmails(otherMembers);
        } else {
          setMemberEmails(['']);
        }
      }
    }
  }, [studentInfo]);

  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const selectedTrackData = event?.tracks?.find((t: any) => t.id === selectedTrack);
  const maxAdditionalMembers = selectedTrackData?.maxMembersPerTeam ? selectedTrackData.maxMembersPerTeam - 1 : 10;

  useEffect(() => {
    if (selectedTrackData?.maxMembersPerTeam && memberEmails.length > maxAdditionalMembers) {
      setMemberEmails(prev => prev.slice(0, maxAdditionalMembers));
      enqueueSnackbar(`Đã cắt giảm danh sách thành viên để phù hợp giới hạn Track (${selectedTrackData.maxMembersPerTeam} người).`, { variant: 'info' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrackData?.id]);

  const registerMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (data: any) => {
      if (isEditing) {
        return axiosClient.put(`/student/events/${eventId}/register/team`, data);
      }
      return axiosClient.post(`/student/events/${eventId}/register/team`, data);
    },
    onSuccess: () => {
      enqueueSnackbar(isEditing ? 'Team updated successfully!' : 'Team registered successfully!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['studentEventStatus', eventId] });
      router.push(`/home/events/${eventId}`);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Registration failed';
      enqueueSnackbar(message, { variant: 'error' });
    }
  });

  const isLoading = isEventLoading || isStudentLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrack) {
      enqueueSnackbar('Please select a track', { variant: 'warning' });
      return;
    }
    
    // Filter out empty emails
    const validEmails = memberEmails.filter(email => email.trim() !== '');

    registerMutation.mutate({
      trackId: selectedTrack,
      teamName,
      memberEmails: validEmails,
    });
  };

  const addEmailField = () => {
    if (!selectedTrack) {
      enqueueSnackbar('Vui lòng chọn Track trước khi thêm thành viên', { variant: 'warning' });
      return;
    }
    if (memberEmails.length >= maxAdditionalMembers) {
      enqueueSnackbar(`Track này giới hạn tối đa ${selectedTrackData?.maxMembersPerTeam} thành viên (đã bao gồm bạn)`, { variant: 'warning' });
      return;
    }
    setMemberEmails([...memberEmails, '']);
  };
  const removeEmailField = (index: number) => {
    const newEmails = [...memberEmails];
    newEmails.splice(index, 1);
    setMemberEmails(newEmails);
  };
  const updateEmail = (index: number, value: string) => {
    const newEmails = [...memberEmails];
    newEmails[index] = value;
    setMemberEmails(newEmails);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex-1 flex justify-center items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <Link href={`/home/events/${eventId}`} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Event Details
        </Link>

        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-orange-500/10 blur-[80px]" />
          
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-foreground mb-2">Team Registration</h1>
            <p className="text-muted-foreground mb-8">Register your team for <strong>{event.name}</strong></p>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Track Selection */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-foreground">Select Competition Track *</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {event.tracks?.map((track: any) => (
                    <div 
                      key={track.id}
                      onClick={() => setSelectedTrack(track.id)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all ${
                        selectedTrack === track.id 
                          ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500' 
                          : 'border-border bg-muted/50 hover:border-orange-500/50'
                      }`}
                    >
                      <div className="font-semibold text-foreground mb-1">{track.name}</div>
                      <div className="text-xs text-muted-foreground">Max {track.maxMembersPerTeam || 'TBA'} members</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Team Name *</label>
                <input 
                  type="text" 
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your awesome team name"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>

              {/* Member Emails */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-foreground">Invite Members (Optional)</label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addEmailField} 
                    className="h-8"
                    disabled={!selectedTrack || memberEmails.length >= maxAdditionalMembers}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Member
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Enter the email addresses of your team members. They must have an account on SEAL. You are automatically included as the Team Leader.
                </p>

                <div className="space-y-3">
                  {memberEmails.map((email, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => updateEmail(index, e.target.value)}
                        placeholder={`Member ${index + 1} Email`}
                        className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      />
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeEmailField(index)}
                        className="text-red-400 hover:text-red-500 hover:bg-red-400/10 rounded-xl"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white shadow-xl shadow-orange-500/20"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? 'Registering...' : 'Submit Registration'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
