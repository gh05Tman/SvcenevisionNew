
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EyeIcon, Share2Icon, Trash2Icon, EditIcon } from 'lucide-react';
import type { Scene } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface SceneThumbnailProps {
  scene: Scene;
  onView: (scene: Scene) => void;
  onShare: (scene: Scene) => void;
  onDelete: (sceneId: string) => void;
  onEdit: (scene: Scene) => void;
}

export function SceneThumbnail({ scene, onView, onShare, onDelete, onEdit }: SceneThumbnailProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out group flex flex-col h-full">
      <CardHeader className="p-0 relative aspect-video">
        <Image
          src={scene.previewUrl || "https://placehold.co/400x225.png"}
          alt={scene.locationName || "Scene preview"}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
          data-ai-hint="landscape thumbnail"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <Button variant="secondary" size="sm" onClick={() => onView(scene)} className="opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                <EyeIcon className="mr-2 h-4 w-4" /> View
            </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-montserrat mb-1 truncate" title={scene.locationName || "Untitled Scene"}>
            {scene.locationName || "Untitled Scene"}
        </CardTitle>
        <p className="text-xs text-muted-foreground mb-2">
          {new Date(scene.createdAt).toLocaleDateString()} - {scene.weatherCondition}
        </p>
        {scene.customPrompt && (
          <Badge variant="outline" className="text-xs truncate block w-full text-left py-1 px-2" title={scene.customPrompt}>
            Custom: {scene.customPrompt}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t flex justify-end gap-1.5">
        <Button variant="ghost" size="icon" onClick={() => onEdit(scene)} title="Edit Scene">
          <EditIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onShare(scene)} title="Share Scene">
          <Share2Icon className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" title="Delete Scene">
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this scene
                from your gallery.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(scene.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
