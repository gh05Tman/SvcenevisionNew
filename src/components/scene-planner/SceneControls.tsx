
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPinIcon, ClockIcon, CloudIcon, SparklesIcon, SunIcon, CloudRainIcon, CloudSnowIcon, ZapIcon, EyeIcon as FogIcon } from 'lucide-react';
import { VoiceInputButton } from '@/components/shared/VoiceInputButton';
import type { SceneParameters, WeatherCondition, AtmosphericEffect } from '@/types';
import { weatherConditions, atmosphericEffectsList } from '@/types';

interface SceneControlsProps {
  onGenerate: (params: SceneParameters) => void;
  isLoading: boolean;
  initialParameters?: Partial<SceneParameters>;
}

const weatherIcons: Record<WeatherCondition, React.ElementType> = {
  Sunny: SunIcon,
  Cloudy: CloudIcon,
  Rainy: CloudRainIcon,
  Stormy: ZapIcon,
  Snowy: CloudSnowIcon,
  Foggy: FogIcon,
};

export function SceneControls({ onGenerate, isLoading, initialParameters }: SceneControlsProps) {
  const [location, setLocation] = useState(initialParameters?.location || 'Eiffel Tower, Paris');
  const [date, setDate] = useState<Date | undefined>(initialParameters?.date || new Date());
  const [time, setTime] = useState(initialParameters?.time || format(new Date(), 'HH:mm'));
  const [weather, setWeather] = useState<WeatherCondition>(initialParameters?.weatherCondition || 'Sunny');
  const [selectedAtmosphericEffects, setSelectedAtmosphericEffects] = useState<AtmosphericEffect[]>(initialParameters?.atmosphericEffects || ['Clear']);
  const [customPrompt, setCustomPrompt] = useState(initialParameters?.customPrompt || '');
  const [isRecording, setIsRecording] = useState(false);

  const handleAtmosphericEffectChange = (effect: AtmosphericEffect) => {
    setSelectedAtmosphericEffects(prev =>
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
  };

  const handleVoiceTranscript = (transcript: string) => {
    setCustomPrompt(prev => prev ? `${prev}\n${transcript}` : transcript);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      location,
      date,
      time,
      weatherCondition: weather,
      atmosphericEffects: selectedAtmosphericEffects,
      customPrompt,
    });
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-montserrat">Scene Parameters</CardTitle>
        <CardDescription>Set the stage for your vision.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center"><MapPinIcon className="mr-2 h-4 w-4 text-primary" />Location</Label>
            <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Times Square, New York" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center"><CalendarIcon className="mr-2 h-4 w-4 text-primary" />Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center"><ClockIcon className="mr-2 h-4 w-4 text-primary" />Time</Label>
              <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} />
            </div>
          </div>

          {/* Weather Condition */}
          <div className="space-y-2">
            <Label htmlFor="weather" className="flex items-center"><CloudIcon className="mr-2 h-4 w-4 text-primary" />Weather Condition</Label>
            <Select value={weather} onValueChange={(value: WeatherCondition) => setWeather(value)}>
              <SelectTrigger id="weather">
                <SelectValue placeholder="Select weather" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {weatherConditions.map(condition => {
                  const Icon = weatherIcons[condition];
                  return (
                    <SelectItem key={condition} value={condition}>
                      <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4" />
                        {condition}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Atmospheric Effects */}
          <div className="space-y-2">
            <Label className="flex items-center"><SparklesIcon className="mr-2 h-4 w-4 text-primary" />Atmospheric Effects</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {atmosphericEffectsList.map(effect => (
                <div key={effect} className="flex items-center space-x-2 p-2 rounded-md border border-input hover:bg-accent/10 transition-colors">
                  <Checkbox
                    id={`effect-${effect}`}
                    checked={selectedAtmosphericEffects.includes(effect)}
                    onCheckedChange={() => handleAtmosphericEffectChange(effect)}
                  />
                  <Label htmlFor={`effect-${effect}`} className="text-sm font-normal cursor-pointer">
                    {effect}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Prompt */}
          <div className="space-y-2">
            <Label htmlFor="customPrompt" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 text-primary"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M12 18a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 12 9Zm0-5.5A1.5 1.5 0 1 0 12 5a1.5 1.5 0 0 0 0 1.5Z"/></svg>
              Custom Instructions / Prompt
            </Label>
            <div className="relative">
            <Textarea
              id="customPrompt"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="e.g., 'Impressionist painting style', 'Add a vintage car parked nearby', 'Heavy snowfall at twilight'"
              rows={3}
              className="pr-12"
            />
            <VoiceInputButton
                className="absolute right-2 top-2"
                onTranscript={handleVoiceTranscript}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
              />
            </div>
            <p className="text-xs text-muted-foreground">Use voice input or type your custom instructions.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
