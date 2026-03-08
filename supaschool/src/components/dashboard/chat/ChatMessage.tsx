
import React from "react";
import { RefreshCw } from "lucide-react";
import { Message } from "./types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        message.sender === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] p-3 rounded-lg ${
          message.sender === "user"
            ? "bg-primary text-white rounded-tr-none"
            : "bg-accent-soft-yellow text-gray-800 rounded-tl-none"
        }`}
      >
        <p>{message.content}</p>
        <div
          className={`text-xs mt-1 ${
            message.sender === "user" ? "text-white/70" : "text-gray-500"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-accent-soft-yellow text-gray-800 p-3 rounded-lg rounded-tl-none">
        <RefreshCw className="h-5 w-5 animate-spin" />
      </div>
    </div>
  );
}
