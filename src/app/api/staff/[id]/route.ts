import { NextResponse } from 'next/server';
import  {prisma}  from '@/lib/prisma';
import { StaffStatus } from '@prisma/client';

// GET: Get single staff by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: params.id },
    //   include: { bookings: true } // Optional: include their schedule
    });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

// PATCH: Partial Update (only updates fields you send)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    
    // We update only the fields provided in the body
    const updatedStaff = await prisma.staff.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email,
        jobTitle: body.jobTitle,
        nationality: body.nationality,
        location: body.location,
        status: body.status as StaffStatus,
      },
    });

    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: 'Failed to update staff' }, { status: 500 });
  }
}

// DELETE: Remove staff
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.staff.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Staff deleted successfully' });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: 'Failed to delete staff' }, { status: 500 });
  }
}