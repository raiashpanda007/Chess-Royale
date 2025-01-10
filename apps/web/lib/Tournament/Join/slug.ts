import { PrismaClient } from "@workspace/db";
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
        const tournamentDetails = await prisma.tournament.findUnique({
            where: {
                slug: parsedData.data.slug,
            },
            include: {
                users: true,
            },
        });

        if (!tournamentDetails) {
            return NextResponse.json(
                new response(404, "Not found", { message: "Tournament not found" }),
                { status: 404 }
            );
        }

        if (tournamentDetails.users.find((user) => user.id === curruser.user.id)) {
            return NextResponse.json(
                new response(400, "Failed", {
                    message: "You have already joined the tournament",
                }),
                { status: 400 }
            );
        }

        const addUser = await prisma.tournament.update({
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

        if (!addUser) {
            return NextResponse.json(
                new response(400, "Failed", {
                    message: "Failed to join the tournament",
                }),
                { status: 400 }
            );
        }

        return NextResponse.json(
            new response(200, "Success", {
                message: "You have successfully joined the tournament",
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error joining tournament:", error);
        return NextResponse.json(
            new response(500, "Internal server error", {
                message: "An unexpected error occurred",
            }),
            { status: 500 }
        );
    }
}

export default joinTournament;
