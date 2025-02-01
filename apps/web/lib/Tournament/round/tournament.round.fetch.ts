import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@workspace/db";
import { z as zod } from "zod";
import response from "@/app/utils/response";
const prisma = new PrismaClient();
const getTournamentMatchesSchema = zod.object({
    roundid: zod.string().nonempty(),
    
})
const getTournamentMatches = async (req: NextRequest) => {
    console.log("User requested to fetch tournament matches:");
    const body = await req.json();
    const parsedData = getTournamentMatchesSchema.safeParse(body);

    if (!parsedData.success) {
        console.error("Zod parsing error:", parsedData.error);
        return NextResponse.json(
            new response(400, "Invalid Data", { error: parsedData.error }),
            { status: 400 }
        );
    }

    const data = parsedData.data;

    try {
        const round = await prisma.round.findUnique({
            where: { id: data.roundid },
            include: {
                matches: {
                    include: {
                        player1: true, // Fetch player1 details
                        player2: true, // Fetch player2 details
                    },
                },
            },
        });

        if (!round) {
            return NextResponse.json(
                new response(404, "Round not found", {}),
                { status: 404 }
            );
        }

        return NextResponse.json(new response(200, "Match Details", round));
    } catch (error) {
        console.error("Error fetching tournament matches:", error);
        return NextResponse.json(
            new response(500, "Internal Server Error", {}),
            { status: 500 }
        );
    }
};

export default getTournamentMatches;