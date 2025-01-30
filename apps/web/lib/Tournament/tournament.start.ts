import { PrismaClient } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import response from "@/app/utils/response";
import NEXT_AUTH_CONFIG from "../auth";
const prisma = new PrismaClient();
async function startTournament(req: NextRequest) {
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curruser) {
        return NextResponse.redirect('/api/auth/signin');
    }
    const body = await req.json();
    const { tournamentid } = body;
    const id = tournamentid[0];
    console.log("Tournament ID:", id);
    try {
        const getTournament = await prisma.tournament.findUnique({
            where: {
                id
            }
        })
        if (!getTournament) {
            return NextResponse.json(
                new response(404, "Tournament not found", {}),
                { status: 404 }
            );
        }
        if(getTournament.adminId !== curruser.user.id){
            return NextResponse.json(
                new response(403, "You are not authorized to start this tournament", {}),
                { status: 403 }
            );
        }
        const startTournament = await prisma.tournament.update({
            where: {
                id
            },
            data: {
                status: "START"
            }
        })
        return NextResponse.json(
            new response(200, "Tournament started", startTournament),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error during tournament start:", error);
        return NextResponse.json(
            new response(500, "Internal server error", { error }),
            { status: 500 }
        );
    }
}

export default startTournament;