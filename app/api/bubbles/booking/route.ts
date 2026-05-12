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

  console.log("MAKING APPOINT");

  try {
    const body = await req.json();

    // Basic validation
    if (!body.slotId) {
      return NextResponse.json(
        { error: "slotId is required" },
        {
          status: 400,
          headers: corsHeaders(),
        }
      );
    }

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

    console.log("appointment CREATED", appointment);

    return NextResponse.json(appointment, {
      status: 201,
      headers: corsHeaders(),
    });

  } catch (error: any) {

    console.error("CREATE APPOINTMENT ERROR:", error);

    // Prisma known errors
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Selected appointment slot does not exist" },
        {
          status: 404,
          headers: corsHeaders(),
        }
      );
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "This appointment slot is already booked" },
        {
          status: 409,
          headers: corsHeaders(),
        }
      );
    }
    return NextResponse.json(
      {
        error: "Failed to create appointment",
        details:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}