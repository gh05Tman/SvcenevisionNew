import {genkit} from 'genkit';
import {openAI} from '@genkit-ai/openai';

export const ai = genkit({
  plugins: [
    openAI({apiKey: process.env.OPENAI_API_KEY}),
  ],
  // No global default model specified, flows should define their models.
});
