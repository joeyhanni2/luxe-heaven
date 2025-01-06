import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Bath, Bed, MapPin, Square } from "lucide-react";
import Image from "next/image";

export default function PropertiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Find Your Perfect Property</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input placeholder="Search location..." />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="villa">Villa</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-500000">$0 - $500,000</SelectItem>
              <SelectItem value="500000-1000000">$500,000 - $1,000,000</SelectItem>
              <SelectItem value="1000000-2000000">$1,000,000 - $2,000,000</SelectItem>
              <SelectItem value="2000000+">$2,000,000+</SelectItem>
            </SelectContent>
          </Select>
          <Button>Search</Button>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative h-48">
              <Image
                src={`https://images.unsplash.com/photo-${1600585154340 + index}-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                alt="Property"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">Luxury Villa</h3>
                <span className="text-primary font-semibold">$1,250,000</span>
              </div>
              <p className="text-muted-foreground flex items-center mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                Beverly Hills, CA
              </p>
              <div className="flex justify-between text-muted-foreground mb-4">
                <span className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  4 Beds
                </span>
                <span className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  3 Baths
                </span>
                <span className="flex items-center">
                  <Square className="h-4 w-4 mr-1" />
                  2,500 sqft
                </span>
              </div>
              <Button className="w-full">View Details</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <div className="flex space-x-2">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">1</Button>
          <Button variant="default">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
}