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
- Classic mode is available; the co-op mode shown in the codebase is not yet enabled.

## Deploying to Vercel

The `build` branch contains a Vercel-ready deployment configuration. Vercel
builds the Vue application from `apps/web`, serves the WebSocket game server at
`/api/ws`, and sends `/lobby/*` URLs back to the Vue router.

1. Push the `build` branch to GitHub.
2. Import the repository into Vercel and leave the project root at the repository root.
3. Set **Production Branch** to `build` in Vercel's Git settings.
4. Enable Fluid Compute for the project if it is not already enabled.
5. Deploy. No environment variables are required for a same-domain deployment.

Production clients automatically connect to `wss://<deployment-domain>/api/ws`.
For a separately hosted game server, set `VITE_WEBSOCKET_URL` to its secure
WebSocket URL before building.

Vercel WebSockets currently run on Functions and therefore have a maximum
connection duration. Rooms are held in memory, so this setup is intended for
playtests and small releases. A larger production deployment should persist room
state in Redis so multiple Function instances can share rooms.

## Production build

```bash
npm run build
```

Build output is written to each app's `dist` directory. Vercel deployment behavior is configured in `vercel.json`.
