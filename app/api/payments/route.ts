import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, action } = await request.json();
    
    // Update property status
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: { status: action === 'rent' ? 'RENTED' : 'SOLD' },
    });

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}