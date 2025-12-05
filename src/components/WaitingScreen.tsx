import React from "react";
import { motion } from "framer-motion";

interface WaitingScreenProps {
  message: string;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 dark:from-slate-900 dark:via-purple-900 dark:to-pink-900"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl dark:shadow-purple-900/20 p-8 max-w-md text-center border dark:border-slate-700"
      >
        <div className="mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-b-4 border-purple-600 dark:border-purple-400 mx-auto"
          ></motion.div>
        </div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-4"
        >
          {message}
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-slate-300"
        >
          Please wait while we connect you to the game...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
