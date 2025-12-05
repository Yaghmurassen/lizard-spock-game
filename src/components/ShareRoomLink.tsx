import { useState } from "react";
import { motion } from "framer-motion";

interface ShareRoomLinkProps {
  roomId: string;
}

export default function ShareRoomLink({ roomId }: ShareRoomLinkProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}?room=${roomId}`
      : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-4 max-w-md mx-auto"
    >
      <div className="text-center mb-2">
        <p className="text-sm text-gray-600 mb-1">Code de la room:</p>
        <p className="text-2xl font-bold text-indigo-600 font-mono">{roomId}</p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={shareUrl}
          readOnly
          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 font-mono"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors whitespace-nowrap"
        >
          {copied ? "✓ Copié!" : "📋 Copier"}
        </motion.button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-2">
        Partage ce lien avec ton adversaire
      </p>
    </motion.div>
  );
}
