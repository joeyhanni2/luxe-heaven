import { Card } from "@/components/ui/card";
import { Bath, Bed, MapPin, Square } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    imageUrls: string[];
    type: string;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/properties/${property.id}`}>
        <div className="relative h-48">
          <Image
            src={property.imageUrls[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"}
            alt={property.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold">{property.title}</h3>
            <span className="text-primary font-semibold">
              ${property.price.toLocaleString()}
              {property.type === 'RENT' && '/mo'}
            </span>
          </div>
          <p className="text-muted-foreground flex items-center mb-4">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </p>
          <div className="flex justify-between text-muted-foreground mb-4">
            <span className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms} Beds
            </span>
            <span className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms} Baths
            </span>
            <span className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {property.area} sqft
            </span>
          </div>
          <Button className="w-full">View Details</Button>
        </div>
      </Link>
    </Card>
  );
}