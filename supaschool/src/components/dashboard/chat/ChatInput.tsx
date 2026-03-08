
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, MicIcon } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

export function ChatInput({ value, onChange, onSend, onKeyPress }: ChatInputProps) {
  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex w-full gap-2">
        <Input
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Ask Flami about your school..."
          className="flex-grow"
        />
        <Button 
          onClick={onSend} 
          className="bg-primary hover:bg-secondary"
          disabled={!value.trim()}
          aria-label="Send message"
        >
          <SendIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
