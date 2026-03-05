import { prisma } from "@/app/lib/db"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    const data = await req.json()
    console.log("DATARECIEVEI", data)

    const submission = await prisma.ramyNetLocations.create({
                data: data
            })

            console.log("SIMGIDDED", submission)
    
    return new Response(JSON.stringify({ success: true, newItem: submission }), { status: 200 })
}