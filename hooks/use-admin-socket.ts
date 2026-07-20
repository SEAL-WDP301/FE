import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/lib/stores/auth.store";

interface UseAdminSocketOptions {
  eventId?: number | string;
  roundId?: number | string;
  teamId?: number | string;
}

export function useAdminSocket({ eventId, roundId, teamId }: UseAdminSocketOptions = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    // Only connect if user is logged in
    if (!accessToken) return;

    // We get the base URL from env or fallback to localhost
    const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://localhost:3000";

    const socketInstance = io(`${SOCKET_URL}/admin-realtime`, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("Admin socket connected:", socketInstance.id);
      setIsConnected(true);
      
      // Join specific rooms based on props
      if (eventId) {
        socketInstance.emit("joinEvent", { eventId: Number(eventId) });
      }
      if (roundId) {
        socketInstance.emit("joinRound", { roundId: Number(roundId) });
      }
      if (teamId) {
        socketInstance.emit("joinTeam", { teamId: Number(teamId) });
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("Admin socket disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [accessToken, eventId, roundId, teamId]);

  return { socket, isConnected };
}
