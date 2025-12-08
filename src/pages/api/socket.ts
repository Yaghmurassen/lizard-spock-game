import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Action } from "@/types/game";

export const config = {
  api: {
    bodyParser: false,
  },
};

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: ServerIO;
    };
  };
};

// Helper function to check winner
const checkWinner = (action1: Action, action2: Action): boolean => {
  const winMap: Record<Action, Action[]> = {
    rock: ["scissors", "lizard"],
    paper: ["rock", "spock"],
    scissors: ["paper", "lizard"],
    lizard: ["spock", "paper"],
    spock: ["scissors", "rock"],
  };
  return winMap[action1].includes(action2);
};

// Helper function to generate room ID
const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Game state per room
interface RoomState {
  players: Array<{
    id: string;
    action?: Action;
    score: number;
    name?: string;
  }>;
  round: number;
  matchOver: boolean;
  bestOf: 3 | 5; // Configuration du match
  startTime?: number; // Timestamp de début du match
}

// Use global to persist rooms across hot-reloads in development
const globalForRooms = global as typeof globalThis & {
  rooms?: Map<string, RoomState>;
};

if (!globalForRooms.rooms) {
  console.log("🔧 Initializing global rooms Map");
  globalForRooms.rooms = new Map<string, RoomState>();
}

const rooms = globalForRooms.rooms;

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log("Starting Socket.IO server...");

    const io = new ServerIO(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);
      console.log(`📊 Current rooms in memory: ${rooms.size}`);
      if (rooms.size > 0) {
        console.log(`   Room IDs: ${Array.from(rooms.keys()).join(", ")}`);
      }

      // Create new room
      socket.on("create-room", (bestOf?: 3 | 5) => {
        const roomId = generateRoomId();
        rooms.set(roomId, {
          players: [],
          round: 1,
          matchOver: false,
          bestOf: bestOf || 3, // Default to best of 3
          startTime: Date.now(),
        });
        console.log(`🆕 Room created: ${roomId} (Best of ${bestOf || 3})`);

        // Automatically join the creator to the room
        socket.join(roomId);
        console.log(`✅ Creator (${socket.id}) auto-joined room ${roomId}`);

        socket.emit("room-created", { roomId });
      });

      // Join existing room
      socket.on("join-room", (roomId: string) => {
        const room = rooms.get(roomId);

        if (!room) {
          console.log(`❌ Room ${roomId} not found`);
          socket.emit("room-not-found");
          return;
        }

        if (room.players.length >= 2) {
          console.log(`❌ Room ${roomId} is full`);
          socket.emit("room-full");
          return;
        }

        socket.join(roomId);
        console.log(`✅ Socket ${socket.id} joined room ${roomId}`);
        socket.emit("room-joined", { roomId });
      });

      // Player sets their name and joins the game
      socket.on(
        "set-player-name",
        ({ playerName, roomId }: { playerName: string; roomId: string }) => {
          const room = rooms.get(roomId);

          if (!room) {
            socket.emit("room-not-found");
            return;
          }

          // Ensure socket is in the room (in case it was disconnected)
          socket.join(roomId);
          console.log(
            `Player ${socket.id} submitted name: ${playerName} in room ${roomId}`
          );

          // Check if player already exists (reconnection)
          const player = room.players.find((p) => p.id === socket.id);
          if (!player) {
            // New player - add them to the game
            if (room.players.length < 2) {
              room.players.push({
                id: socket.id,
                score: 0,
                name: playerName,
              });
              const playerNumber = room.players.length;

              console.log(
                `Player ${playerNumber} (${playerName}) joined room ${roomId}. Total: ${room.players.length}`
              );

              socket.emit("player-joined", {
                playerNumber,
                totalPlayers: room.players.length,
              });

              // Notify all players in room about game state
              if (room.players.length === 2) {
                console.log(
                  `🎮 Room ${roomId} ready! Emitting game-ready to all players`
                );
                console.log(
                  `📡 Players in room ${roomId}:`,
                  room.players.map((p) => ({ id: p.id, name: p.name }))
                );
                console.log(
                  `📡 Sockets in room ${roomId}:`,
                  Array.from(io.sockets.adapter.rooms.get(roomId) || [])
                );

                io.to(roomId).emit("game-ready", {
                  players: room.players.length,
                  player1Name: room.players[0]?.name,
                  player2Name: room.players[1]?.name,
                });
              } else {
                console.log("⏳ Only 1 player, emitting waiting-for-player");
                socket.emit("waiting-for-player");
              }
            } else {
              console.log(`❌ Room ${roomId} is full, rejecting player`);
              socket.emit("room-full");
            }
          } else {
            // Existing player - just update name
            player.name = playerName;
            console.log(
              `Player ${socket.id} updated name to: ${playerName} in room ${roomId}`
            );
          }
        }
      );

      // Player selects action
      socket.on(
        "select-action",
        ({ action, roomId }: { action: Action; roomId: string }) => {
          const room = rooms.get(roomId);
          if (!room) return;

          const player = room.players.find((p) => p.id === socket.id);
          if (player) {
            player.action = action;
            console.log(
              `Player ${socket.id} selected ${action} in room ${roomId}`
            );

            // Check if both players have chosen
            if (room.players.every((p) => p.action)) {
              const [player1, player2] = room.players;

              // Determine winner of this round
              let roundWinner: "player1" | "player2" | "draw" = "draw";

              if (player1.action !== player2.action) {
                // Check who wins based on game rules
                const player1Wins = checkWinner(
                  player1.action!,
                  player2.action!
                );
                roundWinner = player1Wins ? "player1" : "player2";

                // Update scores
                if (roundWinner === "player1") {
                  player1.score++;
                } else {
                  player2.score++;
                }
              }

              console.log(
                `Round ${room.round}: ${roundWinner} wins. Score: ${player1.score}-${player2.score}`
              );

              // Check if match is over based on bestOf configuration
              const scoreDiff = Math.abs(player1.score - player2.score);
              const minRounds = room.bestOf;
              const matchOver = room.round >= minRounds && scoreDiff >= 2;

              let matchWinner: "player1" | "player2" | undefined;
              let matchDuration: number | undefined;

              if (matchOver) {
                matchWinner =
                  player1.score > player2.score ? "player1" : "player2";
                room.matchOver = true;

                // Calculate match duration in seconds
                if (room.startTime) {
                  matchDuration = Math.floor(
                    (Date.now() - room.startTime) / 1000
                  );
                }

                console.log(
                  `🏆 Match over in room ${roomId}! Winner: ${matchWinner} (${matchDuration}s)`
                );
              }

              // Send results to both players
              io.to(player1.id).emit("round-result", {
                player1Action: player1.action,
                player2Action: player2.action,
                isPlayer1: true,
                player1Score: player1.score,
                player2Score: player2.score,
                roundNumber: room.round,
                matchOver,
                matchWinner,
                matchDuration,
                bestOf: room.bestOf,
                player1Name: player1.name,
                player2Name: player2.name,
              });

              io.to(player2.id).emit("round-result", {
                player1Action: player1.action,
                player2Action: player2.action,
                isPlayer1: false,
                player1Score: player1.score,
                player2Score: player2.score,
                roundNumber: room.round,
                matchOver,
                matchWinner,
                matchDuration,
                bestOf: room.bestOf,
                player1Name: player1.name,
                player2Name: player2.name,
              });

              room.round++;
            } else {
              // Notify player they're waiting
              socket.emit("waiting-for-opponent");
            }
          }
        }
      );

      // New round
      socket.on("new-round", (roomId: string) => {
        const room = rooms.get(roomId);
        if (!room) return;

        console.log(
          `📢 New round requested in room ${roomId}. Current matchOver: ${room.matchOver}`
        );

        if (room.matchOver) {
          // Reset entire match
          room.players.forEach((p) => {
            p.action = undefined;
            p.score = 0;
          });
          room.round = 1;
          room.matchOver = false;
          room.startTime = Date.now(); // Reset start time for new match
          console.log(
            `🔄 New match started in room ${roomId} - scores reset to 0-0`
          );
        } else {
          // Just reset actions for next round
          room.players.forEach((p) => {
            p.action = undefined;
          });
          console.log(
            `🔄 Starting round ${room.round} in room ${roomId} - keeping scores: ${room.players[0]?.score}-${room.players[1]?.score}`
          );
        }

        const resetData = {
          player1Score: room.players[0]?.score || 0,
          player2Score: room.players[1]?.score || 0,
          roundNumber: room.round,
        };

        console.log(
          `📤 Sending round-reset to room ${roomId} with data:`,
          resetData
        );

        // Notify all players in room to start new round
        io.to(roomId).emit("round-reset", resetData);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);

        // Find and clean up room
        for (const [roomId, room] of rooms.entries()) {
          const playerIndex = room.players.findIndex((p) => p.id === socket.id);
          if (playerIndex !== -1) {
            room.players.splice(playerIndex, 1);
            console.log(
              `Player removed from room ${roomId}. Remaining: ${room.players.length}`
            );

            if (room.players.length === 0) {
              // No players left, delete room
              rooms.delete(roomId);
              console.log(`🗑️ Room ${roomId} deleted (empty)`);
            } else {
              // Notify remaining player
              io.to(roomId).emit("player-disconnected");
            }
            break;
          }
        }
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("Socket.IO server already running");
  }

  res.status(200).json({ success: true });
};

export default SocketHandler;
