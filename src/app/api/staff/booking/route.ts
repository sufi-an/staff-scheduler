import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("month");

  try {
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    const rangeStart = startOfMonth(targetDate);
    const rangeEnd = endOfMonth(targetDate);

    const staff = await prisma.staff.findMany({
      orderBy: { name: "asc" },
    });

    const shifts = await prisma.booking.findMany({
      where: {
        startTime: {
          gte: rangeStart,
          lte: rangeEnd,
        },
      },
    });

    return NextResponse.json({
      staff,
      shifts,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduler data" },
      { status: 500 }
    );
  }
}
