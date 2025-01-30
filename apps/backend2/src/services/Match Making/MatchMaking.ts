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
    let remainingPlayers: Players[] = [];

    for (const [, group] of scoreGroups.entries()) {
        let localPlayers = [...group];

        while (localPlayers.length > 1) {
            let p1 = localPlayers.shift();
            if (!p1) continue; // Ensure p1 exists

            let opponentIndex = localPlayers.findIndex(
                (p) => !p1.previousOpponents.has(p.id)
            );

            if (opponentIndex !== -1) {
                let p2 = localPlayers.splice(opponentIndex, 1)[0]; // Ensure p2 exists
                if (p2) {
                    pairedMatches.push([p1.id, p2.id]);

                    // Update previous opponents
                    p1.previousOpponents.add(p2.id);
                    p2.previousOpponents.add(p1.id);
                } else {
                    remainingPlayers.push(p1);
                }
            } else {
                remainingPlayers.push(p1);
            }
        }

        // Handle unpaired player
        if (localPlayers.length === 1) {
            let lonePlayer = localPlayers[0];
            if (lonePlayer) {
                remainingPlayers.push(lonePlayer);
            }
        }
    }

    // Step 5: Pair remaining players across groups
    while (remainingPlayers.length > 1) {
        let p1 = remainingPlayers.shift();
        let p2 = remainingPlayers.shift();

        if (p1 && p2) {
            pairedMatches.push([p1.id, p2.id]);

            // Update previous opponents
            p1.previousOpponents.add(p2.id);
            p2.previousOpponents.add(p1.id);
        }
    }

    // Step 6: Assign a bye if there's an unpaired player left
    if (remainingPlayers.length === 1) {
        let byePlayer = remainingPlayers[0];
        if (byePlayer) {
            pairedMatches.push([byePlayer.id, "BYE"]);
        }
    }

    return pairedMatches;
};

export default matchMaking;
