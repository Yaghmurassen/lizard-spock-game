import { Action, RoundResult } from "@/types/game";

// Define the winning combinations
const WINNING_RULES: Record<Action, Partial<Record<Action, string>>> = {
  scissors: {
    paper: "Scissors cuts Paper",
    lizard: "Scissors decapitates Lizard",
  },
  paper: {
    rock: "Paper covers Rock",
    spock: "Paper disproves Spock",
  },
  rock: {
    lizard: "Rock crushes Lizard",
    scissors: "Rock crushes Scissors",
  },
  lizard: {
    spock: "Lizard poisons Spock",
    paper: "Lizard eats Paper",
  },
  spock: {
    scissors: "Spock smashes Scissors",
    rock: "Spock vaporizes Rock",
  },
};

export function determineWinner(
  player1Action: Action,
  player2Action: Action,
  isPlayer1: boolean
): Omit<
  RoundResult,
  "player1Score" | "player2Score" | "roundNumber" | "matchOver" | "matchWinner"
> {
  // Check for draw
  if (player1Action === player2Action) {
    return {
      player1Action,
      player2Action,
      winner: "draw",
      rule: "It's a draw!",
      outcome: "draw",
    };
  }

  // Check if player 1 wins
  const player1Wins = WINNING_RULES[player1Action]?.[player2Action];

  if (player1Wins) {
    return {
      player1Action,
      player2Action,
      winner: "player1",
      rule: player1Wins,
      outcome: isPlayer1 ? "win" : "lose",
    };
  }

  // Otherwise player 2 wins
  const player2Wins = WINNING_RULES[player2Action]?.[player1Action];

  return {
    player1Action,
    player2Action,
    winner: "player2",
    rule: player2Wins || "",
    outcome: isPlayer1 ? "lose" : "win",
  };
}
