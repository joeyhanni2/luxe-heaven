import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { propertyId, action, phoneNumber } = body;

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { user: true }
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Skip actual fund transfer for now
    const payment = await prisma.payment.create({
      data: {
        amount: property.price,
        status: 'PENDING',
        type: action.toUpperCase(),
        propertyId,
        userId: session.user.id,
      }
    });

    return NextResponse.json({ 
      success: true, 
      payment,
      checkoutUrl: "https://example.com/checkout"
    });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}