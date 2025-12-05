import React, { useState, useEffect } from "react";
import { useSocketContext } from "@/contexts/SocketContext";
import { Action, RoundResult, BestOfMode } from "@/types/game";
import { determineWinner } from "@/utils/gameLogic";
import { useRivalryStats } from "@/hooks/useRivalryStats";
import { WaitingScreen } from "./WaitingScreen";
import { ActionSelection } from "./ActionSelection";
import { RoundResultScreen } from "./RoundResultScreen";
import { PlayerNameInput } from "./PlayerNameInput";
import { ThemeToggle } from "./ThemeToggle";
import { ConnectionStatus } from "./ConnectionStatus";
import RoomSelection from "./RoomSelection";
import ShareRoomLink from "./ShareRoomLink";
import GameConfigModal from "./GameConfigModal";
import StatsModal from "./StatsModal";
import { AnimatePresence } from "framer-motion";

type GameScreen =
  | "room-selection"
  | "name-input"
  | "waiting"
  | "selecting"
  | "waiting-opponent"
  | "result";

export const Game: React.FC = () => {
  const { socket, isConnected } = useSocketContext();
  const [screen, setScreen] = useState<GameScreen>("room-selection");
  const [roomId, setRoomId] = useState<string>("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [playerNumber, setPlayerNumber] = useState<number>(0);
  const [result, setResult] = useState<RoundResult | null>(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0, round: 1 });
  const [playerNames, setPlayerNames] = useState({ player1: "", player2: "" });
  const [myPlayerName, setMyPlayerName] = useState<string>("");
  const [bestOf, setBestOf] = useState<BestOfMode>(3);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  const opponentName =
    playerNumber === 1 ? playerNames.player2 : playerNames.player1;

  console.log("🎮 Game Debug:", {
    myPlayerName,
    playerNumber,
    playerNames,
    opponentName,
  });

  const { rivalryStats, saveMatch, getScoreString, hasHistory } =
    useRivalryStats(myPlayerName, opponentName);
  const handleJoinRoom = (code: string) => {
    if (socket) {
      console.log("Joining room:", code);
      socket.emit("join-room", code);
    }
  };

  // Check URL for room parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get("room");

      if (roomParam && socket) {
        console.log("Auto-joining room from URL:", roomParam);
        handleJoinRoom(roomParam);
      }
    }
  }, [socket]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!socket) return;

    console.log("Setting up socket listeners, connected:", isConnected);

    // Room created
    socket.on("room-created", (data: { roomId: string }) => {
      console.log("Room created:", data.roomId);
      setRoomId(data.roomId);
      setIsCreatingRoom(false);
      setScreen("name-input");
    });

    // Room joined
    socket.on("room-joined", (data: { roomId: string }) => {
      console.log("Room joined:", data.roomId);
      setRoomId(data.roomId);
      setScreen("name-input");
    });

    // Room not found
    socket.on("room-not-found", () => {
      alert("Cette room n'existe pas. Vérifiez le code.");
      setScreen("room-selection");
    });

    // Room full
    socket.on("room-full", () => {
      alert("Cette room est déjà pleine (2 joueurs maximum).");
      setScreen("room-selection");
    });

    // Player joined
    socket.on("player-joined", (data: { playerNumber: number }) => {
      console.log("Player joined:", data);
      setPlayerNumber(data.playerNumber);
    });

    // Waiting for another player
    socket.on("waiting-for-player", () => {
      console.log("Waiting for player");
      setScreen("waiting");
    });

    // Game is ready (2 players connected)
    socket.on(
      "game-ready",
      (data?: {
        players: number;
        player1Name?: string;
        player2Name?: string;
      }) => {
        console.log("🎮🎮🎮 GAME READY EVENT RECEIVED 🎮🎮🎮", data);
        console.log("Current socket ID:", socket.id);
        console.log("Switching screen from", screen, "to 'selecting'");

        if (data?.player1Name && data?.player2Name) {
          setPlayerNames({
            player1: data.player1Name,
            player2: data.player2Name,
          });
        }
        setScreen("selecting");
      }
    );

    // Waiting for opponent to select
    socket.on("waiting-for-opponent", () => {
      console.log("Waiting for opponent");
      setScreen("waiting-opponent");
    });

    // Round result received
    socket.on(
      "round-result",
      (data: {
        player1Action: Action;
        player2Action: Action;
        isPlayer1: boolean;
        player1Score: number;
        player2Score: number;
        roundNumber: number;
        matchOver: boolean;
        matchWinner?: "player1" | "player2";
        matchDuration?: number;
        bestOf?: BestOfMode;
        player1Name?: string;
        player2Name?: string;
      }) => {
        console.log("Round result:", data);

        // Update scores
        setScores({
          player1: data.player1Score,
          player2: data.player2Score,
          round: data.roundNumber,
        });

        // Update names if provided
        if (data.player1Name && data.player2Name) {
          setPlayerNames({
            player1: data.player1Name,
            player2: data.player2Name,
          });
        }

        // Save match to history if it's over
        if (data.matchOver && data.matchWinner && myPlayerName) {
          const opponentName = data.isPlayer1
            ? data.player2Name
            : data.player1Name;
          const didWin =
            (data.isPlayer1 && data.matchWinner === "player1") ||
            (!data.isPlayer1 && data.matchWinner === "player2");

          const winnerName = didWin ? myPlayerName : opponentName;
          const loserName = didWin ? opponentName : myPlayerName;
          const finalScore = `${data.player1Score}-${data.player2Score}`;

          if (opponentName && winnerName && loserName) {
            console.log("💾 Saving rivalry match:", {
              winner: winnerName,
              loser: loserName,
              score: finalScore,
            });
            saveMatch(
              winnerName,
              loserName,
              finalScore,
              data.bestOf || 3,
              data.matchDuration
            );
          }
        }

        const roundResult = determineWinner(
          data.player1Action,
          data.player2Action,
          data.isPlayer1
        );

        // Add score and match info to result
        const fullResult: RoundResult = {
          ...roundResult,
          player1Score: data.player1Score,
          player2Score: data.player2Score,
          roundNumber: data.roundNumber,
          matchOver: data.matchOver,
          matchWinner: data.matchWinner,
        };

        setResult(fullResult);
        setScreen("result");
      }
    );

    // Round reset
    socket.on(
      "round-reset",
      (data?: {
        player1Score?: number;
        player2Score?: number;
        roundNumber?: number;
      }) => {
        console.log("📥 Round reset received:", data);
        if (data) {
          const newScores = {
            player1: data.player1Score ?? 0,
            player2: data.player2Score ?? 0,
            round: data.roundNumber ?? 1,
          };
          console.log("✅ Updating scores to:", newScores);
          setScores(newScores);
        } else {
          console.log("⚠️ No data received, resetting to 0-0");
          // Fallback: reset to initial state
          setScores({ player1: 0, player2: 0, round: 1 });
        }
        setResult(null);
        setScreen("selecting");
      }
    );

    // Game full
    socket.on("game-full", () => {
      console.log("Game is full");
      alert("The game is already full. Please try again later.");
    });

    // Player disconnected
    socket.on("player-disconnected", () => {
      console.log("Player disconnected");
      setScreen("waiting");
      setScores({ player1: 0, player2: 0, round: 1 });
      alert("The other player has disconnected. Waiting for a new player...");
    });

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("room-not-found");
      socket.off("room-full");
      socket.off("player-joined");
      socket.off("waiting-for-player");
      socket.off("game-ready");
      socket.off("waiting-for-opponent");
      socket.off("round-result");
      socket.off("round-reset");
      socket.off("game-full");
      socket.off("player-disconnected");
    };
  }, [socket, isConnected, myPlayerName, saveMatch, opponentName]);

  const handleCreateRoom = () => {
    if (socket) {
      console.log("Creating new room with best of", bestOf);
      setIsCreatingRoom(true);
      socket.emit("create-room", bestOf);
    }
  };

  const handleSelectAction = (action: Action) => {
    if (socket && roomId) {
      console.log("Selected action:", action, "in room:", roomId);
      socket.emit("select-action", { action, roomId });
      setScreen("waiting-opponent");
    }
  };

  const handleNewRound = () => {
    if (socket && roomId) {
      console.log("Starting new round/match in room:", roomId);
      socket.emit("new-round", roomId);
    }
  };

  const handleSubmitName = (name: string) => {
    if (socket && roomId) {
      console.log("Submitting player name:", name, "for room:", roomId);
      setMyPlayerName(name); // Store player's own name
      socket.emit("set-player-name", { playerName: name, roomId });
    }
  };

  return (
    <>
      <ThemeToggle />
      <ConnectionStatus isConnected={isConnected} />

      {/* Config and Stats buttons */}
      {screen === "room-selection" && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 flex gap-3 z-40">
          <button
            onClick={() => setShowConfigModal(true)}
            className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors flex items-center gap-2"
          >
            ⚙️ Config
          </button>
          {myPlayerName && (
            <button
              onClick={() => setShowStatsModal(true)}
              className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors flex items-center gap-2"
            >
              📊 Stats
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <GameConfigModal
        isOpen={showConfigModal}
        currentBestOf={bestOf}
        onClose={() => setShowConfigModal(false)}
        onSave={(newBestOf) => {
          setBestOf(newBestOf);
          setShowConfigModal(false);
        }}
      />

      <StatsModal
        isOpen={showStatsModal}
        rivalryStats={rivalryStats}
        currentPlayerName={myPlayerName}
        onClose={() => setShowStatsModal(false)}
      />

      <AnimatePresence mode="wait">
        {screen === "room-selection" && (
          <RoomSelection
            key="room-selection"
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            isCreating={isCreatingRoom}
          />
        )}

        {screen === "name-input" && (
          <>
            <ShareRoomLink roomId={roomId} />
            <PlayerNameInput key="name-input" onSubmitName={handleSubmitName} />
          </>
        )}

        {screen === "waiting" && (
          <>
            <ShareRoomLink roomId={roomId} />
            <WaitingScreen
              key="waiting"
              message="Waiting for another player to join..."
            />
          </>
        )}

        {screen === "selecting" && (
          <ActionSelection
            key="selecting"
            onSelectAction={handleSelectAction}
            playerNumber={playerNumber}
            player1Score={scores.player1}
            player2Score={scores.player2}
            roundNumber={scores.round}
            player1Name={playerNames.player1}
            player2Name={playerNames.player2}
            rivalryScore={hasHistory ? getScoreString() : undefined}
            onShowStats={() => setShowStatsModal(true)}
          />
        )}

        {screen === "waiting-opponent" && (
          <WaitingScreen
            key="waiting-opponent"
            message="Waiting for opponent's choice..."
          />
        )}

        {screen === "result" && result && (
          <RoundResultScreen
            key="result"
            result={result}
            onNewRound={handleNewRound}
            playerNumber={playerNumber}
            player1Name={playerNames.player1}
            player2Name={playerNames.player2}
          />
        )}
      </AnimatePresence>
    </>
  );
};
