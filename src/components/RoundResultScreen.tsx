import React, { useEffect } from "react";
import { RoundResult, ACTION_EMOJIS, ACTION_NAMES } from "@/types/game";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface RoundResultScreenProps {
  result: RoundResult;
  onNewRound: () => void;
  playerNumber: number;
  player1Name?: string;
  player2Name?: string;
}

export const RoundResultScreen: React.FC<RoundResultScreenProps> = ({
  result,
  onNewRound,
  playerNumber,
  player1Name = "Player 1",
  player2Name = "Player 2",
}) => {
  const outcomeColors = {
    win: "bg-green-500",
    lose: "bg-red-500",
    draw: "bg-yellow-500",
  };

  const outcomeText = {
    win: "You Win! 🎉",
    lose: "You Lose 😢",
    draw: "It's a Draw! 🤝",
  };

  const isMatchOver = result.matchOver;
  const opponentName = playerNumber === 1 ? player2Name : player1Name;
  const matchWinnerText = result.matchWinner
    ? result.matchWinner === "player1"
      ? playerNumber === 1
        ? "You Won the Match! 🏆"
        : `${opponentName} Won the Match! 🏆`
      : playerNumber === 2
      ? "You Won the Match! 🏆"
      : `${opponentName} Won the Match! 🏆`
    : null;

  const didWinMatch =
    isMatchOver &&
    ((result.matchWinner === "player1" && playerNumber === 1) ||
      (result.matchWinner === "player2" && playerNumber === 2));

  useEffect(() => {
    if (didWinMatch) {
      // Confetti explosion when winning the match
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50;

        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.1, 0.9),
            y: Math.random() - 0.2,
          },
          colors: ["#FFD700", "#FFA500", "#FF69B4", "#9370DB", "#00CED1"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [didWinMatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl dark:shadow-indigo-900/20 p-8 max-w-2xl w-full border dark:border-slate-700"
      >
        {/* Score Display */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-between items-center mb-6"
        >
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-slate-300">
              {playerNumber === 1 ? player1Name : player2Name}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500">You</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {playerNumber === 1 ? result.player1Score : result.player2Score}
            </p>
          </div>
          <div className="text-gray-400 dark:text-slate-400 text-xl font-semibold">
            Round {result.roundNumber}
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-slate-300">
              {playerNumber === 1 ? player2Name : player1Name}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Opponent
            </p>
            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {playerNumber === 1 ? result.player2Score : result.player1Score}
            </p>
          </div>
        </motion.div>

        {/* Match Winner or Round Outcome */}
        {isMatchOver && matchWinnerText ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="bg-linear-to-r from-yellow-400 to-orange-500 text-white text-center py-8 rounded-lg mb-6"
          >
            <h1 className="text-5xl font-bold mb-2">{matchWinnerText}</h1>
            <p className="text-xl">Match Complete!</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className={`${
              outcomeColors[result.outcome]
            } text-white text-center py-6 rounded-lg mb-6`}
          >
            <h1 className="text-4xl font-bold">
              {outcomeText[result.outcome]}
            </h1>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-around items-center mb-8"
        >
          <motion.div
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">
              {playerNumber === 1 ? player1Name : player2Name}
            </p>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-6xl mb-2"
            >
              {
                ACTION_EMOJIS[
                  playerNumber === 1
                    ? result.player1Action
                    : result.player2Action
                ]
              }
            </motion.div>
            <p className="text-lg font-semibold text-gray-800 dark:text-slate-100">
              {
                ACTION_NAMES[
                  playerNumber === 1
                    ? result.player1Action
                    : result.player2Action
                ]
              }
            </p>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-4xl text-gray-400 dark:text-slate-500"
          >
            VS
          </motion.div>

          <motion.div
            initial={{ x: 50 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">
              {playerNumber === 1 ? player2Name : player1Name}
            </p>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-6xl mb-2"
            >
              {
                ACTION_EMOJIS[
                  playerNumber === 1
                    ? result.player2Action
                    : result.player1Action
                ]
              }
            </motion.div>
            <p className="text-lg font-semibold text-gray-800 dark:text-slate-100">
              {
                ACTION_NAMES[
                  playerNumber === 1
                    ? result.player2Action
                    : result.player1Action
                ]
              }
            </p>
          </motion.div>
        </motion.div>

        {/* Rule */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-100 dark:bg-slate-700/50 rounded-lg p-4 mb-6 text-center border dark:border-slate-600"
        >
          <p className="text-xl font-medium text-gray-800 dark:text-slate-100">
            {result.rule}
          </p>
        </motion.div>

        {/* New Round/Match Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewRound}
          className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl font-bold rounded-lg shadow-lg"
        >
          {isMatchOver ? "New Match" : "Next Round"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
