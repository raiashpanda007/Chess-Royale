import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "../auth";
import {PrismaClient} from "@workspace/db"
import response from "@/app/utils/response";

const prisma = new PrismaClient();
async function getTournamentsList(req:NextRequest) {
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curruser) {
        return NextResponse.redirect('/api/auth/signin');

    }
    try {
        const getTournamentsList = await prisma.tournament.findMany({
            where:{
                visibility: "PUBLIC"
            },
            include:{
                users:{
                    select:{
                        id:true
                    }
                }
            }
        })
        const getprivateTournaments = await prisma.tournament.findMany({
            where:{
                visibility: "PRIVATE",
                OR:[
                    {
                        users:{
                            some:{
                                id:curruser.user.id
                            }
                        }
                    },
                    {
                        adminId:curruser.user.id
                    }
                ]
            },include:{
                users:{
                    select:{
                        id:true
                    }
                }
            }
        })
        const tournaments = getTournamentsList.concat(getprivateTournaments);
        return NextResponse.json(
            new response(200, "Tournament details", tournaments),
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