import { Players } from "@workspace/types";

interface MatchMaking {
    tournamentID: string;
    adminID: string;
    players: Players[];
}

const matchMaking = async ({
    tournamentID,
    adminID,
    players
}: MatchMaking): Promise<[string, string][]> => {
    // Step 1: Sort players by score (descending), then by ID (for consistency)
    players.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

    let pairedMatches: [string, string][] = [];
    let unpairedPlayers: Players[] = [...players];

    // Step 2: Ensure previousOpponents is always a Set
    unpairedPlayers.forEach(player => {
        if (!player.previousOpponents) {
            player.previousOpponents = new Set();
        }
    });

    // Step 3: Create score groups (Map<score, Players[]>)
    const scoreGroups = new Map<number, Players[]>();
    unpairedPlayers.forEach(player => {
        if (!scoreGroups.has(player.score)) {
            scoreGroups.set(player.score, []);
        }
        scoreGroups.get(player.score)?.push(player);
    });

    // Step 4: Pair players within the same score group first
    for (const [score, group] of scoreGroups.entries()) {
        let localPlayers = [...group];

        while (localPlayers.length > 1) {
            let p1 = localPlayers.shift() ?? null;
            if (!p1) continue; // Ensure p1 is valid

            let opponentIndex = localPlayers.findIndex(
                (p) => !p1.previousOpponents.has(p.id)
            );

            if (opponentIndex !== -1) {
                let p2 = localPlayers.splice(opponentIndex, 1)[0] ?? null;
                if (!p2) continue; // Ensure p2 is valid

                pairedMatches.push([p1.id, p2.id]);

                // Update previous opponents
                p1.previousOpponents.add(p2.id);
                p2.previousOpponents.add(p1.id);
            } else {
                unpairedPlayers.push(p1); // Reassign for cross-group pairing
            }
        }

        // Handle odd number of players in a score group
        if (localPlayers.length === 1 && localPlayers[0]) {
            unpairedPlayers.push(localPlayers[0]);
        }
    }

    // Step 5: Pair remaining players with closest available opponents
    while (unpairedPlayers.length > 1) {
        let p1 = unpairedPlayers.shift() ?? null;
        let p2 = unpairedPlayers.shift() ?? null;

        if (!p1 || !p2) continue; // Ensure both players are valid

        pairedMatches.push([p1.id, p2.id]);

        // Update previous opponents
        p1.previousOpponents.add(p2.id);
        p2.previousOpponents.add(p1.id);
    }

    // Step 6: Assign a bye if there's an unpaired player left
    if (unpairedPlayers.length === 1 && unpairedPlayers[0]) {
        let byePlayer = unpairedPlayers[0];
        pairedMatches.push([byePlayer.id, "BYE"]);
    }

    return pairedMatches;
};

export default matchMaking;
