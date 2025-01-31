import asyncHandler from "../utils/asyncHandler";
import { PrismaClient } from "@workspace/db";
import { PairingAlogrithm, Players } from "@workspace/types";
import response from "../utils/repsonse";
import firstMatching from "../services/Match Making/randomMatching";
import matchMaking from "../services/Match Making/MatchMaking";

const prisma = new PrismaClient();
const pairing_algo = asyncHandler(async (req, res) => {
    const data: PairingAlogrithm = req.body;
    console.log("Pairing Algorithm Request:", data);

    try {
        // Step 1: Validate Tournament
        const tournament = await prisma.tournament.findUnique({
            where: { id: data.tournamentID },
            include: {
                users: { select: { id: true, username: true } }
            }
        });

        if (!tournament) {
            return res.status(404).json(new response(404, "Tournament not found", null));
        }
        if (tournament.adminId !== data.adminID) {
            return res.status(401).json(new response(401, "Unauthorized", null));
        }
        if (tournament.status !== "START") {
            return res.status(400).json(new response(400, "Tournament not started. Please start the tournament first.", null));
        }

        console.log("Tournament Found:", tournament);

        // Step 2: Fetch Players & Scores
        const users = tournament.users.map(user => user.id);
        let scoreCard = await prisma.scoreCard.findMany({
            where: {
                tournamentId: data.tournamentID,
                playerId: { in: users }
            },
            select: { playerId: true, score: true }
        });

        // Initialize ScoreCard if Empty
        if (scoreCard.length === 0) {
            await prisma.scoreCard.createMany({
                data: users.map(user => ({
                    tournamentId: data.tournamentID,
                    playerId: user,
                    score: 0
                }))
            });

            scoreCard = await prisma.scoreCard.findMany({
                where: { tournamentId: data.tournamentID },
                select: { playerId: true, score: true }
            });
        }

        // Step 3: Fetch Previous Matches
        const previousMatches = await prisma.match.findMany({
            where: { round: { tournamentId: data.tournamentID } },
            select: { player1Id: true, player2Id: true }
        });

        // Step 4: Create Players Array
        const players: Players[] = scoreCard.map(card => ({
            id: card.playerId,
            score: card.score,
            previousOpponents: new Set<string>()
        }));

        previousMatches.forEach(match => {
            players.forEach(player => {
                if (player.id === match.player1Id && match.player2Id) {
                    player.previousOpponents.add(match.player2Id);
                }
                if (player.id === match.player2Id && match.player1Id) {
                    player.previousOpponents.add(match.player1Id);
                }
            });
        });

        // Step 5: Check Tournament End Condition
        if (tournament.numberOfRounds === tournament.numberOfPlayers - 1) {
            await prisma.tournament.update({
                where: { id: tournament.id },
                data: { status: "FINISH" }
            });
            return res.status(200).json(new response(200, "Tournament ended", null));
        }

        // Sort Players Before Matchmaking
        players.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

        // Step 6: Perform Matchmaking
        const matchPairs = await matchMaking({
            tournamentID: tournament.id,
            adminID: tournament.adminId,
            players
        });

        console.log("Generated Match Pairs:", matchPairs);

        // Step 7: Create Rounds and Matches in a Transaction
        const roundsMatches = await prisma.$transaction(async (tx) => {
            const round = await tx.round.create({
                data: {
                    tournamentId: tournament.id,
                    number: tournament.numberOfRounds + 1
                }
            });

            // Create matches using Promise.all
            const matches = await Promise.all(
                matchPairs.map(pair =>
                    tx.match.create({
                        data: {
                            roundId: round.id,
                            player1Id: pair[0],
                            player2Id: pair[1] === "BYE" ? null : pair[1],
                            time: tournament.time,
                            AddedTime: tournament.AddedTime,
                            result: "NOT_PLAYED"
                        }
                    })
                )
            );

            // Update Tournament Round Count
            await tx.tournament.update({
                where: { id: tournament.id },
                data: { numberOfRounds: tournament.numberOfRounds + 1 }
            });

            return matches;
        });

        return res.status(200).json(new response(200, "Matchmaking completed", { MatchPairs: matchPairs, Rounds: roundsMatches }));
    } catch (error) {
        console.error("Unexpected Error in Pairing Algorithm:", error);
        return res.status(500).json(new response(500, "Internal server error", null));
    }
});




export default pairing_algo;
