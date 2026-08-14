import { createServer } from 'node:http'
import { WebSocketServer } from 'ws'
import { attachGameSocketServer } from '../apps/server/src/websocket/socketServer.js'

const server = createServer((_request, response) => {
  response.writeHead(200, { 'content-type': 'application/json' })
  response.end(JSON.stringify({ service: 'odd-prompt-websocket', status: 'ok' }))
})

const webSocketServer = new WebSocketServer({ server })
attachGameSocketServer(webSocketServer)

export default server
