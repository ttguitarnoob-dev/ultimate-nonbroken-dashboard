import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// const allowedOrigin = "https://web-dev.c-syncapp.com";
const allowedOrigin = "https://barking-bubbles.com";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(req: NextRequest) {
  console.log("HITTING get route");

  const { searchParams } = new URL(req.url);
  const year = Number(searchParams.get("year"));

  if (!year || Number.isNaN(year)) {
    return NextResponse.json(
      { error: "Missing or invalid year" },
      {
        status: 400,
        headers: corsHeaders(),
      }
    );
  }

  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  const slots = await prisma.availabilitySlot.findMany({
    where: {
      startsAt: {
        gte: start,
        lt: end,
      },
      appointment: null,
    },
    orderBy: {
      startsAt: "asc",
    },
    select: {
      id: true,
      startsAt: true,
    },
  });

  const grouped: Record<string, { id: string; time: string }[]> = {};

  for (const slot of slots) {
    const dateKey = slot.startsAt.toISOString().slice(0, 10);

    const time = slot.startsAt.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });

    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }

    grouped[dateKey].push({
      id: slot.id,
      time,
    });
  }

  console.log("SENDING", grouped);

  return NextResponse.json(grouped, {
    headers: corsHeaders(),
  });
}