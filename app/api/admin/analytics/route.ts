import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalUsers,
      totalProperties,
      totalPayments,
      propertiesByType,
      propertiesByLocation,
      recentTransactions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.payment.count(),
      prisma.property.groupBy({
        by: ['type'],
        _count: true,
      }),
      prisma.property.groupBy({
        by: ['location'],
        _count: true,
      }),
      prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          property: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalProperties,
      totalPayments,
      propertiesByType,
      propertiesByLocation,
      recentTransactions,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}