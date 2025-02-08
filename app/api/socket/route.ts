import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

const wss = new WebSocketServer({ noServer: true });
const users = new Map<string, WebSocket>();

wss.on('connection', (ws: WebSocket, request) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  const userId = url.searchParams.get('userId'); // Extract userId from query params

  if (!userId) return ws.close();

  users.set(userId, ws);

  ws.on('message', (message) => {
    try {
      const { to, content, adId } = JSON.parse(message.toString());
      const recipientWs = users.get(to);

      // Send message to recipient if they're online
      if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(JSON.stringify({ from: userId, content, adId }));
      }

      // Save message to Laravel backend
      fetch(`${process.env.LARAVEL_API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: userId, to, content, ad_id: adId }),
      });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    users.delete(userId);
  });
});

// Attach WebSocket server to Next.js
const server = createServer((req, res) => {
  res.statusCode = 404;
  res.end();
});

server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  if (url.pathname === '/api/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

 

export const GET = () => new Response('WebSocket endpoint', { status: 200 });
