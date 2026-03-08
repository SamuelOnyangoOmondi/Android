
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { MessageList } from "./chat/MessageList";
import { ChatInput } from "./chat/ChatInput";
import { ChatHeader } from "./chat/ChatHeader";
import { Message } from "./chat/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIChatInterfaceProps {
  fullHeight?: boolean;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
  /** When set, pre-fills the input. If onPrefillUsed is provided, it is called after applying. */
  prefillPrompt?: string;
  onPrefillUsed?: () => void;
}

export function AIChatInterface({ fullHeight = false, onToggleCollapse, isCollapsed, prefillPrompt, onPrefillUsed }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm Flami, your intelligent assistant for Supa School. I can access and navigate through the entire school management system to help you with any task. Ask me about student data, school facilities, academic records, or administrative tasks - I can execute your requests in real-time. Whether you need information, want to perform actions, or need guidance through the system, I'm here to assist you!",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (prefillPrompt?.trim()) {
      setInput(prefillPrompt.trim());
      onPrefillUsed?.();
    }
  }, [prefillPrompt, onPrefillUsed]);

  const handleSendMessage = async () => {
    if (input.trim() === "") return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    try {
      // Prepare messages for Mistral API
      const messageHistory = messages.map(msg => ({ 
        role: msg.sender === "user" ? "user" : "assistant", 
        content: msg.content 
      }));
      
      // Add the new user message
      messageHistory.push({ role: "user", content: input });
      
      // Call our secure edge function
      const response = await supabase.functions.invoke("mistral-chat", {
        body: {
          messages: [
            { role: "system", content: "You are Flami, an AI assistant for Supa School. You help with educational administration tasks. Be friendly, helpful, and concise." },
            ...messageHistory
          ],
          model: "mistral-tiny"
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const data = response.data;
      const aiResponse = data.choices[0].message.content;
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling Mistral AI:", error);
      toast.error("Failed to get response from AI assistant. Please try again later.");
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I couldn't process your request. Please try again later.",
        sender: "ai",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleMinimize = () => {
    if (!fullHeight) {
      setIsMinimized(!isMinimized);
    }
  };

  const [isMinimized, setIsMinimized] = useState(false);

  if (fullHeight) {
    return (
      <div className="flex flex-col h-full">
        <ChatHeader 
          isMinimized={isMinimized} 
          onToggleMinimize={toggleMinimize} 
          isFullHeight={true}
          onToggleCollapse={onToggleCollapse}
          isCollapsed={isCollapsed}
        />
        
        <MessageList messages={messages} isTyping={isTyping} />
        
        <ChatInput 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
        />
      </div>
    );
  }

  // Original floating chat implementation
  return (
    <div className={`fixed bottom-0 right-0 w-full md:w-1/3 transition-all duration-300 z-50 ${isMinimized ? 'h-14' : 'h-[25vh]'}`}>
      <Card className="h-full rounded-b-none rounded-t-lg shadow-lg flex flex-col border-t border-x">
        <ChatHeader 
          isMinimized={isMinimized} 
          onToggleMinimize={toggleMinimize} 
          isFullHeight={false} 
        />
        
        {!isMinimized && (
          <>
            <MessageList messages={messages} isTyping={isTyping} />
            
            <ChatInput 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSend={handleSendMessage}
              onKeyPress={handleKeyPress}
            />
          </>
        )}
      </Card>
    </div>
  );
}
