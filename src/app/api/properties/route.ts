import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all properties from the database
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      // You can select specific fields to hide sensitive data if needed
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        size: true,
        propertyType: true,
        address: true,
        latitude: true,
        longitude: true,
        images: true,
        createdAt: true,
      }
    });

    // Return the data as JSON with a 200 OK status
    return NextResponse.json({
      success: true,
      count: properties.length,
      data: properties
    }, { status: 200 });

  } catch (error) {
    console.error("REST API Error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch properties"
    }, { status: 500 });
  }
}
