import { NextResponse } from 'next/server';
// 1. FIX IMPORT: Use curly braces {} for named export
import { prisma } from '@/lib/prisma'; 
import { StaffStatus } from '@prisma/client'; 

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // The variable here matches your JSON payload (jobTitle)
    const { name, email, jobTitle, nationality, location, status } = body;

    // Basic validation
    if (!name || !email || !nationality || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newStaff = await prisma.staff.create({
      data: {
        name,
        email,
        jobTitle: jobTitle, 
        nationality,
        location,
        status: status as StaffStatus || undefined,
        // color: '#' + Math.floor(Math.random()*16777215).toString(16),
      },
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error: any) {
    // 3. BETTER DEBUGGING: Log the actual error object to your terminal
    console.error("Create Error Detail:", error); 
    
    // Check for unique constraint violation (duplicate email)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to create staff' }, { status: 500 });
  }
}