import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params; 

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { staff: true }
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params; 
    const body = await request.json();
    const { title, staffId, startTime, endTime } = body;

    // Check if booking exists first
    const existingBooking = await prisma.booking.findUnique({
      where: { id }
    });

    if (!existingBooking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

    const checkStart = startTime ? new Date(startTime) : existingBooking.startTime;
    const checkEnd = endTime ? new Date(endTime) : existingBooking.endTime;
    const checkStaffId = staffId || existingBooking.staffId;

    if (checkEnd <= checkStart) {
      return NextResponse.json({ error: "End time must be after start time" }, { status: 400 });
    }

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        staffId: checkStaffId,
        id: { not: id }, 
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

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        title,
        staffId,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        date: startTime ? new Date(new Date(startTime).setHours(0,0,0,0)) : undefined, 
      },
    });

    return NextResponse.json(updatedBooking);

  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Error updating booking" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params; 

    await prisma.booking.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting booking" }, { status: 500 });
  }
}