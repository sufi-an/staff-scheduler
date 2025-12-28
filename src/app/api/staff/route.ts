import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { StaffStatus } from "@prisma/client";

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch staff" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, jobTitle, nationality, location, status } = body;

    if (!name || !email || !nationality || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newStaff = await prisma.staff.create({
      data: {
        name,
        email,
        jobTitle: jobTitle,
        nationality,
        location,
        status: (status as StaffStatus) || undefined,
      },
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error: any) {
    console.error("Create Error Detail:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create staff" },
      { status: 500 }
    );
  }
}
