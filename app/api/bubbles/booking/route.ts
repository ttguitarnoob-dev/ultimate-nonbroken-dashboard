import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

const allowedOrigin = "https://barking-bubbles.com";
// const allowedOrigin = "https://web-dev.c-syncapp.com";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// 🔑 THIS handles the preflight request
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(req: NextRequest) {
  console.log("MAKING APPOINT")
  try {
    const body = await req.json();

    const appointment = await prisma.appointment.create({
      data: {
        ownerName: body.ownerName,
        email: body.email,
        phoneNumber: body.phoneNumber,

        dogName: body.dogName,

        furLength: body.furLength,
        dogSize: body.dogSize,

        allergy: body.allergy,
        allergyDescription: body.allergyDescription,

        location: body.location,
        additionalDetails: body.additionalDetails,

        slot: {
          connect: {
            id: body.slotId,
          },
        },
      },
      include: {
        slot: true,
      },
    });
    console.log('appointmentC REated', appointment)
    return NextResponse.json(appointment);
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to create appointment", {
      status: 500,
    });
  }
}