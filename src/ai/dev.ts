import { config } from 'dotenv';
config();

import '@/ai/flows/augment-scene-with-custom-prompt.ts';
import '@/ai/flows/generate-scene-preview.ts';
import '@/ai/flows/voice-input-to-set-prompts.ts';