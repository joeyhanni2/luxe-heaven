import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Building2 className="h-12 w-12 text-primary" />
          <span className="text-3xl font-bold">LuxeHaven</span>
        </div>
        
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The page you are looking for does not exist or has been moved. 
          Let us get you back on track.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/properties">Browse Properties</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}