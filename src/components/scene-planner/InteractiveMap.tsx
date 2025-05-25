
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircleIcon, WifiOffIcon } from 'lucide-react';

const MAP_DEFAULT_CENTER = { lat: 48.8584, lng: 2.2945 }; // Eiffel Tower
const MAP_DEFAULT_ZOOM = 15;
const MAP_WORLD_ZOOM = 3;

interface InteractiveMapProps {
  // In the future, we can add props for center, zoom, markers, onLocationSelect, etc.
}

export function InteractiveMap({}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file.');
      setErrorMessage('Map configuration error: API key is missing.');
      setStatus('error');
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'marker'], // 'places' for future search, 'marker' for pins
    });

    let mapInstance: google.maps.Map | null = null;

    loader.load()
      .then((google) => {
        if (mapRef.current) {
          mapInstance = new google.maps.Map(mapRef.current, {
            center: MAP_DEFAULT_CENTER,
            zoom: MAP_DEFAULT_ZOOM,
            mapId: 'SCENEVISION_MAP_ID', // Optional: for cloud-based map styling
            streetViewControl: false, // Disablepegman
            mapTypeControl: false, // Disable map/satellite toggle for simplicity for now
            fullscreenControl: false, // Disable fullscreen
          });
          setMap(mapInstance);
          setStatus('loaded');

          // Example: Add a marker at the default center
           new google.maps.marker.AdvancedMarkerElement({
             map: mapInstance,
             position: MAP_DEFAULT_CENTER,
             title: 'Default Location',
           });

        } else {
            throw new Error('Map container div not found.');
        }
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
        if (error.message.includes('ApiNotActivatedMapError') || error.message.includes('InvalidKeyMapError')) {
            setErrorMessage('Map loading failed. Please check your API key and ensure the Maps JavaScript API is enabled.');
        } else if (error.message.includes('RefererNotAllowedMapError')) {
            setErrorMessage('Map loading failed. The current URL is not authorized in your API key settings.');
        } else {
            setErrorMessage('Could not load map. Please check your internet connection and API key setup.');
        }
        setStatus('error');
      });
      
      return () => {
        // Optional: Cleanup map instance if component unmounts, though usually not strictly necessary
        // if (mapInstance) {
        //   // unbind all listeners, remove all markers, etc.
        // }
      };
  }, []);

  if (status === 'loading') {
    return (
      <Card className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Skeleton className="h-8 w-8 rounded-full" />
          <p>Loading Map...</p>
        </div>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg bg-destructive/10 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircleIcon className="h-12 w-12 text-destructive mb-3" />
        <h3 className="text-lg font-semibold text-destructive-foreground">Map Error</h3>
        <p className="text-sm text-destructive-foreground/80">{errorMessage || 'An unknown error occurred while loading the map.'}</p>
        <p className="text-xs text-destructive-foreground/60 mt-2">
            Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in your `.env` file and that the Maps JavaScript API is enabled in your Google Cloud project. Also check website restrictions for your API key.
        </p>
      </Card>
    );
  }

  return (
    <Card className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </Card>
  );
}
