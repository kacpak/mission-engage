import { WHITEBOARD_WEBSOCKET_URL } from "./consts.client.ts";



const connect = () => {
  const socket = new WebSocket(WHITEBOARD_WEBSOCKET_URL)

  socket.onopen = () => {
    console.log('[Client] Connected to WS server')
    connected = true
  }

  socket.onmessage = (event: any) => {
    console.log('[Client] Message from server:', event.data)
  }

  socket.onclose = () => {
    connected = false
    console.warn('[Client] Disconnected. Reconnecting in 10s...')
  }

  socket.onerror = (err: any) => {
    connected = false
    console.error('[Client] WebSocket error:', err)
    socket?.close()
  }

  return socket
}

let connected = false

connect()

setInterval(() => {
  if (!connected) {
    console.log('try to reconnect ...')
    connect()
  }
}, 10000)