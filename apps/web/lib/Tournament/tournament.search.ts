import { NextResponse,NextRequest } from "next/server";
import { PrismaClient } from "@workspace/db";
import { getServerSession } from "next-auth";
import NEXT_AUTH_CONFIG from "@/lib/auth";
import response from "@/app/utils/response";
import { z as zod } from "zod";
const prisma = new PrismaClient();
const createTournamentSchema = zod.object({
    search:zod.string().nonempty(),
});

const searchTournament = async (req: NextRequest)=> {
    const currUser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!currUser) {
        return NextResponse.json(new response(401, "Unauthorized", {}), { status: 401 });
    }
    const body = await req.json();
    const parsedData = createTournamentSchema.safeParse(body);
    if (!parsedData.success) {
        console.error("Zod parsing error:", parsedData.error);
        return NextResponse.json(new response(400, "Invalid Data", { error: parsedData.error }), { status: 400 });
    }
    const {search} = parsedData.data;
    try {
        const res = await prisma.tournament.findMany({
            where:{
                name:{
                    contains:search,
                    mode:"insensitive"
                }
            }
        });
        return NextResponse.json(new response(200,"Search Results ",res),{status:200});
    } catch (error) {
        return NextResponse.json(new response(500, "Internal Server Error", { error: error }), { status: 500 });
    }
}
export default searchTournament;

