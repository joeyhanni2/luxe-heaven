"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Building2, Home, Plus } from "lucide-react";
import Link from "next/link";
import PropertyCard from "@/components/property-card";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch user's properties
    fetch('/api/properties/user')
      .then(res => res.json())
      .then(data => setProperties(data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        <Button asChild>
          <Link href="/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            List New Property
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Listed Properties</h3>
          <p className="text-3xl font-bold">{properties.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Active Listings</h3>
          <p className="text-3xl font-bold">
            {properties.filter(p => p.status === 'AVAILABLE').length}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Value</h3>
          <p className="text-3xl font-bold">
            ${properties.reduce((acc, p) => acc + p.price, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mb-4">My Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}