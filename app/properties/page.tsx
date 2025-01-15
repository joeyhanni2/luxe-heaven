"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bath, Bed, MapPin, Square } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  type: string;
  imageUrls: string[];
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: "",
    priceRange: "",
    bedrooms: ""
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProperties = async () => {
      const res = await fetch("/api/properties");
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);

  const filteredProperties = (type: string) => {
    return properties
      .filter(p => p.type === type)
      .filter(p => {
        if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
        
        if (filters.bedrooms && p.bedrooms !== parseInt(filters.bedrooms)) return false;
        
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          if (p.price < min || (max && p.price > max)) return false;
        }
        
        return true;
      });
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        <Image
          src={property.imageUrls[0]}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold truncate">{property.title}</h3>
          <span className="text-primary font-semibold">${property.price.toLocaleString()}</span>
        </div>
        <p className="text-muted-foreground flex items-center mb-4 truncate">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          {property.location}
        </p>
        <div className="flex justify-between text-muted-foreground mb-4">
          <span className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms}
          </span>
          <span className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms}
          </span>
          <span className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.area} sqft
          </span>
        </div>
        <Button 
          className="w-full" 
          onClick={() => router.push(`/properties/${property.id}`)}
        >
          View Details
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Property</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input 
            placeholder="Search location..." 
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
          <Select 
            value={filters.bedrooms}
            onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
                </SelectItem>
              ))}
              <SelectItem value="6">6+ Bedrooms</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={filters.priceRange}
            onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1000">Up to $1,000</SelectItem>
              <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
              <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
              <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
              <SelectItem value="5000">$5,000+</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={() => setFilters({ location: "", priceRange: "", bedrooms: "" })}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Properties Tabs */}
      <Tabs defaultValue="rent" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="rent">For Rent</TabsTrigger>
          <TabsTrigger value="sale">For Sale</TabsTrigger>
        </TabsList>

        <TabsContent value="rent" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10" />
                  </div>
                </Card>
              ))
            ) : (
              filteredProperties("RENT").map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="sale" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10" />
                  </div>
                </Card>
              ))
            ) : (
              filteredProperties("SALE").map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}