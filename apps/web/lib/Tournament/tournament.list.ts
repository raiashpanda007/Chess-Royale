import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "../auth";
import { Prisma, PrismaClient } from "@workspace/db";
import response from "@/app/utils/response";

const prisma = new PrismaClient();
async function getTournamentDetails() {
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curruser) {
        return NextResponse.redirect('/api/auth/signin');

    }
    try {
        const getTournamentDetails = await prisma.tournament.findMany({
            where:{
                visibility: "PUBLIC"
            }
        })
        console.log(getTournamentDetails);
        return NextResponse.json(
            new response(200, "Tournament details", getTournamentDetails),
            { status: 200 }
        );
        
    } catch (error) {
        return NextResponse.json(
            new response(500, "Internal server error", {error}),
            { status: 500 }
        );
        
    }
    

}
export default getTournamentDetails;