import {z as zod } from 'zod'
import response from '@/app/utils/response'
const deleteTournamentSchema = zod.object({
    tournamentId: zod.string().nonempty(),
    
})
import NEXT_AUTH_CONFIG from '../auth'
import { PrismaClient } from '@workspace/db'
import { getServerSession } from 'next-auth'
import { NextRequest,NextResponse } from 'next/server'
async function deleteTournament (req:NextRequest){
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    
    if(!curruser){
        return NextResponse.json(
            new response(401,"Unauthorized",{}),
            {status:401}
        );
    }
    const prisma = new PrismaClient();
    const body = await req.json();
    const parsedData = deleteTournamentSchema.safeParse(body);
    if(!parsedData.success){
        return NextResponse.json(
            new response(400,"Invalid Data",parsedData.error),
            {status:400}
        );
    }
    const data = parsedData.data;
    try {
        const tournamentDetails = await prisma.tournament.findUnique({
            where:{
                id:data.tournamentId
            }
        });
        if(!tournamentDetails){
            return NextResponse.json(
                new response(404,"Tournament not found",{}),
                {status:404}
            );
        }
        const deleteTournament = tournamentDetails.adminId === curruser.user.id ? await prisma.tournament.delete({
            where:{
                id:data.tournamentId
            }
        }) : NextResponse.json(
            new response(403,"Forbidden to delete a tournament",{}),
            {status:403}
        );
        if(deleteTournament){
            return NextResponse.json(
                new response(200,"Tournament deleted successfully",{}),
                {status:200}
            );
        }
        
    } catch (error) {
        return NextResponse.json(
            new response(500,"Internal Server Error",{error}),
            {status:500}
        );
    }
}
export  default deleteTournament