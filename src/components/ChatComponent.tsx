import React, { useState, useEffect } from "react";
import { useSocketContext } from "@/contexts/SocketContext";

interface Message {
  id: string;
  text: string;
  timestamp: number;
}

export const ChatComponent: React.FC = () => {
  const { socket, isConnected } = useSocketContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (!socket || !inputValue.trim() || !isConnected) return;

    const message: Message = {
      id: Date.now().toString(),
      text: inputValue,
      timestamp: Date.now(),
    };

    socket.emit("message", message);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isConnected && inputValue.trim()) {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <div
          className={`inline-block px-3 py-1 rounded-full text-sm ${
            isConnected ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-100 rounded-lg p-4 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2 p-2 bg-white rounded shadow">
            <p className="text-sm text-gray-600">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </p>
            <p className="text-gray-900">{msg.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
};
