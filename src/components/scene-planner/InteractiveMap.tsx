
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircleIcon } from 'lucide-react';

const MAP_DEFAULT_CENTER = { lat: 48.8584, lng: 2.2945 }; // Eiffel Tower
const MAP_DEFAULT_ZOOM = 15;

type MapStatus = 'loading' | 'scriptReady' | 'mapInitialized' | 'error';

export function InteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [status, setStatus] = useState<MapStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Effect to load the Google Maps script
  useEffect(() => {
    let isMounted = true;

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

    // Initial status is 'loading', show Skeleton.
    // When loader finishes, set status to 'scriptReady'.
    loader.load()
      .then(() => {
        if (isMounted) {
          setStatus('scriptReady');
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error('Error loading Google Maps script:', error);
          let specificMessage = 'Could not load map script. Please check your internet connection and API key setup.';
          if (error.message.includes('ApiNotActivatedMapError') || error.message.includes('InvalidKeyMapError')) {
            specificMessage = 'Map loading failed. Please check your API key and ensure the Maps JavaScript API is enabled.';
          } else if (error.message.includes('RefererNotAllowedMapError')) {
            specificMessage = 'Map loading failed. The current URL is not authorized in your API key settings.';
          }
          setErrorMessage(specificMessage);
          setStatus('error');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []); // Runs once on mount

  // Effect to initialize the map once the script is ready and the mapRef div is available
  useEffect(() => {
    if (status === 'scriptReady' && mapRef.current) {
      try {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: MAP_DEFAULT_CENTER,
          zoom: MAP_DEFAULT_ZOOM,
          mapId: 'SCENEVISION_MAP_ID', // Ensure this mapId is configured in GCP if using advanced markers/styling
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });
        setMap(mapInstance);

        new google.maps.marker.AdvancedMarkerElement({
          map: mapInstance,
          position: MAP_DEFAULT_CENTER,
          title: 'Default Location',
        });
        setStatus('mapInitialized');
      } catch (initError) {
        console.error('Error initializing Google Map instance:', initError);
        setErrorMessage('Failed to initialize map instance.');
        setStatus('error');
      }
    } else if (status === 'scriptReady' && !mapRef.current) {
      // This case should ideally not be hit if React's render lifecycle behaves as expected
      // after setStatus('scriptReady')
      console.error('InteractiveMap: mapRef.current is null when status is "scriptReady". This implies the map div was not rendered or ref not attached in time.');
      setErrorMessage('Map container div was not ready for initialization.');
      setStatus('error');
    }
  }, [status]); // Runs when status changes

  if (status === 'loading') {
    return (
      <Card className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Skeleton className="h-8 w-8 rounded-full" />
          <p>Loading Map Script...</p>
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
        {errorMessage && errorMessage.includes("API key") && (
          <p className="text-xs text-destructive-foreground/60 mt-2">
            Ensure `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set in your `.env` file and that the Maps JavaScript API is enabled in your Google Cloud project. Also check website/API restrictions for your key.
          </p>
        )}
      </Card>
    );
  }

  // If status is 'scriptReady' or 'mapInitialized', render the map container.
  // The map object will be attached by the second useEffect.
  return (
    <Card className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
      {status === 'scriptReady' && ( // Show "Initializing map..." briefly after script loads before map object is ready
        <div className="absolute inset-0 flex items-center justify-center bg-background/30 pointer-events-none">
            <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 bg-background/80 rounded-md">
                <Skeleton className="h-8 w-8 rounded-full animate-spin" />
                <p>Initializing Map...</p>
            </div>
        </div>
      )}
    </Card>
  );
}
