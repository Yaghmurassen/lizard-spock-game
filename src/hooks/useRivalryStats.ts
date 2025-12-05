import { useState, useEffect, useCallback, useMemo } from "react";
import {
  RivalryStats,
  MatchRecord,
  BestOfMode,
  getRivalryKey,
} from "@/types/game";

const STORAGE_KEY = "rpsls-rivalry-stats";

export function useRivalryStats(player1Name: string, player2Name: string) {
  const [rivalryStats, setRivalryStats] = useState<RivalryStats | null>(null);

  // Generate consistent rivalry key
  const rivalryKey = useMemo(() => {
    if (!player1Name || !player2Name) return null;
    return getRivalryKey(player1Name, player2Name);
  }, [player1Name, player2Name]);

  // Load rivalry stats from localStorage
  const loadedStats = useMemo(() => {
    if (!rivalryKey || !player1Name || !player2Name) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allRivalries: Record<string, RivalryStats> = stored
        ? JSON.parse(stored)
        : {};

      if (allRivalries[rivalryKey]) {
        return allRivalries[rivalryKey];
      } else {
        // Initialize new rivalry
        const [p1, p2] = [player1Name, player2Name].sort();
        return {
          player1: p1,
          player2: p2,
          player1Wins: 0,
          player2Wins: 0,
          totalMatches: 0,
          matchHistory: [],
        } as RivalryStats;
      }
    } catch (error) {
      console.error("Error loading rivalry stats:", error);
      return null;
    }
  }, [rivalryKey, player1Name, player2Name]);

  useEffect(() => {
    setRivalryStats(loadedStats);
  }, [loadedStats]);

  // Save match result
  const saveMatch = useCallback(
    (
      winner: string,
      loser: string,
      finalScore: string,
      bestOf: BestOfMode,
      duration?: number
    ) => {
      if (!rivalryKey || !player1Name || !player2Name) {
        console.warn(
          "⚠️ Cannot save match: missing rivalry key or player names",
          {
            rivalryKey,
            player1Name,
            player2Name,
          }
        );
        return;
      }

      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const allRivalries: Record<string, RivalryStats> = stored
          ? JSON.parse(stored)
          : {};

        const currentStats = allRivalries[rivalryKey] || {
          player1: [player1Name, player2Name].sort()[0],
          player2: [player1Name, player2Name].sort()[1],
          player1Wins: 0,
          player2Wins: 0,
          totalMatches: 0,
          matchHistory: [],
        };

        const newMatch: MatchRecord = {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          winner,
          loser,
          finalScore,
          bestOf,
          duration,
        };

        // Update wins for the correct player
        const updatedStats: RivalryStats = {
          ...currentStats,
          totalMatches: currentStats.totalMatches + 1,
          player1Wins:
            winner === currentStats.player1
              ? currentStats.player1Wins + 1
              : currentStats.player1Wins,
          player2Wins:
            winner === currentStats.player2
              ? currentStats.player2Wins + 1
              : currentStats.player2Wins,
          matchHistory: [newMatch, ...currentStats.matchHistory].slice(0, 100), // Keep last 100 matches
          lastPlayed: Date.now(),
        };

        console.log("💾 Rivalry stats updated:", {
          rivalryKey,
          player1: updatedStats.player1,
          player1Wins: updatedStats.player1Wins,
          player2: updatedStats.player2,
          player2Wins: updatedStats.player2Wins,
          totalMatches: updatedStats.totalMatches,
        });

        allRivalries[rivalryKey] = updatedStats;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allRivalries));
        setRivalryStats(updatedStats);
      } catch (error) {
        console.error("Error saving rivalry match:", error);
      }
    },
    [rivalryKey, player1Name, player2Name]
  );

  // Get formatted score string (e.g., "Yag 12-7 Bob")
  const getScoreString = useCallback(() => {
    if (!rivalryStats) return "";

    return `${rivalryStats.player1} ${rivalryStats.player1Wins}-${rivalryStats.player2Wins} ${rivalryStats.player2}`;
  }, [rivalryStats]);

  // Get wins for a specific player
  const getPlayerWins = useCallback(
    (playerName: string) => {
      if (!rivalryStats) return 0;

      return playerName === rivalryStats.player1
        ? rivalryStats.player1Wins
        : rivalryStats.player2Wins;
    },
    [rivalryStats]
  );

  return {
    rivalryStats,
    saveMatch,
    getScoreString,
    getPlayerWins,
    hasHistory: rivalryStats ? rivalryStats.totalMatches > 0 : false,
  };
}
