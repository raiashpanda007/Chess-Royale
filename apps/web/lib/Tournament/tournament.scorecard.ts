import { PrismaClient } from "@prisma/client";
import { NextResponse,NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "@/lib/auth";
import response from "@/app/utils/response";
const prisma = new PrismaClient();
const getScoreCard = async (req:NextRequest) => {
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if(!curruser.user){
        return NextResponse.json(new response(401, "Unauthorized", null), {status: 401});
    }
    const tournamentid = req.headers.get("tournamentid");
    if(!tournamentid){
        return NextResponse.json(new response(400, "Bad Request", null), {status: 400});
    }
    try {
        const getScoreCard = await prisma.scoreCard.findMany({
            where: { tournamentId: tournamentid },
            include: { player:{
                select: { username: true ,name: true,id:true ,profilePicture:true}
            } }
        });
        return NextResponse.json(new response(200, "Success", getScoreCard), {status: 200});
    } catch (error) {
        return NextResponse.json(new response(500, "Internal Server Error", null), {status: 500});
        
    }
}
export default getScoreCard;

