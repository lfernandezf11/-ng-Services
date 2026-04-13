const http = require('http');
const { WebSocketServer } = require('ws');

const port = 3002;

const server = http.createServer((req, res) => {
  if (req.url !== '/socket') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, service: 'ws-server' }));
});

const wss = new WebSocketServer({ server, path: '/socket' });

let generalCount = 0;
let progress = 0;

function send(ws, message) {
  if (ws.readyState !== ws.OPEN) {
    return;
  }

  ws.send(JSON.stringify(message));
}

function broadcast(message) {
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

function onConnection(ws) {
  console.log('Cliente WS conectado');

  send(ws, {
    type: 'system',
    payload: { text: 'Conexión WebSocket establecida' },
    timestamp: new Date().toISOString(),
  });

  ws.on('message', (rawData) => {
    try {
      const incoming = JSON.parse(rawData.toString());

      if (incoming.type === 'ping') {
        send(ws, {
          type: 'notification',
          payload: { text: 'pong' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      if (!incoming.type) {
        throw new Error('Mensaje sin type');
      }

      broadcast({
        type: incoming.type,
        payload: incoming.payload ?? { text: '' },
        timestamp: incoming.timestamp ?? new Date().toISOString(),
      });
    } catch (error) {
      send(ws, {
        type: 'error',
        payload: { text: 'Mensaje WebSocket inválido' },
        timestamp: new Date().toISOString(),
      });
    }
  });

  ws.on('close', () => {
    console.log('Cliente WS desconectado');
  });
}

wss.on('connection', onConnection);

setInterval(() => {
  generalCount += 1;
  broadcast({
    type: 'general',
    payload: { text: `Mensaje de texto ${generalCount}` },
    timestamp: new Date().toISOString(),
  });
}, 5000);

setInterval(() => {
  progress = progress >= 100 ? 10 : progress + 10;
  broadcast({
    type: 'progress',
    payload: {
      text: `Progreso al ${progress}%`,
      percentage: progress,
    },
    timestamp: new Date().toISOString(),
  });
}, 5000);

server.listen(port, () => {
  console.log(`Servidor WS en ws://localhost:${port}/socket`);
});
