
"use client";

import { useState } from 'react';
import { InteractiveMap } from '@/components/scene-planner/InteractiveMap';
import { SceneControls } from '@/components/scene-planner/SceneControls';
import { ScenePreview } from '@/components/scene-planner/ScenePreview';
import { FloatingActionButton } from '@/components/scene-planner/FloatingActionButton';
import { generateScenePreview } from '@/ai/flows/generate-scene-preview';
import { augmentSceneWithCustomPrompt } from '@/ai/flows/augment-scene-with-custom-prompt';
import { voiceInputToSetPrompts } from '@/ai/flows/voice-input-to-set-prompts'; // For future use if direct voice->image
import { useToast } from '@/hooks/use-toast';
import type { Scene, SceneParameters } from '@/types';
import { Separator } from '@/components/ui/separator';

export default function ScenePlannerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScene, setGeneratedScene] = useState<Scene | null>(null);
  const [currentSceneParams, setCurrentSceneParams] = useState<SceneParameters | null>(null);
  const { toast } = useToast();

  // Mock user ID for saving scenes
  const mockUserId = "mock-user-123";

  const handleGenerateScene = async (params: SceneParameters) => {
    setIsLoading(true);
    setCurrentSceneParams(params);
    setGeneratedScene(null); // Clear previous scene

    try {
      let finalPrompt = `Location: ${params.location}, Date and Time: ${params.date?.toISOString().split('T')[0]} ${params.time}, Weather: ${params.weatherCondition}, Effects: ${params.atmosphericEffects.join(', ')}.`;
      
      if (params.customPrompt) {
        // Augment with custom prompt if provided
        const augmentedResult = await augmentSceneWithCustomPrompt({
          location: params.location,
          dateTime: `${params.date?.toISOString().split('T')[0]} ${params.time}`,
          weatherCondition: params.weatherCondition,
          atmosphericEffects: params.atmosphericEffects,
          customPrompt: params.customPrompt,
        });
        finalPrompt = augmentedResult.augmentedPrompt;
        // The voiceInputTranscript would be part of customPrompt if voice input was used to populate it.
      }
      
      // Call the GenAI flow
      const result = await generateScenePreview({
        location: params.location,
        dateTime: `${params.date?.toISOString().split('T')[0]} ${params.time}`, // Combine date and time
        weatherCondition: params.weatherCondition,
        customPrompt: finalPrompt, // Use the potentially augmented prompt
        // voiceInputTranscript: if voice was handled separately and not merged into customPrompt.
        // For now, assuming customPrompt contains voice transcript if applicable.
      });

      const newScene: Scene = {
        id: crypto.randomUUID(),
        userId: mockUserId,
        locationName: params.location,
        dateTime: new Date().toISOString(), // Should be params.date + params.time
        weatherCondition: params.weatherCondition,
        atmosphericEffects: params.atmosphericEffects,
        customPrompt: params.customPrompt,
        previewUrl: result.generatedPreviewUrl || "https://placehold.co/1280x720.png?text=Preview+Error",
        createdAt: new Date().toISOString(),
        sourceImageUrl: "https://placehold.co/1280x720.png?text=Source+Street+View", // Placeholder for comparison
      };
      setGeneratedScene(newScene);
      toast({ title: "Scene Generated!", description: "Your vision is ready to view." });
    } catch (error) {
      console.error("Error generating scene:", error);
      toast({ title: "Generation Failed", description: "Could not generate scene. Please try again.", variant: "destructive" });
      // Set a placeholder error image if generation fails
      setGeneratedScene({
        id: 'error-scene',
        previewUrl: 'https://placehold.co/1280x720.png?text=Generation+Failed',
        dateTime: new Date().toISOString(),
        weatherCondition: params.weatherCondition,
        atmosphericEffects: params.atmosphericEffects,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveScene = (scene: Scene) => {
    // Mock saving to gallery
    console.log("Saving scene:", scene);
    // In a real app, this would save to Firestore and update a global gallery state or re-fetch.
    let gallery = JSON.parse(localStorage.getItem('sceneVisionGallery') || '[]');
    gallery.unshift(scene); // Add to the beginning
    localStorage.setItem('sceneVisionGallery', JSON.stringify(gallery));
    toast({ title: "Scene Saved!", description: "Added to your gallery." });
  };

  const handleShareScene = (scene: Scene) => {
    // Mock sharing
    console.log("Sharing scene:", scene);
    navigator.clipboard.writeText(scene.previewUrl)
      .then(() => toast({ title: "Link Copied!", description: "Preview URL copied to clipboard." }))
      .catch(() => toast({ title: "Copy Failed", description: "Could not copy link.", variant: "destructive" }));
  };

  return (
    <div className="container mx-auto py-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <SceneControls onGenerate={handleGenerateScene} isLoading={isLoading} />
        </div>

        {/* Map and Preview Column */}
        <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
          <InteractiveMap />
          <Separator />
          <ScenePreview
            scene={generatedScene}
            sceneParams={currentSceneParams || undefined}
            onSave={handleSaveScene}
            onShare={handleShareScene}
            isLoading={isLoading && !generatedScene} // Show loading in preview only if no scene yet
          />
        </div>
      </div>
      <FloatingActionButton onClick={() => {
        // This button might trigger form submission or a specific action
        // For now, let's assume it triggers based on current form state if the form isn't auto-submitting
        // This requires a ref to the form or lifting state up for the button to trigger handleGenerateScene
        // For simplicity, this FAB might be better placed inside SceneControls or trigger a global generate action
        const form = document.querySelector('form'); // Not ideal, better to use state/refs
        if (form) form.requestSubmit(); // This assumes SceneControls has one form
         else if(currentSceneParams) handleGenerateScene(currentSceneParams); // Fallback if form not easily accessible
      }} isLoading={isLoading} />
    </div>
  );
}
