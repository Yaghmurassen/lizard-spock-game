# Next.js Application with Socket.io

A full-featured Next.js application using Page Router, TypeScript, Tailwind CSS, Socket.io for real-time communication, and comprehensive testing setup.

[text](https://lizard-spock-game-production.up.railway.app/)

## Features

- ✅ **Next.js 16** with Page Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **Socket.io** for real-time WebSocket communication
- ✅ **Jest & React Testing Library** for testing
- ✅ **Custom Hooks** (useSocket, useLocalStorage, useDebounce)
- ✅ **ESLint** configuration

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── ChatComponent.tsx          # Real-time chat component
│   │   └── __tests__/
│   │       └── ChatComponent.test.tsx
│   ├── contexts/
│   │   └── SocketContext.tsx          # Socket.io context provider
│   ├── hooks/
│   │   ├── useSocket.ts               # Socket.io custom hook
│   │   ├── useLocalStorage.ts         # Local storage custom hook
│   │   ├── useDebounce.ts             # Debounce custom hook
│   │   ├── index.ts
│   │   └── __tests__/
│   │       ├── useLocalStorage.test.tsx
│   │       └── useDebounce.test.tsx
│   ├── pages/
│   │   ├── _app.tsx                   # App with SocketProvider
│   │   ├── _document.tsx
│   │   ├── index.tsx                  # Home page with chat
│   │   └── api/
│   │       └── socket.ts              # Socket.io API route
│   └── styles/
│       └── globals.css
├── jest.config.js
├── jest.setup.js
└── package.json
```

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

### Build

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Custom Hooks

### useSocket

Manages Socket.io connection lifecycle:

```typescript
const { socket, isConnected } = useSocket();
```

### useLocalStorage

Persistent state management with localStorage:

```typescript
const [value, setValue] = useLocalStorage("key", initialValue);
```

### useDebounce

Debounces rapidly changing values:

```typescript
const debouncedValue = useDebounce(value, 500);
```

## Socket.io Integration

The application includes a full Socket.io setup:

- **Server**: `/src/pages/api/socket.ts` - Socket.io server endpoint
- **Context**: `/src/contexts/SocketContext.tsx` - Global socket provider
- **Hook**: `/src/hooks/useSocket.ts` - Custom hook for socket access
- **Component**: `/src/components/ChatComponent.tsx` - Example chat implementation

### Using Socket.io

1. The `SocketProvider` wraps the app in `_app.tsx`
2. Use `useSocketContext()` to access socket in any component
3. Emit and listen to events as needed

```typescript
const { socket, isConnected } = useSocketContext();

// Listen for events
socket?.on("message", (data) => console.log(data));

// Emit events
socket?.emit("message", { text: "Hello" });
```

## Testing Strategy

- **Unit Tests**: Custom hooks with isolated test cases
- **Component Tests**: React components with mocked dependencies
- **Integration Tests**: Full component tree with context providers

## Tech Stack

- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Real-time**: Socket.io 4.8
- **Testing**: Jest 30 + React Testing Library 16
- **Linting**: ESLint 9

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
