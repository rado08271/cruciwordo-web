# SpacetimeDB Client Integration with React

This document describes how the SpacetimeDB client functions and integrates within a React application through the use of hooks. This guide will help you understand the data flow, setup, and best practices for using SpacetimeDB in your React project.

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Connection Configuration](#connection-configuration)
5. [SpacetimeDBProvider Setup](#spacetimedbprovider-setup)
6. [SSR with React Router v7](#ssr-with-react-router-v7)
7. [Using Hooks](#using-hooks)
8. [Working with Reducers](#working-with-reducers)
9. [Querying Tables](#querying-tables)
10. [Type Inference](#type-inference)
11. [OIDC Authentication](#oidc-authentication)
12. [SpacetimeDB Type Mappings](#spacetimedb-type-mappings)
13. [Best Practices](#best-practices)

## Core Concepts

SpacetimeDB is a real-time database that enables you to build multiplayer and collaborative applications. The client library provides:

- **Real-time data synchronization**: Automatic updates when data changes on the server
- **Type-safe bindings**: Generated TypeScript types from your database schema
- **React hooks**: Easy integration with React components
- **Reducers**: Server-side functions that modify data
- **Tables**: Reactive data stores that automatically update your UI

### Lifecycle

1. **Generate bindings**: Run `spacetime bridge` to generate TypeScript client code from your SpacetimeDB module
2. **Initialize connection**: Configure and create a database connection
3. **Wrap app with provider**: Use `SpacetimeDBProvider` to make the connection available to your app
4. **Use hooks**: Access data and call reducers using React hooks
5. **Real-time updates**: Your components automatically re-render when data changes

## Prerequisites

Before integrating SpacetimeDB, you must:

1. Have a SpacetimeDB module deployed and running
2. Generate client bindings using the SpacetimeDB CLI:

```bash
spacetime bridge generate --out-dir ./app/spacetime_bridge --lang typescript
```

This generates TypeScript files in your specified output directory with type-safe bindings for your tables, reducers, and types.

## Initial Setup

Install the SpacetimeDB client library:

```bash
npm install spacetimedb
```

The library provides:
- Core connection management
- React hooks (`spacetimedb/react`)
- Type utilities for TypeScript

## Connection Configuration

### Basic Connection

Create a connection builder to configure your SpacetimeDB connection. This is typically done at the root of your application:

```typescript
import { DbConnection } from './spacetime_bridge';

const connectionBuilder = DbConnection.builder()
  .withUri('ws://localhost:3000')
  .withModuleName('cruciwordo')
  .onConnect((conn, identity, token) => {
    console.log('Connected with identity:', identity);
    // Store token for future connections
    sessionStorage.setItem('auth_token', token);
  })
  .onDisconnect(() => {
    console.log('Disconnected from SpacetimeDB');
  })
  .onConnectError((error) => {
    console.error('Connection error:', error);
  });
```

### Connection with Authentication

To persist user identity across sessions, use `localStorage` for identity and `sessionStorage` for the session token:

```typescript
import { DbConnection } from './spacetime_bridge';

const connectionBuilder = DbConnection.builder()
  .withUri('ws://localhost:3000')
  .withModuleName('cruciwordo')
  .withToken(sessionStorage.getItem('auth_token') || undefined)
  .onConnect((conn, identity, token) => {
    // Store identity permanently
    localStorage.setItem('user_identity', identity.toHexString());
    // Store token for this session
    sessionStorage.setItem('auth_token', token);
  })
  .onDisconnect(() => {
    // Clean up session token on disconnect
    sessionStorage.removeItem('auth_token');
  })
  .onConnectError((error) => {
    console.error('Failed to connect:', error);
  });
```

**Storage Strategy:**
- `localStorage`: Use for long-term data like user identity (persists across browser sessions)
- `sessionStorage`: Use for temporary data like authentication tokens (cleared when tab closes)

## SpacetimeDBProvider Setup

Wrap your application (or the part that needs database access) with the `SpacetimeDBProvider`:

```typescript
import { SpacetimeDBProvider } from 'spacetimedb/react';
import { DbConnection } from './spacetime_bridge';

function Root() {
  const connectionBuilder = DbConnection.builder()
    .withUri('ws://localhost:3000')
    .withModuleName('cruciwordo')
    .withToken(sessionStorage.getItem('auth_token') || undefined)
    .onConnect(console.log)
    .onDisconnect(console.log)
    .onConnectError(console.log);

  return (
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <App />
    </SpacetimeDBProvider>
  );
}
```

The provider:
- Establishes the database connection
- Makes the connection available to all child components via hooks
- Manages connection lifecycle and reconnection

## SSR with React Router v7

When using SpacetimeDB with React Router v7 (or other SSR frameworks), you need to handle both server-side data fetching and client-side real-time updates.

### Key Concepts

**Two Data Paths:**
1. **Server-side (SSR)**: Use HTTP API for initial data in loaders (for SEO, OpenGraph meta tags)
2. **Client-side**: Use WebSocket connection for real-time updates after hydration

**Provider Placement:**
- Place `SpacetimeDBProvider` in **route components**, not in `root.tsx` Layout
- The Layout runs on both server and client, but WebSocket connections only work client-side
- Routes are client-side only, making them safe for the provider

### Server-Side Data Fetching (Loaders)

Use the HTTP API with SQL queries in loaders to fetch data for SSR and metadata:

```typescript
// app/service/api.ts
import { Identity, Timestamp, type Infer } from "spacetimedb";

/**
 * Execute a SQL query against SpacetimeDB HTTP API
 * Use this in loaders for SSR data fetching
 */
export const ssql = async <T = any>(sql: string): Promise<T[]> => {
  // Generate temporary identity for the request
  const identityResponse = await fetch(
    `http://localhost:3000/v1/identity`,
    { method: "POST" }
  );
  
  if (!identityResponse.ok) {
    throw new Error("Could not generate identity");
  }
  
  const { identity, token } = await identityResponse.json();
  
  // Execute SQL query
  const sqlResponse = await fetch(
    `http://localhost:3000/v1/database/cruciwordo/sql`,
    { 
      method: "POST", 
      headers: { "Authorization": `Bearer ${token}` },
      body: sql
    }
  );
  
  if (!sqlResponse.ok) {
    throw new Error("Could not process your request");
  }
  
  const responseJson = await sqlResponse.json();
  
  // Parse SATS-JSON response (implementation details omitted)
  return parseSatsJsonResponse<T>(responseJson);
};
```

### Example: Route with Loader and Provider

Here's how to structure a route that fetches data server-side and enables real-time updates client-side:

```typescript
// app/routes/play.tsx
import { data } from "react-router";
import { SpacetimeDBProvider, useTable, where, eq } from "spacetimedb/react";
import { DbConnection, BoardDatabaseModel, WordPlacementsDatabaseModel } from "~/spacetime_bridge";
import { ssql } from "~/service/api";
import type { Route } from "./+types/play";
import type { Infer } from "spacetimedb";

// Loader runs on server - use HTTP API for SSR
export async function loader({ params }: Route.LoaderArgs) {
  const boardId = params.boardId;
  
  try {
    // Fetch data via HTTP for SSR and metadata
    const boards = await ssql<Infer<typeof BoardDatabaseModel>>(
      `SELECT * FROM board WHERE id = '${boardId}'`
    );
    const words = await ssql<Infer<typeof WordPlacementsDatabaseModel>>(
      `SELECT * FROM word WHERE board_id = '${boardId}'`
    );
    
    return { 
      boardModel: boards[0], 
      wordsModel: words 
    };
  } catch (e: any) {
    throw data(e.message, { status: 404 });
  }
}

// Meta function for OpenGraph tags - uses loader data
export function meta({ matches }: Route.MetaArgs) {
  const { boardModel, wordsModel } = matches
    .find((route) => route.id === 'routes/play')
    ?.loaderData as LoaderDataType;
  
  if (!boardModel || !wordsModel) return [];
  
  return [
    { title: `Play ${boardModel.rows}x${boardModel.cols} Puzzle | Cruciwordo` },
    { 
      name: "description", 
      content: `Join a ${boardModel.rows}x${boardModel.cols} puzzle with ${wordsModel.length} words.` 
    },
    { property: "og:title", content: `Play Puzzle | Cruciwordo` },
    { property: "og:description", content: "Collaborate in real-time to find words!" },
    { property: "og:image", content: `https://cruciwordo.com/og-image.jpg` },
  ];
}

// Component runs on client - use WebSocket for real-time updates
export default function Play({ params, loaderData }: Route.ComponentProps) {
  const boardId = params.boardId;
  
  // Create connection builder (client-side only)
  const connectionBuilder = DbConnection.builder()
    .withUri('ws://localhost:3000')
    .withModuleName('cruciwordo')
    .withToken(sessionStorage.getItem('auth_token') || undefined)
    .onConnect((conn, identity, token) => {
      sessionStorage.setItem('auth_token', token);
    })
    .onDisconnect(() => {
      console.log('Disconnected');
    })
    .onConnectError((error) => {
      console.error('Connection error:', error);
    });
  
  return (
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <PlayLayout boardId={boardId} initialData={loaderData} />
    </SpacetimeDBProvider>
  );
}

// Child component uses hooks for real-time updates
function PlayLayout({ boardId, initialData }) {
  // Subscribe to real-time table updates
  const [boards, isLoaded] = useTable(
    'board',
    where(eq('id', boardId))
  );
  
  const [words] = useTable(
    'word',
    where(eq('boardId', boardId))
  );
  
  // Use initialData from loader while connecting
  const board = boards.find(b => b.id === boardId) || initialData.boardModel;
  const currentWords = words.length > 0 ? words : initialData.wordsModel;
  
  if (!board) {
    return <div>Loading board...</div>;
  }
  
  return (
    <div>
      <h1>Board: {board.rows}x{board.cols}</h1>
      <p>Words found: {currentWords.filter(w => w.found).length}/{currentWords.length}</p>
      {/* Real-time game UI */}
    </div>
  );
}
```

### Provider Placement Guidelines

**✅ DO: Place in route components**
```typescript
// app/routes/game.tsx
export default function Game() {
  const connectionBuilder = DbConnection.builder()...;
  
  return (
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <GameContent />
    </SpacetimeDBProvider>
  );
}
```

**❌ DON'T: Place in root Layout**
```typescript
// app/root.tsx - AVOID THIS
export function Layout({ children }) {
  // This runs on server and client - WebSocket won't work on server
  return (
    <html>
      <body>
        <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
          {children}
        </SpacetimeDBProvider>
      </body>
    </html>
  );
}
```

### Handling Client-Only Code

If you need the provider at a higher level, use client-only guards:

```typescript
// app/routes/home.tsx
export default function Home() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const connectionBuilder = DbConnection.builder()
    .withUri('ws://localhost:3000')
    .withModuleName('cruciwordo')
    .onConnect(console.log);
  
  // Don't render provider until we're on the client
  if (!isClient) {
    return <div>Loading...</div>;
  }
  
  return (
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <HomeContent />
    </SpacetimeDBProvider>
  );
}
```

### Best Practices for SSR

1. **Use loaders for SEO-critical data**: OpenGraph tags, initial page content
2. **Use WebSocket for real-time updates**: Live game state, multiplayer interactions
3. **Provide fallback data**: Show loader data while WebSocket connects
4. **Handle hydration mismatches**: Ensure server HTML matches client initial render
5. **Guard WebSocket code**: Only create connections client-side
6. **Cache loader data**: React Router caches loader results automatically

### Performance Considerations

- **Initial page load**: Fast because loader data is included in SSR HTML
- **Real-time updates**: Seamless after WebSocket connects
- **SEO-friendly**: Search engines see complete data from loaders
- **Progressive enhancement**: App works even if WebSocket fails (falls back to loader data)

## Using Hooks

### Getting Connection and Identity

Use the `useSpacetimeDB` hook to access the connection and identity:

```typescript
import { useSpacetimeDB } from 'spacetimedb/react';
import type { DbConnection } from './spacetime_bridge';

function MyComponent() {
  const conn = useSpacetimeDB<DbConnection>();
  const { identity, isActive: connected } = conn;

  if (!connected) {
    return <div>Connecting to database...</div>;
  }

  return (
    <div>
      <p>Connected as: {identity.toHexString()}</p>
      <p>Status: {connected ? 'Online' : 'Offline'}</p>
    </div>
  );
}
```

**Available properties:**
- `identity`: The user's unique Identity object
- `isActive`: Boolean indicating if the connection is active
- `getConnection()`: Returns the raw DbConnection instance

## Working with Reducers

Reducers are server-side functions that modify data. Use the `useReducer` hook to call them:

```typescript
import { useReducer } from 'spacetimedb/react';
import { reducers } from './spacetime_bridge';

function GameComponent({ boardId }: { boardId: string }) {
  const joinGame = useReducer(reducers.joinGame);
  const saveWord = useReducer(reducers.saveWord);
  const finishGame = useReducer(reducers.finishGame);

  const handleJoinGame = async () => {
    try {
      await joinGame(boardId);
      console.log('Joined game successfully');
    } catch (error) {
      console.error('Failed to join game:', error);
    }
  };

  const handleSaveWord = async (word: string, x: number, y: number) => {
    try {
      await saveWord(boardId, word, x, y);
      console.log('Word saved');
    } catch (error) {
      console.error('Failed to save word:', error);
    }
  };

  return (
    <div>
      <button onClick={handleJoinGame}>Join Game</button>
      <button onClick={() => handleSaveWord('HELLO', 0, 0)}>Save Word</button>
    </div>
  );
}
```

**Key points:**
- Reducers return Promises
- Always handle errors appropriately
- Reducer calls are automatically sent to the server
- The UI updates automatically when the reducer completes

## Querying Tables

Use the `useTable` hook to subscribe to table data with optional filtering:

### Basic Table Query

```typescript
import { useTable } from 'spacetimedb/react';
import { tables } from './spacetime_bridge';

function BoardList() {
  const [boards, isLoaded] = useTable(tables.board);

  if (!isLoaded) {
    return <div>Loading boards...</div>;
  }

  return (
    <ul>
      {boards.map(board => (
        <li key={board.id}>{board.name}</li>
      ))}
    </ul>
  );
}
```

### Filtered Table Query

Use `where` and comparison operators to filter data:

```typescript
import { useTable, where, eq } from 'spacetimedb/react';
import { tables, type DbConnection } from './spacetime_bridge';
import type { GameSessionRow } from './spacetime_bridge';

function ActiveGames({ boardId }: { boardId: string }) {
  // Filter for a specific board
  const [games] = useTable<DbConnection, GameSessionRow>(
    tables.gameSession,
    where(eq('boardId', boardId))
  );

  return (
    <div>
      <h3>Active Games: {games.length}</h3>
      <ul>
        {games.map(game => (
          <li key={game.id}>
            Player: {game.playedBy.toHexString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Multiple Filter Conditions

```typescript
import { useTable, where, eq, and } from 'spacetimedb/react';
import { tables } from './spacetime_bridge';

function OnlineUsers() {
  const [onlineUsers] = useTable(
    tables.user,
    where(
      and(
        eq('online', true),
        eq('status', 'active')
      )
    )
  );

  return <div>Online users: {onlineUsers.length}</div>;
}
```

**Filter operators:**
- `eq(field, value)`: Equality comparison
- `and(...conditions)`: Logical AND
- `or(...conditions)`: Logical OR

## Type Inference

SpacetimeDB generates TypeScript types from your database schema. Use the `Infer` utility type to extract types from generated models:

```typescript
import type { Infer } from 'spacetimedb';
import { BoardDatabaseModel, WordPlacementsDatabaseModel } from './spacetime_bridge';

// Infer the type from the database model
type Board = Infer<typeof BoardDatabaseModel>;
type WordPlacement = Infer<typeof WordPlacementsDatabaseModel>;

// Use in your components
function BoardViewer({ board }: { board: Board }) {
  return (
    <div>
      <h2>{board.name}</h2>
      <p>Size: {board.rows} x {board.cols}</p>
      <p>Created by: {board.createdBy.toHexString()}</p>
    </div>
  );
}

// Use in loaders or API functions
async function loadBoard(boardId: string): Promise<Board | null> {
  const boards = await ssql<Board>(`SELECT * FROM board WHERE id = '${boardId}'`);
  return boards[0] || null;
}
```

**Benefits:**
- Type safety throughout your application
- Auto-completion in your IDE
- Compile-time error checking
- Refactoring support

## OIDC Authentication

For production applications, integrate OpenID Connect (OIDC) authentication:

```typescript
import { AuthProvider, useAuth } from 'react-oidc-context';
import { SpacetimeDBProvider } from 'spacetimedb/react';
import { DbConnection } from './spacetime_bridge';

function Root() {
  const oidcConfig = {
    authority: 'https://auth.spacetimedb.com/oidc',
    client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
    redirect_uri: `${window.location.origin}/callback`, // Where the user is redirected after login
    post_logout_redirect_uri: window.location.origin, // Where the user is redirected after logout
    scope: 'openid profile email',
    response_type: 'code',
    automaticSilentRenew: true,
  };
  
  function onSigninCallback() {
    // Clean up the URL after sign-in
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  return (
    <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
      <App />
    </AuthProvider>
  );
}

function App() {
  const auth = useAuth();

  // Automatically sign in the user
  useAutoSignin();

  if (auth.isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (auth.error) {
    return <div>Authentication error: {auth.error.message}</div>;
  }

  if (!auth.isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  // Configure SpacetimeDB with OIDC token
  const connectionBuilder = DbConnection.builder()
    .withUri('wss://your-spacetime-instance.com')
    .withModuleName('your-module')
    .withToken(auth.user?.access_token)
    .onConnect(console.log)
    .onDisconnect(console.log)
    .onConnectError(console.log);

  return (
    <SpacetimeDBProvider connectionBuilder={connectionBuilder}>
      <div className="App">
        <header>
          Welcome, {auth.user?.profile.name} (id: {auth.user?.profile.sub})!
          <button onClick={() => auth.signoutRedirect()}>Sign Out</button>
        </header>
        <MainApp />
      </div>
    </SpacetimeDBProvider>
  );
}
```

**OIDC Integration Steps:**
1. Install `react-oidc-context`: `npm install react-oidc-context`
2. Configure your OIDC provider settings
3. Wrap your app with `AuthProvider`
4. Use `useAuth()` hook to access authentication state
5. Pass OIDC token to SpacetimeDB connection

## SpacetimeDB Type Mappings

SpacetimeDB uses SATS (Spacetime Algebraic Type System) which maps to TypeScript and Rust types:

### Special Types

| SpacetimeDB | TypeScript | Rust | Description |
|-------------|------------|------|-------------|
| `Identity` | `Identity` | `Identity` | Unique user identifier |
| `Timestamp` | `Timestamp` | `Timestamp` | Microseconds since Unix epoch |
| `Vec<T>` | `T[]` | `Vec<T>` | Array/List of type T |
| `Option<T>` | `T \| null` | `Option<T>` | Optional value |

### Complex Types

```typescript
// Product type (struct/object)
interface GameSession {
  id: bigint;           // U64
  boardId: string;      // String
  playedBy: Identity;   // Identity
  startedAt: Timestamp; // Timestamp
  score: number;        // U32
}

// Array type
const words: string[] = ['HELLO', 'WORLD'];

// Optional type
const message: string | null = null;
```

### Working with Special Types

```typescript
import { Identity, Timestamp } from 'spacetimedb';

// Identity
const identity = Identity.fromString('hex-string-here');
console.log(identity.toHexString());
console.log(identity.isEqual(otherIdentity));

// Timestamp
const timestamp = new Timestamp(BigInt(Date.now() * 1000)); // microseconds
console.log(timestamp.toDate());

// BigInt (for I64/U64)
const largeNumber: bigint = 9007199254740991n;
```

## Best Practices

### 1. Connection Management

- Create the connection builder once at the application root
- Reuse the same connection throughout your app
- Store tokens in `sessionStorage`, identities in `localStorage`
- Always handle connection errors gracefully

### 2. Type Safety

- Always use the `Infer` utility for extracting types
- Avoid using `any` types
- Let TypeScript catch errors at compile time

```typescript
// Good
type Board = Infer<typeof BoardDatabaseModel>;
function updateBoard(board: Board) { /* ... */ }

// Avoid
function updateBoard(board: any) { /* ... */ }
```

### 3. Error Handling

- Always wrap reducer calls in try-catch blocks
- Provide user feedback for errors
- Log errors for debugging

```typescript
const saveWord = useReducer(reducers.saveWord);

const handleSave = async () => {
  try {
    await saveWord(boardId, word);
    setMessage('Word saved successfully');
  } catch (error) {
    console.error('Save failed:', error);
    setMessage('Failed to save word');
  }
};
```

### 4. Performance

- Use filters (`where`) to limit data fetching
- Only subscribe to tables you need
- Consider using `useMemo` for expensive computations on table data

```typescript
const [boards] = useTable(tables.board, where(eq('active', true)));

const sortedBoards = useMemo(() => {
  return [...boards].sort((a, b) => b.createdAt - a.createdAt);
}, [boards]);
```

### 5. Code Organization

Organize your SpacetimeDB integration:

```
app/
├── spacetime_bridge/          # Generated files (do not edit)
│   ├── index.ts
│   ├── board_table.ts
│   └── ...
├── hooks/
│   ├── useGameSession.ts      # Custom hooks wrapping SpacetimeDB hooks
│   └── useBoard.ts
└── service/
    └── api.ts                 # API utilities (SSQL queries, etc.)
```

### 6. Testing

- Mock the SpacetimeDB connection in tests
- Test reducer error handling
- Test component behavior with different connection states

### 7. Bridge Generation

Always regenerate bindings when your database schema changes:

```bash
# After updating your SpacetimeDB module
spacetime bridge generate --out-dir ./app/spacetime_bridge --lang typescript
```

Add this to your development workflow or CI/CD pipeline.

## Summary

SpacetimeDB provides a powerful way to build real-time, multiplayer React applications:

1. **Generate bindings** with `spacetime bridge`
2. **Configure connection** with authentication and error handling
3. **Wrap your app** with `SpacetimeDBProvider`
4. **Use hooks** to access data and call reducers
5. **Leverage TypeScript** for type safety throughout
6. **Follow best practices** for maintainable code

For more information, visit:
- [SpacetimeDB Documentation](https://spacetimedb.com/docs)
- [SpacetimeDB GitHub](https://github.com/clockworklabs/SpacetimeDB)
- [Example Applications](https://github.com/clockworklabs/SpacetimeDB/tree/master/examples)
