import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Visibility } from '@workspace/db';
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

  

async function handleCreateTournament(req: NextRequest) {
    try {
        const currUser = await getServerSession(NEXT_AUTH_CONFIG);
        if (!currUser) {
            return NextResponse.json(
                new response(401, "Unauthorized", {}),
                { status: 401 }
            );
        }
        
        const body = await req.json();
        
        const parsedData = createTournamentSchema.safeParse(body);

        if (!parsedData.success) {
            return NextResponse.json(
                new response(400, "Invalid Data", parsedData.error),
                { status: 400 }
            );
        }

        const data = parsedData.data;
        const { url, finalSlug } = slugifyTournament(data.name);
        const tournament = await prisma.tournament.create({
            data: {
                name: data.name,
                numberOfPlayers: data.numberOfPlayers,
                status: "OPEN",
                numberOfRounds: 0,
                visibility: data.visibility,
                admin:{
                    connect:{
                        id: currUser.user.id
                    }
                },
                time: data.time,
                AddedTime: data.addedTime,
                logo: data.logo ? await findMedia(data.logo) : null,
                joinurl: url,
                slug: finalSlug,

            },
        });

        return NextResponse.json(
            new response(200, "Tournament created successfully", tournament),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating tournament:", error);
        return NextResponse.json(
            new response(500, "Failed to create tournament", {}),
            { status: 500 }
        );
    }
}

export default handleCreateTournament;
