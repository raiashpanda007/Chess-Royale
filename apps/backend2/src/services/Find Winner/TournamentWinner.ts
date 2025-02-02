import { PrismaClient } from "@workspace/db";

const prisma = new PrismaClient();

const getWinner = async (tournamentId: string) => {
    // Fetch tournament details
    const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
        include: {
            users: { select: { id: true, username: true } },
        },
    });

    if (!tournament) return null;

    const { numberOfPlayers, numberOfRounds, users } = tournament;

    // Check if the tournament meets the Buchholz condition
    if (numberOfRounds !== numberOfPlayers - 1) {
        throw new Error("Tournament does not meet Buchholz calculation criteria");
    }

    const userIds = users.map(user => user.id);

    // Fetch players' scores
    let scoreCard = await prisma.scoreCard.findMany({
        where: { tournamentId, playerId: { in: userIds } },
        select: { playerId: true, score: true },
    });

    // Fetch matches to determine opponents
    let matches = await prisma.match.findMany({
        where: {
            OR: [
                { player1Id: { in: userIds } },
                { player2Id: { in: userIds } },
            ],
        },
        select: { player1Id: true, player2Id: true },
    });

    // Create a mapping of player scores for quick lookup
    const scoreMap = new Map(scoreCard.map(({ playerId, score }) => [playerId, score]));

    // Calculate Buchholz score for each player
    const buchholzScores = new Map<string, number>();

    for (let { playerId } of scoreCard) {
        let opponents = matches
            .filter(m => m.player1Id === playerId || m.player2Id === playerId)
            .map(m => (m.player1Id === playerId ? m.player2Id : m.player1Id))
            .filter(id => id !== null) as string[];

        let buchholzScore = opponents.reduce((sum, oppId) => sum + (scoreMap.get(oppId) || 0), 0);
        buchholzScores.set(playerId, buchholzScore);
    }

    // Find the highest score
    const highestScore = Math.max(...scoreCard.map(player => player.score));

    // Get all players with the highest score
    let topPlayers = scoreCard.filter(player => player.score === highestScore);

    // Find the highest Buchholz score among them
    const highestBuchholz = Math.max(...topPlayers.map(player => buchholzScores.get(player.playerId) || 0));

    // Get all players with the highest Buchholz score
    let winners = topPlayers.filter(player => (buchholzScores.get(player.playerId) || 0) === highestBuchholz);

    // Store the winners in the TournamentWinner table
    await prisma.$transaction([
        // Insert all winners into TournamentWinner table
        prisma.tournamentWinner.createMany({
            data: winners.map(winner => ({
                tournamentId,
                playerId: winner.playerId,
            })),
            skipDuplicates: true, // Avoid duplicate entries
        }),
        // Update tournament status to FINISH
        prisma.tournament.update({
            where: { id: tournamentId },
            data: { status: "FINISH" },
        }),
    ]);

    return winners;
};

export default getWinner;
