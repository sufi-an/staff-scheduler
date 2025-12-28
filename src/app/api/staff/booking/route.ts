// src/app/api/staff/booking/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("month"); // Expects "2024-01-01"

  try {
    // 1. Determine Date Range (Default to current month if no param)
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const rangeStart = startOfMonth(targetDate);
    const rangeEnd = endOfMonth(targetDate);

    // 2. Fetch All Staff
    // We fetch staff first to ensure we render rows even if they have no shifts
    const staff = await prisma.staff.findMany({
      orderBy: { name: 'asc' }
    });

    // 3. Fetch Shifts for this Month
    // We fetch bookings that overlap with this month
    const shifts = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: rangeStart,
          lte: rangeEnd,
        },
      },
    });

    // 4. Return both as a combined object
    // This matches your frontend state structure perfectly
    return NextResponse.json({
      staff,
      shifts
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch scheduler data" }, { status: 500 });
  }
}