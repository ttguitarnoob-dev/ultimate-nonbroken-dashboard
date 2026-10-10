import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
 
  try {
    const { pointsAmount, reason } = await request.json();


    if (typeof pointsAmount !== 'number') {
      return NextResponse.json({ error: 'Invalid pointsAmount' }, { status: 400 });
    }

    const updatedItem = await prisma.hazelPoint.update({
      where: { id: 1 },
      data: {
        points: {
          decrement: pointsAmount,
        },
      },
    });

    const newChangeMessage = await prisma.hazelPointsChange.create({
    data: {
      amount: pointsAmount,
      isAddition: false,
      reason: reason || 'Subtracted points',
    },
  });

    return new NextResponse(JSON.stringify({ success: true, newPointsAmount: updatedItem.points, reason: newChangeMessage.reason }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}