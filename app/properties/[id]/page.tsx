"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bath, Bed, MapPin, Square } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PropertyDetails({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleAction = (action: 'rent' | 'buy') => {
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }
    router.push(`/payment/${params.id}?action=${action}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Images */}
        <div className="space-y-4">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
              alt="Property"
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="relative h-24 rounded-lg overflow-hidden">
                <Image
                  src={`https://images.unsplash.com/photo-${1600585154340 + i}-be6161a56a0c`}
                  alt={`Property view ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Luxury Villa</h1>
              <p className="text-2xl font-semibold text-primary mt-2">$1,250,000</p>
              <p className="flex items-center text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                Beverly Hills, CA
              </p>
            </div>

            <div className="flex justify-between py-4 border-y">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>4 Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>3 Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>2,500 sqft</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">
                Luxurious villa featuring modern architecture, premium finishes, and stunning views.
                This property offers spacious living areas, a gourmet kitchen, and a private pool.
              </p>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" onClick={() => handleAction('rent')}>
                Rent Now
              </Button>
              <Button className="flex-1" onClick={() => handleAction('buy')}>
                Buy Now
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}