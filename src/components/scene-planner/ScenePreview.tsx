
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadIcon, Share2Icon, ShuffleIcon, HeartIcon, InfoIcon } from 'lucide-react';
import { Scene, SceneParameters } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface ScenePreviewProps {
  scene: Scene | null;
  sceneParams?: SceneParameters; // The parameters used to generate this scene
  onSave?: (scene: Scene) => void;
  onShare?: (scene: Scene) => void;
  isLoading?: boolean;
}

export function ScenePreview({ scene, sceneParams, onSave, onShare, isLoading }: ScenePreviewProps) {
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonValue, setComparisonValue] = useState(50);

  if (isLoading) {
    return (
      <Card className="w-full shadow-xl animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mt-1"></div>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full bg-muted rounded-lg"></div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <div className="h-10 w-24 bg-muted rounded"></div>
          <div className="h-10 w-24 bg-muted rounded"></div>
        </CardFooter>
      </Card>
    );
  }

  if (!scene) {
    return (
      <Card className="w-full shadow-xl flex flex-col items-center justify-center min-h-[300px] border-dashed border-2">
        <InfoIcon className="w-16 h-16 text-muted-foreground mb-4" />
        <CardTitle className="text-xl font-montserrat">No Preview Generated</CardTitle>
        <CardDescription className="mt-1">Adjust parameters and generate a scene.</CardDescription>
      </Card>
    );
  }

  const { previewUrl, locationName, dateTime, weatherCondition, atmosphericEffects, customPrompt, sourceImageUrl } = scene;

  return (
    <Card className="w-full shadow-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-montserrat">{locationName || sceneParams?.location || 'Generated Scene'}</CardTitle>
        <CardDescription>
          {new Date(dateTime).toLocaleString()} - {weatherCondition}
          {atmosphericEffects && atmosphericEffects.length > 0 && ` - ${atmosphericEffects.join(', ')}`}
        </CardDescription>
        {customPrompt && (
          <Badge variant="secondary" className="mt-2 whitespace-normal text-left py-1 px-2">Custom: {customPrompt}</Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
          {showComparison && sourceImageUrl ? (
            <>
              <Image
                src={sourceImageUrl}
                alt="Source Street View"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                data-ai-hint="street view"
              />
              <div
                className="absolute inset-0 overflow-hidden rounded-lg"
                style={{ clipPath: `polygon(0 0, ${comparisonValue}% 0, ${comparisonValue}% 100%, 0 100%)` }}
              >
                <Image
                  src={previewUrl}
                  alt="Generated Scene Preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                  data-ai-hint="generated landscape"
                />
              </div>
            </>
          ) : (
            <Image
              src={previewUrl}
              alt="Generated Scene Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
              data-ai-hint="generated landscape nature"
            />
          )}
        </div>
        {sourceImageUrl && (
          <div className="mt-4 space-y-2">
             <div className="flex items-center justify-between">
                <Label htmlFor="comparison-slider">Compare with Street View</Label>
                <Button variant="outline" size="sm" onClick={() => setShowComparison(!showComparison)}>
                  {showComparison ? "Hide Comparison" : "Show Comparison"}
                </Button>
             </div>
            {showComparison && (
                <Slider
                id="comparison-slider"
                defaultValue={[50]}
                max={100}
                step={1}
                onValueChange={(value) => setComparisonValue(value[0])}
                className="my-2"
                />
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onShare?.(scene)} title="Share Scene">
            <Share2Icon className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" onClick={() => alert("Download not implemented")} title="Download Scene">
            <DownloadIcon className="mr-0 sm:mr-2 h-4 w-4" /> <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
        <Button onClick={() => onSave?.(scene)} className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity" title="Save to Gallery">
          <HeartIcon className="mr-2 h-4 w-4" /> Save to Gallery
        </Button>
      </CardFooter>
    </Card>
  );
}
