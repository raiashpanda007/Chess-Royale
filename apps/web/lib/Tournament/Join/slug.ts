import { Prisma, PrismaClient } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z as zod } from "zod";
import NEXT_AUTH_CONFIG from "../../auth";
import response from "@/app/utils/response";

const joinTournamentSchemaSlug = zod.object({
    slug: zod.string(),
});

async function joinTournament(req: NextRequest) {
    const curruser = await getServerSession(NEXT_AUTH_CONFIG);
    if (!curruser) {
        return NextResponse.json(
            new response(401, "Unauthorized", {
                message: "You need to be logged in to join a tournament",
            }),
            { status: 401 }
        );
    }

    const body = await req.json();
    const parsedData = joinTournamentSchemaSlug.safeParse(body);
    if (!parsedData.success) {
        return NextResponse.json(
            new response(400, "Invalid data", {
                message: parsedData.error.errors.map((e) => e.message).join(", "),
            }),
            { status: 400 }
        );
    }

    const prisma = new PrismaClient();
    try {
        const result = await prisma.$transaction(async (tx:Prisma.TransactionClient) => {
            // Lock the tournament row for updates
            const tournamentDetails = await tx.tournament.findUnique({
                where: {
                    slug: parsedData.data.slug,
                },
                include: {
                    users: true,
                },
            });
            if(!tournamentDetails)
            return new response(400,"Invalid Slug" ,{})

            // Check if the user is already part of the tournament
            if (tournamentDetails.users.find((user) => user.id === curruser.user.id)) {
                return new response(200, "Already Joined", tournamentDetails);
            }

            // Check if the number of players exceeds the limit
            if (tournamentDetails.users.length >= tournamentDetails.numberOfPlayers) {
                await tx.tournament.update({
                    where: {
                        id: tournamentDetails.id,
                    },
                    data: {
                        status: "FILLED",
                    },
                })
                return new response(400, "Tournament Full", {
                    message: "The tournament has reached its maximum number of players",
                });
            }

            // Add the user to the tournament
            const res  = await tx.tournament.update({
                where: {
                    id: tournamentDetails.id,
                },
                data: {
                    users: {
                        connect: {
                            id: curruser.user.id,
                        },
                    },
                },
            });
            return new response(200, "Success", res);
        })

        if (!result || !result.success) {
            return NextResponse.json(
                new response(400, "Failed to join the tournament", {result:result?.data?.toLocaleString()}),
                { status: 400 }
            );
        }

        return NextResponse.json(
            new response(200, "You have successfully joined the tournament",
                result.data,
            ),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error joining tournament:", error);
        return NextResponse.json(
            new response(500, "Internal server error", {error}),
            { status: 500 }
        );
    }
}

export default joinTournament;
