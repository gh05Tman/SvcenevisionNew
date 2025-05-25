'use server';

/**
 * @fileOverview Augments a scene generation request with a custom prompt.
 *
 * - augmentSceneWithCustomPrompt - A function that augments the scene with a custom prompt.
 * - AugmentSceneWithCustomPromptInput - The input type for the augmentSceneWithCustomPrompt function.
 * - AugmentSceneWithCustomPromptOutput - The return type for the augmentSceneWithCustomPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AugmentSceneWithCustomPromptInputSchema = z.object({
  location: z.string().describe('The location of the scene.'),
  dateTime: z.string().describe('The date and time of the scene.'),
  weatherCondition: z.string().describe('The weather condition of the scene.'),
  atmosphericEffects: z
    .string()
    .array()
    .describe('The atmospheric effects of the scene.'),
  customPrompt: z
    .string()
    .optional()
    .describe('Custom instructions to augment the scene generation.'),
});
export type AugmentSceneWithCustomPromptInput = z.infer<typeof AugmentSceneWithCustomPromptInputSchema>;

const AugmentSceneWithCustomPromptOutputSchema = z.object({
  augmentedPrompt: z.string().describe('The final prompt used for scene generation.'),
});
export type AugmentSceneWithCustomPromptOutput = z.infer<typeof AugmentSceneWithCustomPromptOutputSchema>;

export async function augmentSceneWithCustomPrompt(
  input: AugmentSceneWithCustomPromptInput
): Promise<AugmentSceneWithCustomPromptOutput> {
  return augmentSceneWithCustomPromptFlow(input);
}

const augmentSceneWithCustomPromptPrompt = ai.definePrompt({
  name: 'augmentSceneWithCustomPromptPrompt',
  input: {schema: AugmentSceneWithCustomPromptInputSchema},
  output: {schema: AugmentSceneWithCustomPromptOutputSchema},
  prompt: `You are an AI assistant that refines scene generation prompts based on user input.

        Take the following scene parameters and generate a comprehensive prompt for image generation. Incorporate any custom instructions provided by the user to create a more specific and personalized preview.

        Location: {{{location}}}
        Date and Time: {{{dateTime}}}
        Weather Condition: {{{weatherCondition}}}
        Atmospheric Effects: {{#each atmosphericEffects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
        Custom Instructions: {{{customPrompt}}}

        Compose a detailed prompt that leverages the above information to generate a realistic and visually compelling scene preview.`,
});

const augmentSceneWithCustomPromptFlow = ai.defineFlow(
  {
    name: 'augmentSceneWithCustomPromptFlow',
    inputSchema: AugmentSceneWithCustomPromptInputSchema,
    outputSchema: AugmentSceneWithCustomPromptOutputSchema,
  },
  async input => {
    const {output} = await augmentSceneWithCustomPromptPrompt(input);
    return output!;
  }
);
