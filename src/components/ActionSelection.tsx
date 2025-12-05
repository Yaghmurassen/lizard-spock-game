import React from "react";
import { Action, ACTION_EMOJIS, ACTION_NAMES } from "@/types/game";
import { motion } from "framer-motion";

interface ActionSelectionProps {
  onSelectAction: (action: Action) => void;
  playerNumber: number;
  player1Score?: number;
  player2Score?: number;
  roundNumber?: number;
  player1Name?: string;
  player2Name?: string;
  rivalryScore?: string;
  onShowStats?: () => void;
}

const ACTIONS: Action[] = ["rock", "paper", "scissors", "lizard", "spock"];

export const ActionSelection: React.FC<ActionSelectionProps> = ({
  onSelectAction,
  playerNumber,
  player1Score = 0,
  player2Score = 0,
  roundNumber = 1,
  player1Name = "Player 1",
  player2Name = "Player 2",
  rivalryScore,
  onShowStats,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl dark:shadow-blue-900/20 p-8 max-w-2xl w-full border dark:border-slate-700"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-slate-100"
        >
          Rock Paper Scissors Lizard Spock
        </motion.h1>

        {/* Score Display */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          {/* Current Match Score */}
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {playerNumber === 1 ? player1Name : player2Name}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                You (P{playerNumber})
              </p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {playerNumber === 1 ? player1Score : player2Score}
              </p>
            </div>
            <div className="text-gray-400 dark:text-slate-400 text-lg font-semibold">
              Round {roundNumber}
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {playerNumber === 1 ? player2Name : player1Name}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                Opponent
              </p>
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                {playerNumber === 1 ? player2Score : player1Score}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl font-semibold text-center mb-6 text-gray-700 dark:text-slate-200"
        >
          Choose your action:
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ACTIONS.map((action, index) => (
            <motion.button
              key={action}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 + index * 0.05,
                duration: 0.3,
              }}
              whileHover={{
                scale: 1.05,
                cursor: "pointer",
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectAction(action)}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-purple-900/50 transition-shadow duration-200"
            >
              <span className="text-5xl mb-2">{ACTION_EMOJIS[action]}</span>
              <span className="text-lg font-semibold">
                {ACTION_NAMES[action]}
              </span>
            </motion.button>
          ))}
        </div>
        {/* Rivalry Score */}
        {rivalryScore && onShowStats && (
          <motion.button
            onClick={onShowStats}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-14 mb-4 p-4 bg-gradient-to-r hover:cursor-pointer from-indigo-500 to-purple-500 text-white py-2 rounded-lg font-semibold text-sm hover:from-indigo-600 hover:to-purple-600 transition-all"
          >
            📊 {rivalryScore} - Voir l&apos;historique
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};
