import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedItem = await prisma.hazelPoint.update({
      where: { id: 1 },
      data: {
        points: {
            decrement: 1,
          },
      },
    });

    return NextResponse.json({ success: true, data: updatedItem });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}