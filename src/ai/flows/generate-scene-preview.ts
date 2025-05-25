// This is a server action.
'use server';

/**
 * @fileOverview Generates a photorealistic scene preview based on location, date, time, and weather conditions.
 *
 * - generateScenePreview - A function that handles the scene preview generation process.
 * - GenerateScenePreviewInput - The input type for the generateScenePreview function.
 * - GenerateScenePreviewOutput - The return type for the generateScenePreview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScenePreviewInputSchema = z.object({
  location: z.string().describe('The location for the scene preview.'),
  dateTime: z.string().describe('The date and time for the scene preview.'),
  weatherCondition: z.string().describe('The weather condition for the scene preview.'),
  customPrompt: z.string().optional().describe('Optional custom prompt to augment the scene generation.'),
  voiceInputTranscript: z.string().optional().describe('Optional voice input transcript to augment the scene generation.'),
});
export type GenerateScenePreviewInput = z.infer<typeof GenerateScenePreviewInputSchema>;

const GenerateScenePreviewOutputSchema = z.object({
  generatedPreviewUrl: z.string().describe('The URL of the generated scene preview image.'),
});
export type GenerateScenePreviewOutput = z.infer<typeof GenerateScenePreviewOutputSchema>;

export async function generateScenePreview(input: GenerateScenePreviewInput): Promise<GenerateScenePreviewOutput> {
  return generateScenePreviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScenePreviewPrompt',
  input: {schema: GenerateScenePreviewInputSchema},
  output: {schema: GenerateScenePreviewOutputSchema},
  prompt: `You are an AI that generates photorealistic scene previews based on given parameters.

  Location: {{{location}}}
  Date and Time: {{{dateTime}}}
  Weather Condition: {{{weatherCondition}}}
  Custom Prompt: {{{customPrompt}}}
  Voice Input Transcript: {{{voiceInputTranscript}}}

  Generate a photorealistic image based on the above parameters. The image should be highly detailed and visually appealing.`,
});

const generateScenePreviewFlow = ai.defineFlow(
  {
    name: 'generateScenePreviewFlow',
    inputSchema: GenerateScenePreviewInputSchema,
    outputSchema: GenerateScenePreviewOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      // IMPORTANT: ONLY the googleai/gemini-2.0-flash-exp model is able to generate images. You MUST use exactly this model to generate images.
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: `Location: ${input.location}, Date and Time: ${input.dateTime}, Weather Condition: ${input.weatherCondition}, Custom Prompt: ${input.customPrompt}, Voice Input Transcript: ${input.voiceInputTranscript}. Generate a photorealistic image based on the above parameters. The image should be highly detailed and visually appealing.`,      
      config: {
        responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
      },
    });

    return {
      generatedPreviewUrl: media.url,
    };
  }
);
