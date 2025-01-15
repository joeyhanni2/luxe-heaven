"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Plus, Pencil, Trash2, ExternalLink, Building2, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import PropertyCard from "@/components/property-card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NoDataState } from "@/components/NoDataState";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster"

interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrls: string[];
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export default function Dashboard() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [rentedProperties, setRentedProperties] = useState<Property[]>([]);
  const [purchasedProperties, setPurchasedProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    
    const headers = {
      'Content-Type': 'application/json'
    };
  
    // Fetch user's properties
    fetch(`/api/properties/user`, { headers })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Failed to fetch properties');
        }
        return res.json();
      })
      .then(data => {
        console.log('User properties:', data); // Debug log
        setProperties(data);
      })
      .catch(error => {
        console.error('Error fetching properties:', error);
        setProperties([]);
      });
  
    // Fetch rented properties
    fetch(`/api/properties/rented`, { headers })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Failed to fetch rented properties');
        }
        return res.json();
      })
      .then(data => {
        console.log('Rented properties:', data); // Debug log
        setRentedProperties(data);
      })
      .catch(error => {
        console.error('Error fetching rented properties:', error);
        setRentedProperties([]);
      });
  
    // Fetch purchased properties
    fetch(`/api/properties/purchased`, { headers })
      .then(async res => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Failed to fetch purchased properties');
        }
        return res.json();
      })
      .then(data => {
        console.log('Purchased properties:', data); // Debug log
        setPurchasedProperties(data);
      })
      .catch(error => {
        console.error('Error fetching purchased properties:', error);
        setPurchasedProperties([]);
      });
  }, [session]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProperties(properties.filter(p => p.id !== id));
        setIsDeleteDialogOpen(false);
        toast({
          variant: "default",
          title: "Success",
          description: "Property deleted successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete property",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedProperty) return;

    try {
      const res = await fetch(`/api/properties/${selectedProperty.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedProperty),
      });

      if (res.ok) {
        const updatedProperty = await res.json();
        setProperties(properties.map(p => p.id === updatedProperty.id ? updatedProperty : p));
        setIsEditModalOpen(false);
        toast({
          variant: "default",
          title: "Success",
          description: "Property updated successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update property",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    }
  };

  const totalEarnings = properties.reduce((acc, p) => {
    if (p.status !== 'AVAILABLE') {
      return acc + p.price;
    }
    return acc;
  }, 0);

  const activeListings = properties.filter(p => p.status === 'AVAILABLE').length;
  const soldProperties = properties.filter(p => p.status === 'SOLD').length;
  const rentedOutProperties = properties.filter(p => p.status === 'RENTED').length;

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

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Properties</h3>
          <p className="text-3xl font-bold">{properties.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Active Listings</h3>
          <p className="text-3xl font-bold">{activeListings}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Properties Sold/Rented</h3>
          <p className="text-3xl font-bold">{soldProperties + rentedOutProperties}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Total Earnings</h3>
          <p className="text-3xl font-bold">${totalEarnings.toLocaleString()}</p>
        </Card>
      </div>

      {/* Tabs for different property views */}
      <Tabs defaultValue="my-properties" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-properties">My Properties</TabsTrigger>
          <TabsTrigger value="rented">Rented Properties</TabsTrigger>
          <TabsTrigger value="purchased">Purchased Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="my-properties">
          {properties.length === 0 ? (
            <Card className="p-6">
              <NoDataState
                icon={Home}
                title="No Properties Listed"
                description="You haven't listed any properties yet. Click 'List New Property' to get started."
              />
            </Card>
          ) : (
            <Card className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>{property.title}</TableCell>
                      <TableCell>${property.price.toLocaleString()}</TableCell>
                      <TableCell>{property.location}</TableCell>
                      <TableCell>{property.type}</TableCell>
                      <TableCell>{property.status}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500"
                            onClick={() => {
                              setSelectedProperty(property);
                              setIsModalOpen(true);
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-500"
                            onClick={() => {
                              setSelectedProperty(property);
                              setIsEditModalOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500"
                            onClick={() => {
                              setSelectedProperty(property);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rented">
          {rentedProperties.length === 0 ? (
            <Card className="p-6">
              <NoDataState
                icon={Building2}
                title="No Rented Properties"
                description="You haven't rented any properties yet."
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rentedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchased">
          {purchasedProperties.length === 0 ? (
            <Card className="p-6">
              <NoDataState
                icon={ShoppingBag}
                title="No Purchased Properties"
                description="You haven't purchased any properties yet."
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {purchasedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Property Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedProperty?.title}</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                {selectedProperty.imageUrls?.[0] && (
                  <Image
                    src={selectedProperty.imageUrls[0]}
                    alt={selectedProperty.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-2xl font-bold">${selectedProperty.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p>{selectedProperty.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Details</p>
                  <p>{selectedProperty.bedrooms} beds • {selectedProperty.bathrooms} baths • {selectedProperty.area} sqft</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p>{selectedProperty.status}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Description</p>
                <p className="text-muted-foreground">{selectedProperty.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Property Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <form onSubmit={handleEdit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Property Title</label>
                <Input
                  value={selectedProperty.title}
                  onChange={(e) => setSelectedProperty({ ...selectedProperty, title: e.target.value })}
                  placeholder="Enter property title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Description</label>
                <Textarea
                  value={selectedProperty.description}
                  onChange={(e) => setSelectedProperty({ ...selectedProperty, description: e.target.value })}
                  placeholder="Enter detailed description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($)</label>
                  <Input
                    type="number"
                    value={selectedProperty.price}
                    onChange={(e) => setSelectedProperty({ ...selectedProperty, price: parseFloat(e.target.value) })}
                    placeholder="Enter price"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Property Location</label>
                  <Input
                    value={selectedProperty.location}
                    onChange={(e) => setSelectedProperty({ ...selectedProperty, location: e.target.value })}
                    placeholder="Enter location"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Bedrooms</label>
                  <Input
                    type="number"
                    value={selectedProperty.bedrooms}
                    onChange={(e) => setSelectedProperty({ ...selectedProperty, bedrooms: parseInt(e.target.value) })}
                    placeholder="Bedrooms"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Number of Bathrooms</label>
                  <Input
                    type="number"
                    value={selectedProperty.bathrooms}
                    onChange={(e) => setSelectedProperty({ ...selectedProperty, bathrooms: parseInt(e.target.value) })}
                    placeholder="Bathrooms"
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Property Area (sqft)</label>
                  <Input
                    type="number"
                    value={selectedProperty.area}
                    onChange={(e) => setSelectedProperty({ ...selectedProperty, area: parseFloat(e.target.value) })}
                    placeholder="Enter area"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <Select 
                  value={selectedProperty.type} 
                  onValueChange={(value) => setSelectedProperty({ ...selectedProperty, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RENT">For Rent</SelectItem>
                    <SelectItem value="SALE">For Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">Save Changes</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the property
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedProperty && handleDelete(selectedProperty.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster />
    </div>
  );
}