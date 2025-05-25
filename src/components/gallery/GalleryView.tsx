
"use client";

import { useState, useEffect } from 'react';
import { SceneThumbnail } from './SceneThumbnail';
import type { Scene } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SearchIcon, ArrowDownUpIcon, LayoutGridIcon, ListIcon, InfoIcon } from 'lucide-react';

// Mock data fetching function - replace with actual Firestore call
const fetchScenesFromLocalStorage = (): Scene[] => {
  if (typeof window === 'undefined') return [];
  const scenes = localStorage.getItem('sceneVisionGallery');
  return scenes ? JSON.parse(scenes) : [];
};

const deleteSceneFromLocalStorage = (sceneId: string): Scene[] => {
    let scenes = fetchScenesFromLocalStorage();
    scenes = scenes.filter(s => s.id !== sceneId);
    localStorage.setItem('sceneVisionGallery', JSON.stringify(scenes));
    return scenes;
}

export function GalleryView() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt_desc'); // e.g. 'createdAt_desc', 'locationName_asc'
  const [layout, setLayout] = useState<'grid' | 'list'>('grid'); // For potential future layout toggle
  const { toast } = useToast();

  useEffect(() => {
    setScenes(fetchScenesFromLocalStorage());
  }, []);

  const handleViewScene = (scene: Scene) => {
    // Could open a modal with scene details or navigate to a scene page
    console.log("Viewing scene:", scene);
    toast({ title: "Viewing Scene", description: scene.locationName || "Untitled Scene" });
  };

  const handleShareScene = (scene: Scene) => {
    navigator.clipboard.writeText(scene.previewUrl)
      .then(() => toast({ title: "Link Copied!", description: "Preview URL copied to clipboard." }))
      .catch(() => toast({ title: "Copy Failed", description: "Could not copy link.", variant: "destructive" }));
  };

  const handleDeleteScene = (sceneId: string) => {
    const updatedScenes = deleteSceneFromLocalStorage(sceneId);
    setScenes(updatedScenes);
    toast({ title: "Scene Deleted", description: "Removed from your gallery." });
  };

  const handleEditScene = (scene: Scene) => {
    // Navigate to planner with scene parameters pre-filled
    console.log("Editing scene:", scene);
    toast({ title: "Editing Scene", description: `Populating planner for ${scene.locationName || "scene"}. (Not implemented)` });
    // Example: router.push(`/app?edit=${scene.id}`);
  };

  const filteredAndSortedScenes = scenes
    .filter(scene =>
      (scene.locationName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scene.customPrompt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      scene.weatherCondition.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'createdAt_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'createdAt_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'locationName_asc') return (a.locationName || '').localeCompare(b.locationName || '');
      if (sortBy === 'locationName_desc') return (b.locationName || '').localeCompare(a.locationName || '');
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 bg-card rounded-lg shadow">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search scenes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <ArrowDownUpIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="createdAt_desc">Newest First</SelectItem>
              <SelectItem value="createdAt_asc">Oldest First</SelectItem>
              <SelectItem value="locationName_asc">Name (A-Z)</SelectItem>
              <SelectItem value="locationName_desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          {/* Layout toggle example - can be expanded later
          <Button variant="outline" size="icon" onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}>
            {layout === 'grid' ? <ListIcon className="h-4 w-4" /> : <LayoutGridIcon className="h-4 w-4" />}
          </Button>
          */}
        </div>
      </div>

      {filteredAndSortedScenes.length === 0 ? (
         <div className="text-center py-12">
            <InfoIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold font-montserrat">No Scenes Found</h3>
            <p className="text-muted-foreground mt-1">
              {scenes.length > 0 ? "Try adjusting your search or filter." : "Start creating scenes to see them here!"}
            </p>
          </div>
      ) : (
        <div className={`grid gap-4 md:gap-6 ${layout === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredAndSortedScenes.map(scene => (
            <SceneThumbnail
                key={scene.id}
                scene={scene}
                onView={handleViewScene}
                onShare={handleShareScene}
                onDelete={handleDeleteScene}
                onEdit={handleEditScene}
            />
            ))}
        </div>
      )}
    </div>
  );
}
