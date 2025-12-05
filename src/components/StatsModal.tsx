import { motion } from "framer-motion";
import { RivalryStats } from "@/types/game";

interface StatsModalProps {
  isOpen: boolean;
  rivalryStats: RivalryStats | null;
  currentPlayerName: string;
  onClose: () => void;
}

export default function StatsModal({
  isOpen,
  rivalryStats,
  currentPlayerName,
  onClose,
}: StatsModalProps) {
  if (!isOpen || !rivalryStats) return null;

  console.log("📊 StatsModal Debug:", {
    currentPlayerName,
    rivalryStats,
    player1: rivalryStats.player1,
    player2: rivalryStats.player2,
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "—";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const currentPlayerWins =
    currentPlayerName === rivalryStats.player1
      ? rivalryStats.player1Wins
      : rivalryStats.player2Wins;

  const opponentName =
    currentPlayerName === rivalryStats.player1
      ? rivalryStats.player2
      : rivalryStats.player1;

  const opponentWins =
    currentPlayerName === rivalryStats.player1
      ? rivalryStats.player2Wins
      : rivalryStats.player1Wins;

  const winRate =
    rivalryStats.totalMatches > 0
      ? (currentPlayerWins / rivalryStats.totalMatches) * 100
      : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            📊 Historique de Rivalité
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Rivalry Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 mb-6 text-white">
          <div className="text-center mb-4">
            <div className="text-sm opacity-90 mb-2">Score Global</div>
            <div className="text-4xl font-bold">
              {currentPlayerName} vs {opponentName}
            </div>
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold">{currentPlayerWins}</div>
              <div className="text-sm opacity-90 mt-1">Vous</div>
            </div>
            <div className="text-3xl opacity-50">-</div>
            <div className="text-center">
              <div className="text-5xl font-bold">{opponentWins}</div>
              <div className="text-sm opacity-90 mt-1">{opponentName}</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {rivalryStats.totalMatches}
            </div>
            <div className="text-sm text-gray-600">Total Matchs</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {winRate.toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600">Votre Taux</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-amber-600">
              {currentPlayerWins > opponentWins
                ? "🔥"
                : opponentWins > currentPlayerWins
                ? "😤"
                : "🤝"}
            </div>
            <div className="text-sm text-gray-600">
              {currentPlayerWins > opponentWins
                ? "Vous dominez"
                : opponentWins > currentPlayerWins
                ? "En retard"
                : "Égalité"}
            </div>
          </div>
        </div>

        {/* Match History */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">
            Historique des matchs ({rivalryStats.matchHistory.length})
          </h3>
          {rivalryStats.matchHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Aucun match joué encore contre {opponentName}
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {rivalryStats.matchHistory.map((match) => {
                const didWin = match.winner === currentPlayerName;
                return (
                  <div
                    key={match.id}
                    className={`p-3 rounded-lg border-2 ${
                      didWin
                        ? "border-green-200 bg-green-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              didWin ? "text-green-700" : "text-red-700"
                            }`}
                          >
                            {didWin ? "🏆 Victoire" : "❌ Défaite"}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(match.timestamp)} • Best of {match.bestOf}{" "}
                          • Score: {match.finalScore}
                          {match.duration &&
                            ` • ${formatDuration(match.duration)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full bg-indigo-600 hover:cursor-pointer text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-6"
        >
          Fermer
        </motion.button>
      </motion.div>
    </div>
  );
}
