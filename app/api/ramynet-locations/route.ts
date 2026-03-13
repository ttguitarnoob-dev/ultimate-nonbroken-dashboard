import { prisma } from "@/app/lib/db"
import { getNearestPlace } from "@/app/lib/helpers"
import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    const data = await req.json()
    console.log("DATARECIEVEI", data)
    const latitude = data.latitude
    const longitude = data.longitude
    console.log("Accurate location data", latitude, longitude)
    const place = await getNearestPlace(latitude, longitude)
    console.log("DEPLACE", place)
    data.locationName = place
    console.log("FINSALDL", data)

    // const submission = data

    const submission = await prisma.ramyNetLocations.create({
                data: data
            })

            console.log("SIMGIDDED", submission)
    
    return new Response(JSON.stringify({ success: true, newItem: submission }), { status: 200 })
}