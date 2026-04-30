import { prisma } from "@/app/lib/db";
import { NextRequest } from "next/server";

const allowedOrigin = "https://web-dev.c-syncapp.com";

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
    const formData = await req.formData();

    const ownerName = formData.get("ownerName") as string;
    const dogName = formData.get("dogName") as string;
    const email = formData.get("email") as string;
    const inquiry = formData.get("inquiry") as string;

    if (!ownerName || !email || !inquiry) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400, headers: corsHeaders() }
      );
    }

    await prisma.bubblesInquiry.create({
      data: {
        ownerName,
        dogName: dogName || "",
        email,
        inquiry,
      },
    });

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: corsHeaders(),
      }
    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ success: false }),
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
}