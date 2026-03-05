import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
    console.log("SMELLASS")
    
    return new Response(JSON.stringify({ success: true, message: "You are a smelly ass, according to the console log. Or maybe it wants you to smell an ass. Unclear console log" }), { status: 200 })
}