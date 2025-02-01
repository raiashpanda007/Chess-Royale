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

    // Sort players by score first, then by Buchholz score
    scoreCard.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (buchholzScores.get(b.playerId) || 0) - (buchholzScores.get(a.playerId) || 0);
    });

    // Get the tournament winner
    const winner = scoreCard[0];

    if (!winner) return null;

    // Update the tournament with the winner
    await prisma.tournament.update({
        where: { id: tournamentId },
        data: { winnerId: winner.playerId },
    });

    return winner;
};

export default getWinner;
