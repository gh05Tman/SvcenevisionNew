
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MountainIcon } from 'lucide-react'; // Using Mountain as a generic logo icon

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-slate-900 text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-md backdrop-blur-sm bg-background/30">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <MountainIcon className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-bold font-montserrat">SceneVision</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/app" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            App
          </Link>
          <Link href="/auth/signin" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Sign In
          </Link>
          <Button asChild>
            <Link href="/auth/signup" prefetch={false}>Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-purple-400">
                    Visualize Any Scene, Anytime, Anywhere
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    SceneVision brings your imagination to life with AI-powered photorealistic previews. Set location, time, weather, and let us craft the perfect shot.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild className="shadow-lg transform hover:scale-105 transition-transform">
                    <Link href="/app" prefetch={false}>
                      Start Creating
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="shadow-lg transform hover:scale-105 transition-transform">
                    <Link href="#features" prefetch={false}>
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://placehold.co/600x400.png"
                data-ai-hint="futuristic landscape"
                width="600"
                height="400"
                alt="Hero Scene"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-2xl"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-montserrat">Craft Your Vision with Precision</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  SceneVision offers powerful tools to generate stunningly realistic scenes, tailored to your exact specifications.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none pt-12">
              <div className="grid gap-1 p-4 rounded-lg bg-card shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold font-montserrat text-primary">Dynamic Parameters</h3>
                <p className="text-sm text-muted-foreground">Set location, date, time, and weather conditions with intuitive controls.</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg bg-card shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold font-montserrat text-primary">AI-Powered Previews</h3>
                <p className="text-sm text-muted-foreground">Leverage generative AI for photorealistic scene generation.</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg bg-card shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold font-montserrat text-primary">Custom Prompts</h3>
                <p className="text-sm text-muted-foreground">Augment scenes with detailed text instructions for personalized results.</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg bg-card shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold font-montserrat text-primary">Voice Input</h3>
                <p className="text-sm text-muted-foreground">Specify parameters and prompts using natural voice commands.</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg bg-card shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold font-montserrat text-primary">Scene Gallery</h3>
                <p className="text-sm text-muted-foreground">Save, manage, and revisit your favorite generated scenes.</p>
              </div>
              <div className="grid gap-1 p-4 rounded-lg bg-card shadow-md hover:shadow-xl transition-shadow">
                <h3 className="text-lg font-bold font-montserrat text-primary">Share & Compare</h3>
                <p className="text-sm text-muted-foreground">Easily share your creations and compare with source imagery.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-border/50 bg-background/30">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SceneVision. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
