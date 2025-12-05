import { useState, useEffect, useCallback, useMemo } from "react";
import { PlayerStats, MatchRecord, BestOfMode } from "@/types/game";

const STORAGE_KEY = "rpsls-match-history";

export function useMatchHistory(playerName: string) {
  const [stats, setStats] = useState<PlayerStats | null>(null);

  // Load stats from localStorage
  const loadedStats = useMemo(() => {
    if (!playerName) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allStats: Record<string, PlayerStats> = stored
        ? JSON.parse(stored)
        : {};

      if (allStats[playerName]) {
        return allStats[playerName];
      } else {
        // Initialize new player stats
        return {
          playerName,
          totalMatches: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          matchHistory: [],
        } as PlayerStats;
      }
    } catch (error) {
      console.error("Error loading match history:", error);
      return null;
    }
  }, [playerName]);

  useEffect(() => {
    setStats(loadedStats);
  }, [loadedStats]);

  // Save match result
  const saveMatch = useCallback(
    (
      opponent: string,
      result: "win" | "lose",
      finalScore: string,
      bestOf: BestOfMode,
      duration?: number
    ) => {
      if (!playerName) return;

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allStats: Record<string, PlayerStats> = stored
          ? JSON.parse(stored)
          : {};

        const currentStats = allStats[playerName] || {
          playerName,
          totalMatches: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          matchHistory: [],
        };

        const newMatch: MatchRecord = {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          opponent,
          result,
          finalScore,
          bestOf,
          duration,
        };

        const updatedStats: PlayerStats = {
          ...currentStats,
          totalMatches: currentStats.totalMatches + 1,
          wins: result === "win" ? currentStats.wins + 1 : currentStats.wins,
          losses:
            result === "lose" ? currentStats.losses + 1 : currentStats.losses,
          matchHistory: [newMatch, ...currentStats.matchHistory].slice(0, 50), // Keep last 50 matches
          lastPlayed: Date.now(),
        };

        updatedStats.winRate =
          updatedStats.totalMatches > 0
            ? (updatedStats.wins / updatedStats.totalMatches) * 100
            : 0;

        allStats[playerName] = updatedStats;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allStats));
        setStats(updatedStats);
      } catch (error) {
        console.error("Error saving match:", error);
      }
    },
    [playerName]
  );

  // Get stats against specific opponent
  const getOpponentStats = useCallback(
    (opponentName: string) => {
      if (!stats) return null;

      const matches = stats.matchHistory.filter(
        (m) => m.opponent === opponentName
      );
      const wins = matches.filter((m) => m.result === "win").length;
      const losses = matches.filter((m) => m.result === "lose").length;

      return {
        totalMatches: matches.length,
        wins,
        losses,
        winRate: matches.length > 0 ? (wins / matches.length) * 100 : 0,
        recentMatches: matches.slice(0, 10),
      };
    },
    [stats]
  );

  return {
    stats,
    saveMatch,
    getOpponentStats,
  };
}
