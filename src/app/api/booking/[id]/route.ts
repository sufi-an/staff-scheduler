import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET Single Booking
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { staff: true }
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// UPDATE Booking
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { title, staffId, startTime, endTime } = body;

    // Check if booking exists first
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id }
    });

    if (!existingBooking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    // Prepare data for overlap check
    // If new times are provided, use them; otherwise fall back to existing times
    const checkStart = startTime ? new Date(startTime) : existingBooking.startTime;
    const checkEnd = endTime ? new Date(endTime) : existingBooking.endTime;
    const checkStaffId = staffId || existingBooking.staffId;

    if (checkEnd <= checkStart) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    // OVERLAP CHECK (Exclude current booking ID)
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        staffId: checkStaffId,
        id: { not: params.id }, // IMPORTANT: Exclude the booking we are currently updating
        AND: [
          { startTime: { lt: checkEnd } },
          { endTime: { gt: checkStart } }
        ]
      }
    });

    if (conflictingBooking) {
      return NextResponse.json({ 
        error: "Update failed: Staff is already booked during this time.",
        conflict: conflictingBooking
      }, { status: 409 });
    }

    // Update
    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        title,
        staffId,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        // Update 'date' only if startTime changed
        date: startTime ? new Date(new Date(startTime).setHours(0,0,0,0)) : undefined, 
      },
    });

    return NextResponse.json(updatedBooking);

  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Error updating booking" }, { status: 500 });
  }
}

// DELETE Booking
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.booking.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting booking" }, { status: 500 });
  }
}