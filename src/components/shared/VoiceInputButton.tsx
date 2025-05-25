
"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { MicIcon, WavesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface VoiceInputButtonProps extends ButtonProps {
  onTranscript?: (transcript: string) => void;
  isRecording?: boolean;
  setIsRecording?: (isRecording: boolean) => void;
}

export function VoiceInputButton({ className, onTranscript, isRecording: externalIsRecording, setIsRecording: externalSetIsRecording, ...props }: VoiceInputButtonProps) {
  const [internalIsRecording, internalSetIsRecording] = useState(false);
  
  const isRecording = externalIsRecording !== undefined ? externalIsRecording : internalIsRecording;
  const setIsRecording = externalSetIsRecording !== undefined ? externalSetIsRecording : internalSetIsRecording;

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording and transcription
      setTimeout(() => {
        const mockTranscript = "User said: make it a snowy day in Paris with a dramatic sunset.";
        if (onTranscript) {
          onTranscript(mockTranscript);
        }
        setIsRecording(false); // Ensure it turns off after mock processing
      }, 2000);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("rounded-full w-10 h-10 transition-all", isRecording ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground" : "hover:bg-accent", className)}
      onClick={handleVoiceInput}
      title={isRecording ? "Stop Recording" : "Start Voice Input"}
      {...props}
    >
      {isRecording ? <WavesIcon className="h-5 w-5 animate-pulse" /> : <MicIcon className="h-5 w-5" />}
      <span className="sr-only">{isRecording ? "Stop Recording" : "Start Voice Input"}</span>
    </Button>
  );
}
