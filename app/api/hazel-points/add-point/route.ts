import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pointsAmount, reason } = await request.json();
    
    console.log("ADDING OPOINT ONMOG", pointsAmount, reason);

    if (typeof pointsAmount !== 'number') {
      console.log("WTFNOTNOMBER", pointsAmount, typeof pointsAmount)
      return NextResponse.json({ error: 'Invalid pointsAmount' }, { status: 400 });
    }

    const updatedItem = await prisma.hazelPoint.update({
      where: { id: 1 },
      data: {
        points: {
          increment: pointsAmount,
        },
      },
    });

    const newChangeMessage = await prisma.hazelPointsChange.create({
    data: {
      amount: pointsAmount,
      isAddition: true,
      reason: reason || 'Added points',
    },
  });

    return new NextResponse(JSON.stringify({ success: true, newPointsAmount: updatedItem.points, reason: newChangeMessage.reason }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.log('somethingterrible happened', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}