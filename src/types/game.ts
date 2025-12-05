export type Action = "rock" | "paper" | "scissors" | "lizard" | "spock";

export type GameState = "waiting" | "playing" | "result" | "match-over";

export type Outcome = "win" | "lose" | "draw";

export interface Player {
  id: string;
  action?: Action;
  score: number;
  name?: string;
}

export interface GameData {
  players: Player[];
  state: GameState;
  round: number;
  matchOver: boolean;
  winner?: "player1" | "player2";
}

export interface RoundResult {
  player1Action: Action;
  player2Action: Action;
  winner: "player1" | "player2" | "draw";
  rule: string;
  outcome: Outcome;
  player1Score: number;
  player2Score: number;
  roundNumber: number;
  matchOver: boolean;
  matchWinner?: "player1" | "player2";
}

export type BestOfMode = 3 | 5;

export interface GameConfig {
  bestOf: BestOfMode;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  winner: string; // Nom du gagnant
  loser: string; // Nom du perdant
  finalScore: string; // e.g., "3-1"
  bestOf: BestOfMode;
  duration?: number; // in seconds
}

// Statistiques entre deux joueurs spécifiques
export interface RivalryStats {
  player1: string;
  player2: string;
  player1Wins: number;
  player2Wins: number;
  totalMatches: number;
  matchHistory: MatchRecord[];
  lastPlayed?: number;
}

// Clé pour identifier une rivalité (ordre alphabétique pour cohérence)
export const getRivalryKey = (player1: string, player2: string): string => {
  return [player1, player2].sort().join("_vs_");
};

export interface PlayerStats {
  playerName: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  matchHistory: MatchRecord[];
  favoriteAction?: Action;
  lastPlayed?: number;
}

export const ACTION_EMOJIS: Record<Action, string> = {
  rock: "🪨",
  paper: "📃",
  scissors: "✂️",
  lizard: "🦎",
  spock: "🖖",
};

export const ACTION_NAMES: Record<Action, string> = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
  lizard: "Lizard",
  spock: "Spock",
};
