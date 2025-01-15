"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bath, Bed, MapPin, Square } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PropertyDetails({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      const res = await fetch(`/api/properties/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProperty(data);
      } else {
        console.error("Failed to fetch property");
      }
      setLoading(false);
    };

    fetchProperty();
  }, [params.id]);

  const handleAction = (action: 'rent' | 'buy') => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    router.push(`/payment/${params.id}?action=${action}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Loading state for images */}
          <div className="space-y-4">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <div className="grid grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Loading state for details card */}
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>

              <div className="flex justify-between py-4 border-y">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>

              <div>
                <Skeleton className="h-6 w-1/4 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>

              <Skeleton className="h-10 w-full" />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  const renderActionButton = () => {
    if (!property) return null;

    if (property.type === "RENT") {
      return (
        <Button 
          className="w-full" 
          onClick={() => handleAction('rent')}
          size="lg"
        >
          Rent Property
        </Button>
      );
    }

    if (property.type === "SALE") {
      return (
        <Button 
          className="w-full" 
          onClick={() => handleAction('buy')}
          size="lg"
        >
          Buy Property
        </Button>
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Property Images */}
        <div className="space-y-4">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={property.imageUrls[selectedImageIndex]}
              alt="Property"
              fill
              className="object-cover transition-all duration-300"
            />
          </div>
          <div className="grid grid-cols-5 gap-4">
            {property.imageUrls.map((url: string, index: number) => (
              <div
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`
                  relative h-20 rounded-lg overflow-hidden cursor-pointer 
                  transition-all duration-200 hover:opacity-80
                  ${selectedImageIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
              >
                <Image
                  src={url}
                  alt={`Property view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property Details Card */}
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <p className="text-2xl font-semibold text-primary mt-2">
                ${property.price.toLocaleString()}
              </p>
              <p className="flex items-center text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </p>
            </div>

            <div className="flex justify-between py-4 border-y">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.area} sqft</span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">
                {property.description}
              </p>
            </div>

            <div className="pt-4">
              {renderActionButton()}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}