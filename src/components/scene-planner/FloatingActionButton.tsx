
"use client";

import { Button } from "@/components/ui/button";
import { Wand2Icon } from "lucide-react"; // Or any other suitable icon like CameraIcon, SparklesIcon

interface FloatingActionButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export function FloatingActionButton({ onClick, isLoading }: FloatingActionButtonProps) {
  return (
    <Button
      size="lg"
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 rounded-full h-16 w-16 md:h-20 md:w-auto md:px-8 shadow-2xl z-50 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all transform hover:scale-105"
      onClick={onClick}
      disabled={isLoading}
      aria-label="Generate Scene Preview"
    >
      <Wand2Icon className={`h-6 w-6 md:h-7 md:w-7 ${isLoading ? 'animate-spin' : ''} md:mr-3`} />
      <span className="hidden md:inline text-lg font-semibold">
        {isLoading ? "Generating..." : "Generate Scene"}
      </span>
    </Button>
  );
}
