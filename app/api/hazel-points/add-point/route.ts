import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const updatedItem = await prisma.hazelPoint.update({
      where: { id: 1 },
      data: {
        points: {
          increment: 1,
        },
      },
    });

    return new NextResponse(JSON.stringify({ success: true, data: updatedItem }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}