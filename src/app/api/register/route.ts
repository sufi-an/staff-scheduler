import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    const user = await prisma.user.create({
      data: { email, name },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'User already exists or invalid data' }, { status: 400 });
  }
}