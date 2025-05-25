
import Link from 'next/link';
import { MountainIcon } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-slate-900 p-4">
       <Link href="/" className="flex items-center justify-center mb-8" prefetch={false}>
          <MountainIcon className="h-10 w-10 text-primary" />
          <span className="ml-3 text-3xl font-bold font-montserrat text-foreground">SceneVision</span>
        </Link>
      {children}
    </div>
  );
}
