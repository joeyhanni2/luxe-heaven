"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Payment({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: params.id,
          action,
        }),
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
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">
          {action === 'rent' ? 'Rent Property' : 'Purchase Property'}
        </h1>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Card Number</label>
            <Input placeholder="4242 4242 4242 4242" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date</label>
              <Input placeholder="MM/YY" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">CVC</label>
              <Input placeholder="123" required />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : `Pay Now`}
          </Button>
        </form>
      </Card>
    </div>
  );
}