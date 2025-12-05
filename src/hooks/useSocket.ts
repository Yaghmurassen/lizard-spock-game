import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (url?: string) => {
  const socket = useMemo(() => {
    if (typeof window === "undefined") return null;

    return io(url || "", {
      path: "/api/socket",
      autoConnect: false,
    });
  }, [url]);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Initialize the socket server by calling the API route
    fetch("/api/socket")
      .then(() => {
        console.log("Socket server initialized");
        // Connect after server is ready
        socket.connect();
      })
      .catch((err) => {
        console.error("Socket init error:", err);
        // Still try to connect even if fetch fails
        socket.connect();
      });

    // Set up event listeners
    const handleConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [socket]);

  return { socket, isConnected };
};
