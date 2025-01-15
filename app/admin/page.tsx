"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Home,
  CreditCard,
  TrendingUp,
  Search,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LabelList,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Analytics, Property, User } from "@/types/admin";
import Image from 'next/image';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedItem, setSelectedItem] = useState<User | Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [propertyFilter, setPropertyFilter] = useState({
    type: '',
    location: '',
    bedrooms: '',
  });

  useEffect(() => {
    // Fetch analytics
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data));

    // Fetch users
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => setUsers(data));

    // Fetch properties
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data));
  }, []);

  const handleDelete = async (type: 'user' | 'property', id: string) => {
    try {
      const endpoint = type === 'user' ? '/api/admin/users' : `/api/properties/${id}`;
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id }),
      });

      if (res.ok) {
        if (type === 'user') {
          setUsers(users.filter(user => user.id !== id));
        } else {
          setProperties(properties.filter(prop => prop.id !== id));
        }
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const filteredProperties = properties.filter((property: Property) => {
    return (
      (!propertyFilter.type || property.type === propertyFilter.type) &&
      (!propertyFilter.location || property.location.includes(propertyFilter.location)) &&
      (!propertyFilter.bedrooms || property.bedrooms === parseInt(propertyFilter.bedrooms))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Total Users</h3>
              <p className="text-3xl font-bold">{analytics?.totalUsers}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Home className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Properties</h3>
              <p className="text-3xl font-bold">{analytics?.totalProperties}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Transactions</h3>
              <p className="text-3xl font-bold">{analytics?.totalPayments}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Revenue</h3>
              <p className="text-3xl font-bold">
                ${analytics?.recentTransactions?.reduce((acc, t) => acc + t.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Properties by Type Chart */}
        <Card className="p-6 shadow-lg rounded-lg bg-white">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Properties by Type</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.propertiesByType} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="type" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
                <Bar dataKey="_count" fill="#4F8EF7" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Properties by Location Chart */}
        <Card className="p-6 shadow-lg rounded-lg bg-white">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Properties by Location</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.propertiesByLocation}
                  dataKey="_count"
                  nameKey="location"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#4F8EF7"
                  paddingAngle={5}
                  stroke="none"
                  label
                >
                  {analytics?.propertiesByLocation?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tabs for Users and Properties */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="p-6">
            <div className="mb-4">
              <Input
                placeholder="Search users..."
                className="max-w-sm"
                onChange={(e) => {
                  // Implement user search
                }}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user._count.properties}</TableCell>
                    <TableCell>{user._count.payments}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(user); // Correct reference
                            setIsModalOpen(true);
                          }}
                        >
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                        </Button>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Implement edit user
                          }}
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(user); // Correct reference
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Input
                placeholder="Search by location..."
                onChange={(e) => setPropertyFilter({
                  ...propertyFilter,
                  location: e.target.value
                })}
                value={propertyFilter.location}
                aria-label="Search by location"
              />
              <Select
                defaultValue="all"
                onValueChange={(value) => setPropertyFilter({
                  ...propertyFilter,
                  type: value === 'all' ? '' : value
                })}
                aria-label="Select property type"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="RENT">For Rent</SelectItem>
                  <SelectItem value="SALE">For Sale</SelectItem>
                </SelectContent>
              </Select>
              <Select
                defaultValue="all"
                onValueChange={(value) => setPropertyFilter({
                  ...propertyFilter,
                  bedrooms: value === 'all' ? '' : value
                })}
                aria-label="Select number of bedrooms"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bedrooms</SelectItem>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                {filteredProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>${property.price.toLocaleString()}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>{property.status}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* View Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(property);
                            setIsModalOpen(true);
                          }}
                        >
                          <ExternalLink className="h-4 w-4 text-blue-600" />
                        </Button>

                        {/* Edit Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Implement edit property
                          }}
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(property);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {(selectedItem as Property)?.title || (selectedItem as User)?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {(selectedItem as Property)?.title ? (
              // Property details
              <>
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  {(selectedItem as Property).imageUrls?.[0] && (
                    <Image
                      src={(selectedItem as Property).imageUrls[0]}
                      alt={(selectedItem as Property).title}
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Price</p>
                    <p className="text-2xl font-bold">${(selectedItem as Property).price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p>{(selectedItem as Property).location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Details</p>
                    <p>{(selectedItem as Property).bedrooms} beds • {(selectedItem as Property).bathrooms} baths • {(selectedItem as Property).area} sqft</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p>{(selectedItem as Property).status}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-muted-foreground">{(selectedItem as Property).description}</p>
                </div>
              </>
            ) : (
              // User details
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p>{(selectedItem as User)?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Properties</p>
                  <p>{(selectedItem as User)?._count?.properties} properties</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Transactions</p>
                  <p>{(selectedItem as User)?._count?.payments} transactions</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              {(selectedItem as Property)?.title ? ' property' : ' user'} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                if (selectedItem?.id) {
                  handleDelete(
                    (selectedItem as Property)?.title ? 'property' : 'user',
                    selectedItem.id
                  );
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}