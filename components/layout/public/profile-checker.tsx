/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/axios";
import { ProfileCompletionModal } from "./profile-completion-modal";

export function ProfileChecker() {
  const [showModal, setShowModal] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // We only run this query if there is an access_token in localStorage
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("access_token");

  const { data: user, isSuccess } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const res = await axiosClient.get("/users/profile");
      const profile = res.data?.data;
      return profile
        ? { ...profile, avatarUrl: profile.avatarUrl ?? profile.avatar_url }
        : null;
    },
    enabled: hasToken && !hasChecked,
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && user) {
      // Check if both profiles are missing
      if (!user.studentProfile && !user.stakeholderProfile) {
        setShowModal(true);
      }
      setHasChecked(true);
    }
  }, [isSuccess, user]);

  return (
    <>
      <ProfileCompletionModal isOpen={showModal} onOpenChange={setShowModal} />
    </>
  );
}
