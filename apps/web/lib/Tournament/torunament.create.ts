import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@workspace/db';
import { getServerSession } from 'next-auth';
import NEXT_AUTH_CONFIG from '../auth';
import { z as zod } from 'zod';
import response from '@/app/utils/response';
import findMedia from '@/app/utils/GetMultimedia';
import slugifyTournament from '@/app/utils/generateTournametslugandurl';
const prisma = new PrismaClient();

const createTournamentSchema = zod.object({
    name: zod.string().nonempty(),
    numberOfPlayers: zod.string().transform(Number),
    visibility: zod.enum(["PUBLIC", "PRIVATE"]),
    time: zod.string().transform(Number),
    addedTime: zod.string().transform(Number),
    logo: zod.string().nullable().optional(),
});

  
async function handleCreateTournament(req: NextRequest): Promise<NextResponse> {
    try {
        const currUser = await getServerSession(NEXT_AUTH_CONFIG);
        console.log(currUser)
        if (!currUser) {
            return NextResponse.json(
                new response(401, "Unauthorized", {}),
                { status: 401 }
            );
        }
        
        const body = await req.json();
        console.log("Request body:", body);

        const parsedData = createTournamentSchema.safeParse(body);
        if (!parsedData.success) {
            console.error("Zod parsing error:", parsedData.error);
            return NextResponse.json(
                new response(400, "Invalid Data", { error: parsedData.error }),
                { status: 400 }
            );
        }

        const data = parsedData.data;
        const { finalSlug } = slugifyTournament(data.name);

        const tournament = await prisma.tournament.create({
            data: {
                name: data.name,
                numberOfPlayers: data.numberOfPlayers,
                status: "OPEN",
                numberOfRounds: 0,
                visibility: data.visibility,
                admin: {
                    connect: {
                        id: currUser.user.id,
                    },
                },
                time: data.time,
                AddedTime: data.addedTime,
                logo: data.logo ? await findMedia(data.logo) : null,
                slug: finalSlug,
            },
        });

        return NextResponse.json(
            new response(200, "Tournament created successfully", tournament),
            { status: 200 }
        );
    } catch (error) {
        
        return NextResponse.json(
            new response(500, "Failed to create tournament", { error: error }),
            { status: 500 }
        );
    }
}


export default handleCreateTournament;
