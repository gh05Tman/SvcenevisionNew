
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  tier: 'amateur' | 'pro';
  createdAt?: string; // ISO string
}

export interface Scene {
  id: string;
  userId?: string;
  locationName?: string;
  location?: { latitude: number; longitude: number }; // Simplified GeoPoint
  dateTime: string; // ISO string for date and time
  weatherCondition: string;
  atmosphericEffects: string[];
  customPrompt?: string;
  voiceInputTranscript?: string;
  previewUrl: string;
  createdAt: string; // ISO string
  sourceImageUrl?: string; // For comparison view
}

export type WeatherCondition = "Sunny" | "Cloudy" | "Rainy" | "Stormy" | "Snowy" | "Foggy";

export const weatherConditions: WeatherCondition[] = ["Sunny", "Cloudy", "Rainy", "Stormy", "Snowy", "Foggy"];

export type AtmosphericEffect = "Clear" | "Sunrise Glow" | "Golden Hour" | "Twilight" | "Misty" | "Hazy" | "Starry Night";

export const atmosphericEffectsList: AtmosphericEffect[] = ["Clear", "Sunrise Glow", "Golden Hour", "Twilight", "Misty", "Hazy", "Starry Night"];

export interface SceneParameters {
  location: string;
  date: Date | undefined;
  time: string;
  weatherCondition: WeatherCondition;
  atmosphericEffects: AtmosphericEffect[];
  customPrompt: string;
}
