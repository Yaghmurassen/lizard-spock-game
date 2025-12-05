import React from "react";
import { motion } from "framer-motion";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
}) => {
  const statusConfig = {
    connected: {
      color: "bg-green-500",
      text: "Connected",
      icon: "✓",
      className: "text-green-700 dark:text-green-300",
    },
    disconnected: {
      color: "bg-red-500",
      text: "Disconnected",
      icon: "✕",
      className: "text-red-700 dark:text-red-300",
    },
  };

  const status = isConnected
    ? statusConfig.connected
    : statusConfig.disconnected;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-4 z-50"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-lg border dark:border-slate-700">
        <motion.div
          animate={{
            scale: isConnected ? [1, 1.2, 1] : 1,
          }}
          transition={{
            duration: 1,
            repeat: isConnected ? Infinity : 0,
            repeatDelay: 1,
          }}
          className={`w-2 h-2 rounded-full ${status.color}`}
        />
        <span className={`text-sm font-medium ${status.className}`}>
          {status.text}
        </span>
      </div>
    </motion.div>
  );
};
