import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: { status: "AVAILABLE" },
      include: { user: true },
    });
    return NextResponse.json(properties);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const property = await prisma.property.create({
      data: {
        ...data,
        userId: session.user.id,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}