"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function NewProperty() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { register, handleSubmit, setValue } = useForm();

  const uploadImages = async (files: File[]) => {
    const uploadedUrls = [];
    
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (res.ok) {
        const data = await res.json();
        uploadedUrls.push(data.secure_url);
      }
    }
    
    return uploadedUrls;
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Upload images first
      const imageUrls = await uploadImages(selectedImages);
      
      // Create property with image URLs
      const propertyData = {
        ...data,
        imageUrls,
        price: parseFloat(data.price),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        area: parseFloat(data.area),
        status: "AVAILABLE"
      };

      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });
      
      if (!res.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create property",
        });
        throw new Error('Failed to create property');
      }

      toast({
        title: "Success",
        description: "Property created successfully",
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
    }
    setLoading(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">List a New Property</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input {...register("title")} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea {...register("description")} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <Input type="number" step="0.01" {...register("price")} required />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input {...register("location")} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <Input type="number" {...register("bedrooms")} required />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Bathrooms</label>
              <Input type="number" {...register("bathrooms")} required />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Area (sqft)</label>
              <Input type="number" step="0.01" {...register("area")} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <Select onValueChange={(value) => setValue("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RENT">For Rent</SelectItem>
                <SelectItem value="SALE">For Sale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Images</label>
            <Input 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={handleImageChange}
              required
            />
            <p className="text-sm text-muted-foreground mt-1">
              You can upload multiple images
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imagePreviews.map((src, index) => (
                <Image 
                  key={index} 
                  src={src} 
                  alt={`Preview ${index}`} 
                  width={300} 
                  height={128} 
                  className="w-full h-32 object-cover" 
                />
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "List Property"}
          </Button>
        </form>
      </Card>
      <Toaster />
    </div>
  );
}