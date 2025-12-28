import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your prisma client

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get("staffId");
  const dateStr = searchParams.get("date"); // Optional: Filter by specific date

  try {
    const whereClause: any = {};
    if (staffId) whereClause.staffId = staffId;
    
    // Optional: Filter by Date (ignoring time)
    if (dateStr) {
      const targetDate = new Date(dateStr);
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate() + 1);

      whereClause.startTime = {
        gte: targetDate,
        lt: nextDay,
      };
    }

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        staff: true, // Include staff details if needed
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, staffId, startTime, endTime } = body;

    console.log(startTime, endTime);
    
    // 1. Basic Validation
    if (!title || !staffId || !startTime || !endTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newStart = new Date(startTime);
    const newEnd = new Date(endTime);

    // 2. Logic Check: End time must be after Start time
    if (newEnd <= newStart) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    // 3. OVERLAP CHECK
    // Find any booking for this staff that overlaps with the requested time
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        staffId: staffId,
        AND: [
          { startTime: { lt: newEnd } }, // Existing starts before New ends
          { endTime: { gt: newStart } }  // Existing ends after New starts
        ]
      }
    });

    if (conflictingBooking) {
      return NextResponse.json({ 
        error: "Staff is already booked during this time.",
        conflict: conflictingBooking 
      }, { status: 409 }); // 409 Conflict
    }

    // 4. Create Booking
    // We derive the 'date' field from startTime automatically
    console.log(newStart, newEnd);
    
    const booking = await prisma.booking.create({
      data: {
        title,
        staffId,
        startTime: newStart,
        endTime: newEnd,
        date: new Date(newStart.setHours(0, 0, 0, 0)), // Normalize to midnight for the 'date' column
      },
    });

    return NextResponse.json(booking, { status: 201 });

  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Error creating booking" }, { status: 500 });
  }
}