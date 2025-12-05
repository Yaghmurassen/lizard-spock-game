# 🎮 Rock-Paper-Scissors-Lizard-Spock - Documentation complète

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Fonctionnalités implémentées](#fonctionnalités-implémentées)
- [Structure du projet](#structure-du-projet)
- [Flux de données détaillé](#flux-de-données-détaillé)
- [Développement Frontend](#développement-frontend)
- [Développement Backend](#développement-backend)
- [Tests](#tests)
- [Animations et UX](#animations-et-ux)
- [Persistance des données](#persistance-des-données)
- [Problèmes rencontrés et solutions](#problèmes-rencontrés-et-solutions)

---

## 🎯 Vue d'ensemble

Application de jeu multijoueur en temps réel permettant de jouer au Rock-Paper-Scissors-Lizard-Spock avec :

- **Rooms privées** avec liens partageables
- **Statistiques de rivalité** persistantes entre joueurs
- **Configuration flexible** (Best of 3 ou 5)
- **Historique complet** des matchs

---

## 🛠️ Stack technique

### Frontend

- **Next.js 16.0.0** - Framework React avec Page Router
- **React 19.0.0** - Bibliothèque UI
- **TypeScript 5.7.2** - Typage statique strict
- **Tailwind CSS 4.0.0** - Utility-first CSS framework
- **Framer Motion 12.0.0** - Animations fluides et transitions
- **Socket.io Client 4.8.1** - Communication temps réel
- **canvas-confetti 1.9.4** - Effets de célébration
- **React Hot Toast 2.4.1** - Notifications toast

### Backend

- **Next.js API Routes** - Backend intégré
- **Socket.io Server 4.8.1** - WebSocket server
- **Node.js** - Runtime

### Testing

- **Jest 29.7.0** - Framework de tests
- **React Testing Library 16.1.0** - Tests de composants React
- **@testing-library/jest-dom 6.6.3** - Matchers Jest pour DOM
- **@testing-library/user-event 14.5.2** - Simulation d'interactions utilisateur

### Dev Tools

- **ESLint 9** - Linter JavaScript/TypeScript
- **PostCSS 8** - Transformations CSS
- **ts-node 10.9.2** - Exécution TypeScript pour scripts

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Components  │  │   Contexts   │  │    Hooks     │     │
│  │              │  │              │  │              │     │
│  │ • Game       │  │ • Socket     │  │ • useSocket  │     │
│  │ • Actions    │  │ • Theme      │  │ • useRivalry │     │
│  │ • Stats      │  │              │  │ • useLocal   │     │
│  │ • Modals     │  │              │  │   Storage    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│                   Socket.io Client ⬇️⬆️                      │
└──────────────────────────────┬───────────────────────────────┘
                               │
┌──────────────────────────────┴───────────────────────────────┐
│                    BACKEND (Next.js API)                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Socket.io Server                         │  │
│  │                                                       │  │
│  │  • Room Management (Map<roomId, RoomState>)         │  │
│  │  • Player Connection/Disconnection                   │  │
│  │  • Game Logic (winner calculation)                   │  │
│  │  • Event Broadcasting                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                               │
                               ⬇️
                    ┌─────────────────────┐
                    │   localStorage      │
                    │  (Client-side)      │
                    │                     │
                    │ • Rivalry Stats     │
                    │ • Match History     │
                    └─────────────────────┘
```

---

## ✨ Fonctionnalités implémentées

### 1. Système de Rooms privées

- ✅ Génération d'ID unique pour chaque room (6 caractères alphanumériques)
- ✅ Création de room avec configuration Best of 3/5
- ✅ Partage de lien URL (`/?room=ABC123`)
- ✅ Copie du lien dans le presse-papier
- ✅ Auto-join depuis l'URL
- ✅ Validation de capacité (max 2 joueurs)
- ✅ Gestion de la déconnexion des joueurs

### 2. Statistiques de rivalité

- ✅ Suivi des victoires/défaites entre 2 joueurs spécifiques
- ✅ Persistance dans localStorage
- ✅ Clé de rivalité alphabétique (cohérence "Alice_vs_Bob")
- ✅ Historique des 100 derniers matchs
- ✅ Affichage du score en temps réel
- ✅ Modal d'historique détaillé avec scroll

### 3. Gameplay

- ✅ 5 actions : Rock, Paper, Scissors, Lizard, Spock
- ✅ Logique de victoire correcte selon les règles
- ✅ Best of 3 ou Best of 5 configurable
- ✅ Tracking du temps de match
- ✅ Synchronisation temps réel des deux joueurs
- ✅ Affichage des scores en direct

### 4. UX/UI

- ✅ Animations fluides avec Framer Motion
- ✅ Effets de confetti sur victoire
- ✅ États de chargement
- ✅ Messages d'erreur clairs
- ✅ Indicateur de connexion Socket.io
- ✅ Toggle thème clair/sombre
- ✅ Design responsive

---

## 📁 Structure du projet

```
wooclap/
├── public/                          # Assets statiques
├── src/
│   ├── components/                  # Composants React
│   │   ├── ActionSelection.tsx     # Sélection Rock/Paper/Scissors/Lizard/Spock
│   │   ├── ChatComponent.tsx       # Chat en temps réel (optionnel)
│   │   ├── ConnectionStatus.tsx    # Indicateur connexion Socket.io
│   │   ├── Game.tsx                # Orchestrateur principal du jeu
│   │   ├── GameConfigModal.tsx     # Modal configuration Best of 3/5
│   │   ├── PlayerNameInput.tsx     # Saisie du pseudo
│   │   ├── RoomSelection.tsx       # Créer/Rejoindre une room
│   │   ├── RoundResultScreen.tsx   # Écran résultat avec confetti
│   │   ├── ShareRoomLink.tsx       # Partage du lien de room
│   │   ├── StatsModal.tsx          # Modal historique rivalité
│   │   ├── ThemeToggle.tsx         # Toggle dark/light mode
│   │   ├── WaitingScreen.tsx       # Écran attente adversaire
│   │   └── __tests__/              # Tests des composants
│   │       └── ChatComponent.test.tsx
│   │
│   ├── contexts/                    # Contexts React
│   │   ├── SocketContext.tsx       # Provider Socket.io global
│   │   └── ThemeContext.tsx        # Provider thème
│   │
│   ├── hooks/                       # Custom hooks
│   │   ├── index.ts                # Barrel export
│   │   ├── useDebounce.ts          # Hook debounce pour inputs
│   │   ├── useLocalStorage.ts      # Hook localStorage typé
│   │   ├── useMatchHistory.ts      # Hook historique matchs (v1 deprecated)
│   │   ├── useRivalryStats.ts      # Hook stats de rivalité
│   │   ├── useSocket.ts            # Hook Socket.io avec reconnexion
│   │   └── __tests__/              # Tests des hooks
│   │       ├── useDebounce.test.tsx
│   │       └── useLocalStorage.test.tsx
│   │
│   ├── pages/                       # Next.js pages
│   │   ├── _app.tsx                # App wrapper avec providers
│   │   ├── _document.tsx           # HTML document custom
│   │   ├── index.tsx               # Page d'accueil (jeu)
│   │   └── api/
│   │       ├── hello.ts            # Endpoint test
│   │       └── socket.ts           # Socket.io server handler
│   │
│   ├── styles/
│   │   └── globals.css             # Styles globaux + Tailwind
│   │
│   ├── types/
│   │   └── game.ts                 # Types TypeScript du jeu
│   │
│   └── utils/
│       └── gameLogic.ts            # Logique de détermination du gagnant
│
├── eslint.config.mjs               # Configuration ESLint
├── jest.config.js                  # Configuration Jest
├── jest.setup.js                   # Setup tests (mocks, matchers)
├── next.config.ts                  # Configuration Next.js
├── package.json                    # Dépendances et scripts
├── postcss.config.mjs              # Configuration PostCSS
├── tailwind.config.js              # Configuration Tailwind
├── tsconfig.json                   # Configuration TypeScript
└── README.md                       # Documentation projet
```

---

## 🔄 Flux de données détaillé

### 1. Création et rejointe de room

```typescript
// CLIENT: Création de room
handleCreateRoom() {
  socket.emit("create-room", bestOf: 3 | 5);
}

// SERVER: Traitement
socket.on("create-room", (bestOf) => {
  const roomId = generateRoomId(); // Ex: "ABC123"
  rooms.set(roomId, {
    players: [],
    round: 1,
    matchOver: false,
    bestOf: bestOf || 3,
    startTime: Date.now()
  });
  socket.join(roomId);  // IMPORTANT!
  socket.emit("room-created", { roomId });
});

// CLIENT: Réception
socket.on("room-created", ({ roomId }) => {
  setRoomId(roomId);
  setScreen("name-input");
});
```

### 2. Saisie du nom et démarrage du jeu

```typescript
// CLIENT: Soumission du nom
handleSubmitName(name) {
  setMyPlayerName(name);
  socket.emit("set-player-name", { playerName: name, roomId });
}

// SERVER: Ajout du joueur
socket.on("set-player-name", ({ playerName, roomId }) => {
  socket.join(roomId);  // Re-join pour sécurité

  room.players.push({
    id: socket.id,
    score: 0,
    name: playerName
  });

  socket.emit("player-joined", {
    playerNumber: room.players.length
  });

  if (room.players.length === 1) {
    socket.emit("waiting-for-player");
  }

  if (room.players.length === 2) {
    io.to(roomId).emit("game-ready", {
      players: 2,
      player1Name: room.players[0].name,
      player2Name: room.players[1].name
    });
  }
});

// CLIENT: Réception game-ready
socket.on("game-ready", ({ player1Name, player2Name }) => {
  setPlayerNames({ player1: player1Name, player2: player2Name });
  setScreen("selecting");
});
```

### 3. Sélection d'action et résolution

```typescript
// CLIENT: Sélection
handleSelectAction(action: "rock" | "paper" | "scissors" | "lizard" | "spock") {
  socket.emit("select-action", { action, roomId });
  setScreen("waiting-opponent");
}

// SERVER: Attente des deux joueurs
socket.on("select-action", ({ action, roomId }) => {
  player.action = action;

  // Vérifier si les deux ont joué
  if (room.players.every(p => p.action)) {
    const [player1, player2] = room.players;

    // Déterminer le gagnant
    const player1Wins = checkWinner(player1.action, player2.action);

    if (player1Wins) player1.score++;
    else if (player1.action !== player2.action) player2.score++;

    room.round++;

    // Vérifier fin de match
    const minRounds = Math.ceil(room.bestOf / 2);
    const matchOver = player1.score >= minRounds || player2.score >= minRounds;

    const matchDuration = matchOver ? Date.now() - room.startTime : undefined;

    // Émettre résultat
    io.to(roomId).emit("round-result", {
      player1Action: player1.action,
      player2Action: player2.action,
      isPlayer1: socket.id === player1.id,
      player1Score: player1.score,
      player2Score: player2.score,
      roundNumber: room.round,
      matchOver,
      matchWinner: matchOver ? (player1.score > player2.score ? "player1" : "player2") : undefined,
      matchDuration,
      bestOf: room.bestOf,
      player1Name: player1.name,
      player2Name: player2.name
    });

    // Reset actions
    player1.action = undefined;
    player2.action = undefined;
  } else {
    socket.emit("waiting-for-opponent");
  }
});

// CLIENT: Affichage résultat
socket.on("round-result", (data) => {
  setScores({
    player1: data.player1Score,
    player2: data.player2Score,
    round: data.roundNumber
  });

  const winner = determineWinner(myAction, opponentAction);

  setResult({
    myAction,
    opponentAction,
    winner,
    emoji: getEmoji(winner),
    message: getMessage(winner),
    myScore: isPlayer1 ? data.player1Score : data.player2Score,
    opponentScore: isPlayer1 ? data.player2Score : data.player1Score,
    isMatchOver: data.matchOver,
    isMatchWinner: data.matchWinner === (isPlayer1 ? "player1" : "player2")
  });

  // Sauvegarder stats si match terminé
  if (data.matchOver) {
    const didWin = data.matchWinner === (playerNumber === 1 ? "player1" : "player2");
    const winnerName = didWin ? myPlayerName : opponentName;
    const loserName = didWin ? opponentName : myPlayerName;

    saveMatch(winnerName, loserName, `${data.player1Score}-${data.player2Score}`,
              data.bestOf, data.matchDuration);
  }

  setScreen("result");
});
```

### 4. Système de statistiques de rivalité

```typescript
// TYPES (types/game.ts)
export interface RivalryStats {
  player1: string; // Toujours alphabétique
  player2: string; // Toujours alphabétique
  player1Wins: number;
  player2Wins: number;
  totalMatches: number;
  matchHistory: MatchRecord[];
  lastPlayed?: number;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  winner: string;
  loser: string;
  finalScore: string; // "3-1"
  bestOf: BestOfMode;
  duration?: number; // ms
}

export function getRivalryKey(player1: string, player2: string): string {
  return [player1, player2].sort().join("_vs_");
}

// HOOK (hooks/useRivalryStats.ts)
export function useRivalryStats(player1Name: string, player2Name: string) {
  const [rivalryStats, setRivalryStats] = useState<RivalryStats | null>(null);

  const rivalryKey = useMemo(() => {
    if (!player1Name || !player2Name) return null;
    return getRivalryKey(player1Name, player2Name);
  }, [player1Name, player2Name]);

  // Chargement depuis localStorage
  useEffect(() => {
    if (!rivalryKey) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    const allRivalries = stored ? JSON.parse(stored) : {};
    setRivalryStats(allRivalries[rivalryKey] || null);
  }, [rivalryKey]);

  // Sauvegarde d'un match
  const saveMatch = useCallback(
    (
      winner: string,
      loser: string,
      finalScore: string,
      bestOf: BestOfMode,
      duration?: number
    ) => {
      if (!rivalryKey || !player1Name || !player2Name) return;

      const stored = localStorage.getItem(STORAGE_KEY);
      const allRivalries = stored ? JSON.parse(stored) : {};

      const currentStats = allRivalries[rivalryKey] || {
        player1: [player1Name, player2Name].sort()[0],
        player2: [player1Name, player2Name].sort()[1],
        player1Wins: 0,
        player2Wins: 0,
        totalMatches: 0,
        matchHistory: [],
      };

      const newMatch: MatchRecord = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        winner,
        loser,
        finalScore,
        bestOf,
        duration,
      };

      const updatedStats: RivalryStats = {
        ...currentStats,
        totalMatches: currentStats.totalMatches + 1,
        player1Wins:
          winner === currentStats.player1
            ? currentStats.player1Wins + 1
            : currentStats.player1Wins,
        player2Wins:
          winner === currentStats.player2
            ? currentStats.player2Wins + 1
            : currentStats.player2Wins,
        matchHistory: [newMatch, ...currentStats.matchHistory].slice(0, 100),
        lastPlayed: Date.now(),
      };

      allRivalries[rivalryKey] = updatedStats;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allRivalries));
      setRivalryStats(updatedStats);
    },
    [rivalryKey, player1Name, player2Name]
  );

  const getScoreString = useCallback(() => {
    if (!rivalryStats || !player1Name || !player2Name) return null;

    const isPlayer1 = player1Name === rivalryStats.player1;
    const myWins = isPlayer1
      ? rivalryStats.player1Wins
      : rivalryStats.player2Wins;
    const opponentWins = isPlayer1
      ? rivalryStats.player2Wins
      : rivalryStats.player1Wins;
    const opponentName = isPlayer1
      ? rivalryStats.player2
      : rivalryStats.player1;

    return `${player1Name} ${myWins}-${opponentWins} ${opponentName}`;
  }, [rivalryStats, player1Name, player2Name]);

  const hasHistory = rivalryStats && rivalryStats.totalMatches > 0;

  return { rivalryStats, saveMatch, getScoreString, hasHistory };
}
```

---

## 💻 Développement Frontend

### Gestion d'état avec React

**State principal dans Game.tsx:**

```typescript
const [screen, setScreen] = useState<GameScreen>("room-selection");
const [roomId, setRoomId] = useState<string>("");
const [playerNumber, setPlayerNumber] = useState<number>(0);
const [result, setResult] = useState<RoundResult | null>(null);
const [scores, setScores] = useState({ player1: 0, player2: 0, round: 1 });
const [playerNames, setPlayerNames] = useState({ player1: "", player2: "" });
const [myPlayerName, setMyPlayerName] = useState<string>("");
const [bestOf, setBestOf] = useState<BestOfMode>(3);
const [showConfigModal, setShowConfigModal] = useState(false);
const [showStatsModal, setShowStatsModal] = useState(false);
```

**Écrans du jeu (GameScreen):**

- `"room-selection"` - Créer/Rejoindre room
- `"name-input"` - Saisir pseudo
- `"waiting"` - Attente d'adversaire
- `"selecting"` - Choisir action
- `"waiting-opponent"` - Attente choix adversaire
- `"result"` - Affichage résultat

### Context API

**SocketContext.tsx:**

```typescript
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketIo = io({
      path: "/api/socket",
      addTrailingSlash: false,
    });

    socketIo.on("connect", () => setIsConnected(true));
    socketIo.on("disconnect", () => setIsConnected(false));

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
```

**ThemeContext.tsx:**

```typescript
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored as "light" | "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### Custom Hooks

**useLocalStorage.ts:**

```typescript
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
```

**useDebounce.ts:**

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### TypeScript - Types principaux

**game.ts:**

```typescript
export type Action = "rock" | "paper" | "scissors" | "lizard" | "spock";
export type BestOfMode = 3 | 5;
export type Winner = "player" | "opponent" | "draw";

export interface RoundResult {
  myAction: Action;
  opponentAction: Action;
  winner: Winner;
  emoji: string;
  message: string;
  myScore: number;
  opponentScore: number;
  isMatchOver?: boolean;
  isMatchWinner?: boolean;
}

export interface PlayerStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface RivalryStats {
  player1: string;
  player2: string;
  player1Wins: number;
  player2Wins: number;
  totalMatches: number;
  matchHistory: MatchRecord[];
  lastPlayed?: number;
}

export interface MatchRecord {
  id: string;
  timestamp: number;
  winner: string;
  loser: string;
  finalScore: string;
  bestOf: BestOfMode;
  duration?: number;
}

export const ACTION_EMOJIS: Record<Action, string> = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️",
  lizard: "🦎",
  spock: "🖖",
};

export const ACTION_LABELS: Record<Action, string> = {
  rock: "Pierre",
  paper: "Papier",
  scissors: "Ciseaux",
  lizard: "Lézard",
  spock: "Spock",
};

export function getRivalryKey(player1: string, player2: string): string {
  return [player1, player2].sort().join("_vs_");
}
```

### Logique de jeu

**gameLogic.ts:**

```typescript
import { Action, Winner } from "@/types/game";

const WINNING_COMBINATIONS: Record<Action, Action[]> = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  scissors: ["paper", "lizard"],
  lizard: ["spock", "paper"],
  spock: ["scissors", "rock"],
};

export function determineWinner(
  playerAction: Action,
  opponentAction: Action
): Winner {
  if (playerAction === opponentAction) return "draw";

  if (WINNING_COMBINATIONS[playerAction].includes(opponentAction)) {
    return "player";
  }

  return "opponent";
}

export function getWinnerMessage(
  playerAction: Action,
  opponentAction: Action,
  winner: Winner
): string {
  if (winner === "draw") return "Égalité !";

  const action1 = ACTION_LABELS[playerAction];
  const action2 = ACTION_LABELS[opponentAction];

  if (winner === "player") {
    if (playerAction === "rock") {
      return opponentAction === "scissors"
        ? `${action1} écrase ${action2}`
        : `${action1} écrase ${action2}`;
    }
    if (playerAction === "paper") {
      return opponentAction === "rock"
        ? `${action1} couvre ${action2}`
        : `${action1} réfute ${action2}`;
    }
    if (playerAction === "scissors") {
      return opponentAction === "paper"
        ? `${action1} coupe ${action2}`
        : `${action1} décapite ${action2}`;
    }
    if (playerAction === "lizard") {
      return opponentAction === "spock"
        ? `${action1} empoisonne ${action2}`
        : `${action1} mange ${action2}`;
    }
    if (playerAction === "spock") {
      return opponentAction === "scissors"
        ? `${action1} casse ${action2}`
        : `${action1} vaporise ${action2}`;
    }
  }

  return "Vous avez perdu !";
}
```

---

## 🖥️ Développement Backend

### Socket.io Server Setup

**pages/api/socket.ts:**

```typescript
import { Server as NetServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as ServerIO } from "socket.io";
import { Action } from "@/types/game";

export const config = {
  api: {
    bodyParser: false,
  },
};

interface RoomState {
  players: Array<{
    id: string;
    action?: Action;
    score: number;
    name?: string;
  }>;
  round: number;
  matchOver: boolean;
  bestOf: 3 | 5;
  startTime?: number;
}

const rooms = new Map<string, RoomState>();

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // ... Event handlers

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);

        // Trouver et nettoyer la room
        for (const [roomId, room] of rooms.entries()) {
          const playerIndex = room.players.findIndex((p) => p.id === socket.id);

          if (playerIndex !== -1) {
            room.players.splice(playerIndex, 1);

            if (room.players.length === 0) {
              rooms.delete(roomId);
              console.log(`🗑️ Room ${roomId} deleted (empty)`);
            } else {
              socket.to(roomId).emit("player-disconnected");
            }
            break;
          }
        }
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};

export default SocketHandler;
```

### Room Management

**Génération d'ID:**

```typescript
function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
```

**Check Winner Logic:**

```typescript
function checkWinner(action1: Action, action2: Action): boolean {
  const winMap: Record<Action, Action[]> = {
    rock: ["scissors", "lizard"],
    paper: ["rock", "spock"],
    scissors: ["paper", "lizard"],
    lizard: ["spock", "paper"],
    spock: ["scissors", "rock"],
  };
  return winMap[action1].includes(action2);
}
```

### Events gérés

**Côté serveur:**

- `create-room` - Création de room
- `join-room` - Rejoindre room existante
- `set-player-name` - Définir nom du joueur
- `select-action` - Choisir action
- `new-round` - Démarrer nouveau round
- `disconnect` - Gestion déconnexion

**Émis aux clients:**

- `room-created` - Room créée avec succès
- `room-joined` - Room rejointe avec succès
- `room-not-found` - Room inexistante
- `room-full` - Room pleine
- `player-joined` - Joueur ajouté
- `waiting-for-player` - Attente 2ème joueur
- `game-ready` - 2 joueurs prêts
- `waiting-for-opponent` - Attente choix adversaire
- `round-result` - Résultat du round
- `round-reset` - Reset pour nouveau round
- `player-disconnected` - Adversaire déconnecté

---

## 🧪 Tests

### Configuration Jest

**jest.config.js:**

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
  ],
};

module.exports = createJestConfig(customJestConfig);
```

**jest.setup.js:**

```javascript
import "@testing-library/jest-dom";

// Mock Socket.io
jest.mock("socket.io-client", () => {
  return jest.fn(() => ({
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
  }));
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Tests de composants

**ChatComponent.test.tsx:**

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatComponent from "../ChatComponent";

// Mock Socket.io
const mockSocket = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
};

jest.mock("../../contexts/SocketContext", () => ({
  useSocketContext: () => ({ socket: mockSocket, isConnected: true }),
}));

describe("ChatComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders chat input and send button", () => {
    render(<ChatComponent roomId="test-room" playerName="Alice" />);

    expect(screen.getByPlaceholderText(/votre message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /envoyer/i })
    ).toBeInTheDocument();
  });

  it("sends message when form is submitted", async () => {
    const user = userEvent.setup();
    render(<ChatComponent roomId="test-room" playerName="Alice" />);

    const input = screen.getByPlaceholderText(/votre message/i);
    const button = screen.getByRole("button", { name: /envoyer/i });

    await user.type(input, "Hello!");
    await user.click(button);

    expect(mockSocket.emit).toHaveBeenCalledWith("chat-message", {
      roomId: "test-room",
      message: "Hello!",
      playerName: "Alice",
      timestamp: expect.any(Number),
    });
  });

  it("clears input after sending message", async () => {
    const user = userEvent.setup();
    render(<ChatComponent roomId="test-room" playerName="Alice" />);

    const input = screen.getByPlaceholderText(
      /votre message/i
    ) as HTMLInputElement;

    await user.type(input, "Test");
    await user.click(screen.getByRole("button", { name: /envoyer/i }));

    expect(input.value).toBe("");
  });
});
```

### Tests de hooks

**useLocalStorage.test.tsx:**

```typescript
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("stores value in localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current[1]("new value");
    });

    expect(result.current[0]).toBe("new value");
    expect(localStorage.getItem("test-key")).toBe(JSON.stringify("new value"));
  });

  it("retrieves value from localStorage on mount", () => {
    localStorage.setItem("test-key", JSON.stringify("stored"));

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("stored");
  });
});
```

**useDebounce.test.tsx:**

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("debounces value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    );

    expect(result.current).toBe("initial");

    rerender({ value: "updated", delay: 500 });
    expect(result.current).toBe("initial"); // Still old value

    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(result.current).toBe("updated");
    });
  });
});
```

### Scripts de test

**package.json:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 🎨 Animations et UX

### Framer Motion

**Animations de transition d'écran:**

```typescript
import { motion, AnimatePresence } from "framer-motion";

<AnimatePresence mode="wait">
  {screen === "selecting" && (
    <motion.div
      key="selecting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ActionSelection />
    </motion.div>
  )}
</AnimatePresence>;
```

**Boutons interactifs:**

```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="..."
>
  Créer une room
</motion.button>
```

**Animations d'apparition:**

```typescript
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    type: "spring",
    stiffness: 260,
    damping: 20,
  }}
>
  {content}
</motion.div>
```

### Canvas Confetti

**Effet de victoire:**

```typescript
import confetti from "canvas-confetti";

const celebrateWin = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
  }, 200);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
  }, 400);
};
```

### Tailwind CSS

**Design système:**

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --foreground-rgb: 0, 0, 0;
    --background-start-rgb: 214, 219, 220;
    --background-end-rgb: 255, 255, 255;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --foreground-rgb: 255, 255, 255;
      --background-start-rgb: 0, 0, 0;
      --background-end-rgb: 0, 0, 0;
    }
  }
}

@layer components {
  .btn-primary {
    @apply bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold 
           hover:bg-indigo-700 transition-colors shadow-lg;
  }

  .card {
    @apply bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 
           border dark:border-slate-700;
  }
}
```

**Configuration Tailwind:**

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          // ... palette complète
          900: "#0c4a6e",
        },
      },
      animation: {
        "bounce-slow": "bounce 3s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
```

### Responsive Design

**Breakpoints utilisés:**

- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

**Exemple:**

```typescript
<div
  className="
  grid grid-cols-2 gap-2 
  sm:grid-cols-3 sm:gap-3 
  md:grid-cols-5 md:gap-4
"
>
  {/* Actions */}
</div>
```

---

## 💾 Persistance des données

### localStorage

**Structure:**

```json
{
  "rpsls-rivalry-stats": {
    "Alice_vs_Bob": {
      "player1": "Alice",
      "player2": "Bob",
      "player1Wins": 12,
      "player2Wins": 7,
      "totalMatches": 19,
      "lastPlayed": 1699564800000,
      "matchHistory": [
        {
          "id": "1699564800000-0.123456",
          "timestamp": 1699564800000,
          "winner": "Alice",
          "loser": "Bob",
          "finalScore": "3-1",
          "bestOf": 5,
          "duration": 145230
        }
      ]
    }
  },
  "theme": "dark",
  "playerName": "Alice"
}
```

**Clés utilisées:**

- `rpsls-rivalry-stats` - Toutes les statistiques de rivalité
- `theme` - Thème actuel (light/dark)
- `playerName` - Dernier nom utilisé (optionnel)

### Limitations

**localStorage:**

- ✅ Synchrone et rapide
- ✅ Persiste entre sessions
- ✅ ~5-10MB de capacité
- ❌ Pas de synchronisation cross-device
- ❌ Effacé si l'utilisateur nettoie le cache
- ❌ Accessible en lecture par JS (sécurité)

**Alternative envisagée (non implémentée):**

- IndexedDB pour plus de capacité
- Backend API pour sync cloud
- Compression des données historiques

---

## 🐛 Problèmes rencontrés et solutions

### 1. Socket non dans la room après création

**Problème:**
Le créateur de la room ne recevait pas `game-ready` quand le 2ème joueur rejoignait.

**Cause:**
Dans `create-room`, on créait la room mais on ne faisait pas `socket.join(roomId)`.

**Solution:**

```typescript
socket.on("create-room", (bestOf) => {
  const roomId = generateRoomId();
  rooms.set(roomId, {
    /* ... */
  });
  socket.join(roomId); // ← Ajouté!
  socket.emit("room-created", { roomId });
});
```

### 2. Socket perdant la connexion à la room

**Problème:**
Même après le fix #1, le joueur 1 ne recevait toujours pas `game-ready`.

**Cause:**
Le socket pouvait perdre la connexion à la room entre `create-room` et `set-player-name`.

**Solution:**
Re-join systématique dans `set-player-name`:

```typescript
socket.on("set-player-name", ({ playerName, roomId }) => {
  socket.join(roomId); // ← Re-join pour sécurité
  // ... reste du code
});
```

### 3. Noms de joueurs pas définis dans game-ready

**Problème:**
`playerNames` restaient vides `{ player1: "", player2: "" }`.

**Cause:**
Les noms étaient stockés côté serveur mais pas envoyés dans `game-ready`.

**Solution:**

```typescript
io.to(roomId).emit("game-ready", {
  players: 2,
  player1Name: room.players[0]?.name, // ← Ajouté
  player2Name: room.players[1]?.name, // ← Ajouté
});
```

### 4. Stats affichant le mauvais adversaire

**Problème:**
StatsModal affichait "yago vs yago" au lieu de "yago vs bob".

**Cause:**
Calcul de `opponentName` incorrect quand `rivalryStats.player1/player2` étaient dans l'ordre alphabétique.

**Solution:**

```typescript
const opponentName =
  currentPlayerName === rivalryStats.player1
    ? rivalryStats.player2
    : rivalryStats.player1;
```

### 5. Scores de rivalité à 0-0

**Problème:**
Les scores restaient à 0-0 même après plusieurs matchs.

**Cause:**
`saveMatch` était appelé avec `opponent` et `result` au lieu de `winner` et `loser`.

**Solution:**
Refonte complète du système :

```typescript
// Avant (incorrect)
saveMatch(opponentName, didWin ? "win" : "loss", ...);

// Après (correct)
const winnerName = didWin ? myPlayerName : opponentName;
const loserName = didWin ? opponentName : myPlayerName;
saveMatch(winnerName, loserName, ...);
```

### 6. Tailwind 4 gradient classes

**Problème:**
`bg-gradient-to-r` générait un warning ESLint.

**Cause:**
Tailwind 4 a changé la syntaxe : `bg-gradient-to-r` → `bg-linear-to-r`.

**Solution:**
Update de toutes les classes de gradient (non critique).

### 7. Dark mode CSS non fonctionnel

**Problème:**
Toggle dark mode ne changeait pas l'apparence.

**Cause:**
Tailwind 4 nécessite configuration spéciale pour dark mode.

**Solution:**
Abandonné temporairement, focus sur les fonctionnalités principales.

---

## 🚀 Améliorations futures

### Fonctionnalités

- [ ] Backend database (PostgreSQL/MongoDB) pour persistance serveur
- [ ] Authentification utilisateur (OAuth)
- [ ] Classement global (leaderboard)
- [ ] Mode tournoi (plusieurs joueurs)
- [ ] Replay des matchs
- [ ] Avatars personnalisés
- [ ] Achievements/badges
- [ ] Chat vocal
- [ ] Mobile app (React Native)

### Technique

- [ ] Tests E2E (Playwright/Cypress)
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Redis pour cache
- [ ] GraphQL API
- [ ] WebRTC pour peer-to-peer
- [ ] PWA (Progressive Web App)
- [ ] Internationalisation (i18n)

### Performance

- [ ] Code splitting avancé
- [ ] Image optimization
- [ ] Lazy loading composants
- [ ] Memoization aggressive
- [ ] Service Worker pour offline

---

## 📦 Dépendances complètes

```json
{
  "dependencies": {
    "canvas-confetti": "^1.9.4",
    "framer-motion": "^12.0.0",
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-hot-toast": "^2.4.1",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/canvas-confetti": "^1.6.4",
    "@types/jest": "^29.5.14",
    "@types/node": "^22",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "^16.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "postcss": "^8",
    "tailwindcss": "^4.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5"
  }
}
```

---

## 🎓 Concepts clés appris

### Socket.io

- Room management avec `socket.join()` et `io.to(roomId)`
- Broadcasting vs unicast (`io.to()` vs `socket.emit()`)
- Gestion de la déconnexion et reconnexion
- Event-driven architecture

### React avancé

- Context API pour state global
- Custom hooks réutilisables
- useCallback et useMemo pour optimisation
- Gestion d'état complexe avec useState/useEffect

### TypeScript

- Type safety stricte
- Interfaces et types génériques
- Type guards et narrowing
- Configuration tsconfig rigoureuse

### Next.js

- API Routes pour backend
- Page Router
- SSR considerations
- Hot reload et Fast Refresh

### Testing

- Unit tests avec Jest
- Component tests avec RTL
- Mocking (Socket.io, localStorage)
- Coverage reporting

### UX/UI

- Animations performantes (Framer Motion)
- Feedback utilisateur immédiat
- États de chargement/erreur
- Design responsive

---

## 📝 Scripts npm

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

**Usage:**

```bash
# Développement
npm run dev

# Production build
npm run build
npm start

# Tests
npm test
npm run test:watch
npm run test:coverage

# Linting
npm run lint
```

---

## 🎉 Conclusion

Ce projet démontre une architecture moderne et scalable pour un jeu multijoueur temps réel avec :

- **Communication bidirectionnelle** via Socket.io
- **State management** robuste avec React
- **Type safety** complète avec TypeScript
- **Tests** unitaires et de composants
- **Animations** fluides et engageantes
- **Persistance** locale des données
- **UX** soignée avec feedback immédiat

Le code est modulaire, testable, et prêt pour des extensions futures comme l'authentification, le backend database, ou le mode mobile.

---

**Auteur:** Projet développé avec Next.js 16, React 19, Socket.io 4.8, et TypeScript 5  
**Date:** Novembre 2025  
**Licence:** MIT
