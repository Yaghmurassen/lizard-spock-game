import React, { useState } from "react";
import { motion } from "framer-motion";

interface PlayerNameInputProps {
  onSubmitName: (name: string) => void;
}

export const PlayerNameInput: React.FC<PlayerNameInputProps> = ({
  onSubmitName,
}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError("Le pseudo doit contenir au moins 2 caractères");
      return;
    }

    if (trimmedName.length > 20) {
      setError("Le pseudo ne peut pas dépasser 20 caractères");
      return;
    }

    onSubmitName(trimmedName);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl dark:shadow-purple-900/20 p-8 max-w-md w-full border dark:border-slate-700"
      >
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white"
        >
          ✊✋✌️🦎🖖
        </motion.h1>

        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-semibold text-center mb-2 text-gray-700 dark:text-gray-200"
        >
          Rock Paper Scissors
        </motion.h2>

        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-center text-gray-500 dark:text-gray-400 mb-8"
        >
          Lizard Spock
        </motion.p>

        <motion.form
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="playerName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Entrez votre pseudo
            </label>
            <input
              type="text"
              id="playerName"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Votre nom..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors text-gray-800 dark:text-slate-100 dark:bg-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-400"
              autoFocus
              maxLength={20}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 dark:text-red-400 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            Commencer à jouer
          </motion.button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
        >
          En attente d&apos;un adversaire...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
