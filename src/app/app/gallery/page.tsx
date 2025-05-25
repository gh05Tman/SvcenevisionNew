
import { GalleryView } from '@/components/gallery/GalleryView';

export default function GalleryPage() {
  return (
    <div className="container mx-auto py-2">
      <h1 className="text-3xl font-bold mb-8 font-montserrat">My Scene Gallery</h1>
      <GalleryView />
    </div>
  );
}
