"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3000";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const token = localStorage.getItem("access_token");
    if (!token) return;

    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => setIsConnected(true));
      socketRef.current.on("disconnect", () => setIsConnected(false));
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, []);

  return { socket: socketRef.current, isConnected };
};
