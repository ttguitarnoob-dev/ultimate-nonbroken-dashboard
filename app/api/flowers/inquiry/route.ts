import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

// const allowedOrigin = "https://aaw-flower.com";
const allowedOrigin = "https://web-dev.kitty-cottage.com";

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
  try {
    console.log("HITTED THE flower route")
    const data = await req.json();
    console.log("MAytobe got data", data)
    const { businessName, contactName, phone, email, message } = data;

    const newInquiry = await prisma.businessInquiry.create({
      data: {
        businessName,
        contactName,
        phone,
        email,
        message,
      },
    });

    return NextResponse.json(
      { success: true, data: newInquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating business inquiry:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}