"use client";

import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") || "http://localhost:3000";

export const useSocket = (namespace: string = "") => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const token = localStorage.getItem("access_token");
    if (!token) return;

    if (!socketRef.current) {
      const url = namespace ? `${SOCKET_URL}${namespace.startsWith('/') ? namespace : `/${namespace}`}` : SOCKET_URL;
      socketRef.current = io(url, {
        auth: (cb) => {
          cb({ token: localStorage.getItem("access_token") });
        },
        transports: ["websocket"],
      });

      socketRef.current.on("connect", () => setIsConnected(true));
      socketRef.current.on("disconnect", () => setIsConnected(false));
    }

    const handleTokenRefresh = () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.connect(); // Tự động lấy token mới nhờ hàm auth ở trên
      }
    };

    const handleAuthUnauthorized = () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };

    window.addEventListener("token-refreshed", handleTokenRefresh);
    window.addEventListener("auth-unauthorized", handleAuthUnauthorized);

    return () => {
      window.removeEventListener("token-refreshed", handleTokenRefresh);
      window.removeEventListener("auth-unauthorized", handleAuthUnauthorized);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    };
  }, []);

  return { socket: socketRef.current, isConnected };
};
