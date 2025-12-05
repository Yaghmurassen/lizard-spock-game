import { motion } from "framer-motion";
import { BestOfMode } from "@/types/game";

interface GameConfigModalProps {
  isOpen: boolean;
  currentBestOf: BestOfMode;
  onClose: () => void;
  onSave: (bestOf: BestOfMode) => void;
}

export default function GameConfigModal({
  isOpen,
  currentBestOf,
  onClose,
  onSave,
}: GameConfigModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ⚙️ Configuration du Match
        </h2>

        <div className="space-y-3 mb-6">
          <p className="text-gray-600 text-sm mb-4">
            Choisissez le format du match:
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSave(3)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              currentBestOf === 3
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="font-semibold text-lg text-gray-800">
                  Best of 3
                </div>
                <div className="text-sm text-gray-600">
                  Premier à gagner avec 2 points d&apos;écart (min. 3 rounds)
                </div>
              </div>
              {currentBestOf === 3 && (
                <div className="text-indigo-600 text-2xl">✓</div>
              )}
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSave(5)}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              currentBestOf === 5
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-300 hover:border-indigo-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="font-semibold text-lg text-gray-800">
                  Best of 5
                </div>
                <div className="text-sm text-gray-600">
                  Premier à gagner avec 2 points d&apos;écart (min. 5 rounds)
                </div>
              </div>
              {currentBestOf === 5 && (
                <div className="text-indigo-600 text-2xl">✓</div>
              )}
            </div>
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full hover:cursor-pointer bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Fermer
        </motion.button>
      </motion.div>
    </div>
  );
}
