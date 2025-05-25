'use server';

/**
 * @fileOverview This flow allows users to use voice input to set custom prompts for scene generation.
 *
 * - voiceInputToSetPrompts - A function that takes audio data and returns a generated image URL.
 * - VoiceInputToSetPromptsInput - The input type for the voiceInputToSetPrompts function.
 * - VoiceInputToSetPromptsOutput - The return type for the voiceInputToSetPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceInputToSetPromptsInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data URI containing the user's voice input. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  location: z.string().describe('The location for the scene.'),
  dateTime: z.string().describe('The date and time for the scene.'),
  weatherCondition: z.string().describe('The weather conditions for the scene.'),
  atmosphericEffects: z.string().array().of(z.string()).describe('The atmospheric effects for the scene.'),
});
export type VoiceInputToSetPromptsInput = z.infer<typeof VoiceInputToSetPromptsInputSchema>;

const VoiceInputToSetPromptsOutputSchema = z.object({
  generatedImageUrl: z.string().describe('URL of the generated image based on voice input.'),
  voiceInputTranscript: z.string().describe('The transcript of the voice input.'),
});
export type VoiceInputToSetPromptsOutput = z.infer<typeof VoiceInputToSetPromptsOutputSchema>;

export async function voiceInputToSetPrompts(input: VoiceInputToSetPromptsInput): Promise<VoiceInputToSetPromptsOutput> {
  return voiceInputToSetPromptsFlow(input);
}

const transcribeVoiceInput = ai.defineTool(
  {
    name: 'transcribeVoiceInput',
    description: 'Transcribes audio data to text.',
    inputSchema: z.object({
      audioDataUri: z.string().describe("Audio data URI of the voice input."),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // Mock implementation of voice-to-text transcription.
    // In a real application, this would use a service like Google Cloud Speech-to-Text.
    console.log('Transcribing voice input:', input.audioDataUri);
    return `TRANSCRIPTION: The user said create a scene with ${input.audioDataUri} at ${input.location} on ${input.dateTime} in ${input.weatherCondition} with ${input.atmosphericEffects.join(', ')}`;
  }
);

const generateScenePrompt = ai.defineTool(
  {
    name: 'generateScenePrompt',
    description: 'Generates a detailed scene prompt based on location, date, time, weather conditions, atmospheric effects and voice input.',
    inputSchema: z.object({
      location: z.string().describe('The location for the scene.'),
      dateTime: z.string().describe('The date and time for the scene.'),
      weatherCondition: z.string().describe('The weather conditions for the scene.'),
      atmosphericEffects: z.string().array().of(z.string()).describe('The atmospheric effects for the scene.'),
      voiceInputTranscript: z.string().describe('The transcript of the voice input.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // In a real application, this would generate a more refined prompt
    // based on the input parameters.
    return `Create a scene of ${input.location} on ${input.dateTime} in ${input.weatherCondition} with ${input.atmosphericEffects.join(', ')}. Voice input details: ${input.voiceInputTranscript}`;
  }
);

const generateImage = ai.defineTool(
  {
    name: 'generateImage',
    description: 'Generates an image based on a scene prompt.',
    inputSchema: z.object({
      scenePrompt: z.string().describe('The scene prompt to use for image generation.'),
    }),
    outputSchema: z.string().describe('The url of the image.'),
  },
  async (input) => {
    console.log("Generating image with prompt: " + input.scenePrompt)
    // In a real application, this would call an image generation API.
    // For this example, we'll return a placeholder URL.
    return 'https://example.com/generated-image.jpg';
  }
);


const voiceInputToSetPromptsFlow = ai.defineFlow(
  {
    name: 'voiceInputToSetPromptsFlow',
    inputSchema: VoiceInputToSetPromptsInputSchema,
    outputSchema: VoiceInputToSetPromptsOutputSchema,
  },
  async input => {
    const voiceInputTranscript = await transcribeVoiceInput({
      audioDataUri: input.audioDataUri,
    });

    const scenePrompt = await generateScenePrompt({
      location: input.location,
      dateTime: input.dateTime,
      weatherCondition: input.weatherCondition,
      atmosphericEffects: input.atmosphericEffects,
      voiceInputTranscript: voiceInputTranscript,
    });

    const generatedImageUrl = await generateImage({
      scenePrompt: scenePrompt,
    });

    return {
      generatedImageUrl: generatedImageUrl,
      voiceInputTranscript: voiceInputTranscript,
    };
  }
);
