"use client";

import { useEffect, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { usePathname } from "next/navigation";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export function SseProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const ctrlRef = useRef<AbortController | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Only connect if we have a token and are not on an auth page
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    
    if (!token || pathname.startsWith('/auth')) {
      return;
    }

    if (ctrlRef.current) {
      ctrlRef.current.abort();
    }

    ctrlRef.current = new AbortController();

    const connect = async () => {
      try {
        await fetchEventSource(`${baseURL}/users/notifications/stream`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "text/event-stream",
          },
          signal: ctrlRef.current?.signal,
          onmessage(ev) {
            try {
              const data = JSON.parse(ev.data);
              
              enqueueSnackbar(data.title || "Bạn có thông báo mới!", {
                variant: "info",
                autoHideDuration: 5000,
              });

              queryClient.invalidateQueries({ queryKey: ["userNotifications"] });
            } catch (e) {
              console.error("Failed to parse SSE data", e);
            }
          },
          onerror(err) {
            console.error("SSE Error:", err);
            // Throw to retry, or don't throw to just stop
            // In a real app we might want to implement exponential backoff
          },
          onclose() {
            // Connection closed by server
          }
        });
      } catch (err) {
        // Fatal error outside fetchEventSource
      }
    };

    connect();

    return () => {
      if (ctrlRef.current) {
        ctrlRef.current.abort();
        ctrlRef.current = null;
      }
    };
  }, [queryClient, pathname]);

  return <>{children}</>;
}
