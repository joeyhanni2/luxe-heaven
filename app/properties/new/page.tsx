"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProperty() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
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
              <Input type="number" {...register("price")} required />
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
              <Input type="number" {...register("area")} required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <Select onValueChange={(value) => register("type").onChange({ target: { value } })}>
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
            <Input type="file" multiple accept="image/*" {...register("images")} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "List Property"}
          </Button>
        </form>
      </Card>
    </div>
  );
}