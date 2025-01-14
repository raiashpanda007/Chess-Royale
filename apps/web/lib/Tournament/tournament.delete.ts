import {z as zod } from 'zod'
import response from '@/app/utils/response'
import deleteFile from '@/app/utils/deletefile'
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
    const tournamentid =  req.headers.get('tournamentid');
    if(!tournamentid){
        return NextResponse.json(
            new response(400,"Bad Request",{message:"tournamentid is required"}),
            {status:400}
        );
    }
    try {
        const tournamentDetails = await prisma.tournament.findUnique({
            where:{
                id:tournamentid
            }
        });
        if(!tournamentDetails){
            return NextResponse.json(
                new response(404,"Tournament not found",{}),
                {status:404}
            );
        }
        if(tournamentDetails.logo ) await deleteFile(tournamentDetails.logo);
        console.log("Logo is deleted");
        const deleteTournament = tournamentDetails.adminId === curruser.user.id ? await prisma.tournament.delete({
            where:{
                id:tournamentid
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