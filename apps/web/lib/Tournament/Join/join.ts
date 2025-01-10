import { PrismaClient } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import NEXT_AUTH_CONFIG from "../../auth";
import response from "@/app/utils/response";
import { z as zod } from "zod";
const joinTournamentSchema = zod.object({
    tournamentId: zod.string(),
});
async function joinTournament(req: NextRequest) {
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curruser) {
        return NextResponse.json(
            new response(401, "Unauthorized", {
                message: "You need to be logged in to join a tournament",
            }),
            { status: 401 }
        );
    }
    const body = await req.json();
    const parsedData = joinTournamentSchema.safeParse(body);
    if (!parsedData.success) {
        return NextResponse.json(
            new response(400, "Invalid data", parsedData.error.issues),
            { status: 400 }
        );
    }
    const prisma = new PrismaClient();
    try {
        const tournamentDetails = await prisma.tournament.findUnique({
            where: {
                id: parsedData.data.tournamentId,
            },
            include: {
                users: true,
            },
        });
        if(!tournamentDetails) {
            return NextResponse.json(
                new response(400,"Can't Find the tournament",{}),{
                    status: 400
                }
            )
        }
        if(tournamentDetails.users.find((user) => user.id === curruser.user.id)){
            return NextResponse.json(
                new response(400,"You have already joined the tournament",{}),{
                    status: 400
                }
            )
        }
        const updateTournament = await prisma.tournament.update({
            where: {
                id: parsedData.data.tournamentId,
            },
            data: {
                users: {
                    connect: {
                        id: curruser.user.id,
                    },
                },
            },include:{
                users:{
                    select:{
                        id:true,
                        name:true,
                        username:true,
                        email:true,
                    }
                }

            }
        });
        return NextResponse.json(
            new response(200, "Successfully joined the tournament", {
                updateTournament,
            }),
            { status: 200 }
        );
        
    } catch (error) {
        return NextResponse.json(
            new response(500, "Internal Server Error", { error }),
            { status: 500 }
        );
        
    }
    
}
export default joinTournament;