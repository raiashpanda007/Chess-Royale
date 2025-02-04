import {PrismaClient} from '@workspace/db';
import { NextRequest,NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import NEXT_AUTH_CONFIG from '../auth';
import response from '@/app/utils/response';

async function getTournamentDetails (req:NextRequest){
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if(!curruser){
        return NextResponse.json(
            new response(401,"Unauthorized",{}),
            {status:401}
        );
    }
    const tournamentid = req.headers.get('tournamentid');
    if(tournamentid === null){
        return NextResponse.json(
            new response(400,"Tournament id is required",{}),
            {status:400}
        );
    }
    
    const prisma = new PrismaClient();
    try {
        const tournament = await prisma.tournament.findUnique({
            where:{
                id:tournamentid
            },
            include:{
                admin:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        profilePicture:true,
                        username:true,

                    }
                },
                users:{
                    select:{
                        id:true,
                        name:true,
                        email:true,
                        profilePicture:true,
                        username:true,

                    }
                },
                rounds:{
                    include:{
                        matches:true
                    }
                },
                
                
    
            }
        });
        return NextResponse.json(
            new response(200,'Tournament details',tournament),{
                status:200
            }
        )
    } catch (error) {
        return NextResponse.json(
            new response(400,"Error in fetching user details",{error}),{
                status:400
            }
        )
        
    }


}

export default getTournamentDetails
