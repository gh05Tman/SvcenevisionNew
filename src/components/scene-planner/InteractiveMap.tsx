
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircleIcon } from 'lucide-react';

const MAP_DEFAULT_CENTER = { lat: 48.8584, lng: 2.2945 }; // Eiffel Tower
const MAP_DEFAULT_ZOOM = 15;

interface InteractiveMapProps {
  // In the future, we can add props for center, zoom, markers, onLocationSelect, etc.
}

export function InteractiveMap({}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Flag to check if component is still mounted

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      console.error('Google Maps API key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file.');
      if (isMounted) {
        setErrorMessage('Map configuration error: API key is missing.');
        setStatus('error');
      }
      return;
    }

    const loader = new Loader({
      apiKey: apiKey,
      version: 'weekly',
      libraries: ['places', 'marker'],
    });

    let mapInstance: google.maps.Map | null = null;

    loader.load()
      .then((google) => {
        if (!isMounted) {
          return; // Component was unmounted before loader finished
        }

        if (mapRef.current) {
          mapInstance = new google.maps.Map(mapRef.current, {
            center: MAP_DEFAULT_CENTER,
            zoom: MAP_DEFAULT_ZOOM,
            mapId: 'SCENEVISION_MAP_ID',
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          });
          setMap(mapInstance);
          setStatus('loaded');

           new google.maps.marker.AdvancedMarkerElement({
             map: mapInstance,
             position: MAP_DEFAULT_CENTER,
             title: 'Default Location',
           });

        } else {
          // Instead of throwing an error, log it and set component state to error
          console.error('InteractiveMap: mapRef.current is null when Google Maps API loaded. The map container div was not found.');
          setErrorMessage('Map container div not found during initialization.');
          setStatus('error');
        }
      })
      .catch((error) => {
        if (!isMounted) {
          return; // Component was unmounted during catch
        }
        console.error('Error loading Google Maps:', error);
        let specificMessage = 'Could not load map. Please check your internet connection and API key setup.';
        if (error.message.includes('ApiNotActivatedMapError') || error.message.includes('InvalidKeyMapError')) {
            specificMessage = 'Map loading failed. Please check your API key and ensure the Maps JavaScript API is enabled.';
        } else if (error.message.includes('RefererNotAllowedMapError')) {
            specificMessage = 'Map loading failed. The current URL is not authorized in your API key settings.';
        }
        setErrorMessage(specificMessage);
        setStatus('error');
      });
      
      return () => {
        isMounted = false;
        // Optional: Cleanup map instance if necessary, e.g. mapInstance?.unbindAll();
        // For Google Maps, removing the DOM element is often sufficient for basic maps.
      };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

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
