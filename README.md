# Odd Prompt

Odd Prompt is a real-time browser party game where most players answer the same prompt while one or more imposters receive a slightly different one. Players compare answers, discuss who seems suspicious, and vote for the odd player.

## How to play

1. One player creates a room and shares its six-character code.
2. Everyone joins from their own browser with a nickname and avatar.
3. The host selects the game settings and starts the round.
4. Each player privately receives a prompt and submits an answer.
5. The room reveals the answers, discusses them, and votes.
6. The results reveal the roles and winning team. The host can then start another round.

## Tech stack

- Vue 3, Pinia, and Vue Router
- Vite and TypeScript
- Node.js WebSocket server using `ws`
- npm workspaces for the web, server, and shared packages

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm 7 or newer

### Install and run

From the repository root:

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The web client connects to the game server over WebSocket on port `3001`.

To test multiplayer locally, open the site in multiple browser windows. Create a room in one window, then use its room code to join from the others.

## Available scripts

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the web app and WebSocket server together |
| `npm run dev:web` | Start only the Vite development server |
| `npm run dev:server` | Start only the WebSocket game server |
| `npm run build` | Type-check and build the web and server workspaces |

The server uses port `3001` by default. Set `PORT` to choose a different starting port:

```powershell
$env:PORT=3002
npm run dev:server
```

If its requested port is occupied, the server automatically tries the next port. The browser client searches ports `3001` through `3005`.

## Project structure

```text
odd-prompt/
|-- apps/
|   |-- server/          # WebSocket server, game phases, and prompt selection
|   `-- web/             # Vue client, screens, components, and state
|-- packages/
|   `-- shared/          # Types and WebSocket event definitions used by both apps
|-- package.json         # Workspace scripts and development dependencies
`-- README.md
```

Prompts live in `apps/server/src/prompts/promptData.ts`. Each prompt is paired with a related odd prompt so imposters can give plausible but revealing answers.

## Current limitations

- Rooms and game state are stored in memory and disappear when the server restarts.
- There is no account system or reconnect persistence.
- The client currently supports local/non-TLS WebSocket connections (`ws://`). A hosted HTTPS deployment will need secure WebSocket (`wss://`) configuration.
- Classic mode is available; the co-op mode shown in the codebase is not yet enabled.

## Production build

```bash
npm run build
```

Build output is written to each app's `dist` directory. The repository does not currently include production hosting or process-manager configuration.
