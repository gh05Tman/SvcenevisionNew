
import Image from 'next/image';
import { Card } from '@/components/ui/card';

export function MapPlaceholder() {
  return (
    <Card className="aspect-[16/9] w-full overflow-hidden rounded-lg shadow-lg relative bg-muted">
      <Image
        src="https://placehold.co/1200x675.png"
        alt="Map Placeholder"
        layout="fill"
        objectFit="cover"
        data-ai-hint="world map"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <p className="text-2xl font-semibold text-white/80">Interactive Map Area</p>
      </div>
    </Card>
  );
}
