import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { intersend } from 'intersend';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, action, amount } = await request.json();
    
    // Get property and owner details
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { user: true }
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        amount,
        status: 'PENDING',
        type: action === 'rent' ? 'RENT' : 'PURCHASE',
        propertyId,
        userId: session.user.id
      }
    });

    // Process payment with Intersend
    const transfer = await intersend.transfer({
      amount,
      currency: 'USD',
      destination: property.user.email,
      description: `Payment for ${property.title}`
    });

    if (transfer.status === 'succeeded') {
      // Update payment status and property status
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' }
      });

      await prisma.property.update({
        where: { id: propertyId },
        data: { status: action === 'rent' ? 'RENTED' : 'SOLD' }
      });

      // Create notification for property owner
      await prisma.notification.create({
        data: {
          type: action === 'rent' ? 'RENT_REQUEST' : 'PURCHASE_REQUEST',
          message: `New ${action} payment received for ${property.title}`,
          userId: property.userId,
          propertyId
        }
      });

      return NextResponse.json({ success: true, payment });
    }

    return NextResponse.json({ error: "Payment failed" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      where: { userId: session.user.id },
      include: { property: true },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}