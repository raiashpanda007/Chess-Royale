import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Visibility } from '@workspace/db';
import { getServerSession } from 'next-auth';
import NEXT_AUTH_CONFIG from '../auth';
import { z as zod } from 'zod';
import response from '@/app/utils/response';

const prisma = new PrismaClient();

const createTournamentSchema = zod.object({
    name: zod.string(),
    numberOfPlayers: zod.number(),
    logo: zod.string().optional(),
    visibility: zod.enum([Visibility.PUBLIC, Visibility.PRIVATE]),
    time: zod.number().min(2, "Time should be between 2 and 180 minutes").max(180),
    addedTime: zod.number().min(0, "Added Time should be between 0 and 10 minutes").max(10),
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
                logo: data.logo,
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
