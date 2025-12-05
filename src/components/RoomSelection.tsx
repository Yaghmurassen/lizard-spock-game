import { useState } from "react";
import { motion } from "framer-motion";

interface RoomSelectionProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  isCreating: boolean;
}

export default function RoomSelection({
  onCreateRoom,
  onJoinRoom,
  isCreating,
}: RoomSelectionProps) {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = roomId.trim().toUpperCase();

    if (trimmed.length < 4) {
      setError("Le code de la room doit contenir au moins 4 caractères");
      return;
    }

    setError("");
    onJoinRoom(trimmed);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          🎮 Pierre-Papier-Ciseaux
        </h1>
        <p className="text-center text-gray-600 mb-8">Lézard-Spock</p>

        <div className="space-y-4">
          {/* Create Room */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateRoom}
            disabled={isCreating}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? "Création..." : "✨ Créer une nouvelle room"}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 text-sm">ou</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Join Room */}
          <form onSubmit={handleJoin} className="space-y-3">
            <div>
              <label
                htmlFor="roomId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Rejoindre une room existante
              </label>
              <input
                id="roomId"
                type="text"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="Code de la room (ex: ABC123)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-center font-mono text-lg"
                maxLength={10}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!roomId.trim()}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚪 Rejoindre
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
