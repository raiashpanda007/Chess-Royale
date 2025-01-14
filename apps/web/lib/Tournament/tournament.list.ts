import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "../auth";
import { PrismaClient } from "@workspace/db";
import response from "@/app/utils/response";

const prisma = new PrismaClient();
async function getTournamentsList(req:NextRequest) {
    // const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    // if (!curruser) {
    //     return NextResponse.redirect('/api/auth/signin');

    // }
    try {
        const getTournamentsList = await prisma.tournament.findMany({
            where:{
                visibility: "PUBLIC"
            }
        })
        console.log(getTournamentsList)
        return NextResponse.json(
            new response(200, "Tournament details", getTournamentsList),
            { status: 200 }
        );
        
    } catch (error) {
        return NextResponse.json(
            new response(500, "Internal server error", {error}),
            { status: 500 }
        );
        
    }
    

}
export default getTournamentsList;