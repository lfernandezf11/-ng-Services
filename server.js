const http = require('http');

const port = 3000;
const clients = new Set();

let generalCount = 0;
let progress = 0;

function send(res, eventName, payload) {
  if (eventName) {
    res.write(`event: ${eventName}\n`);
  }
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function broadcast(eventName, payload) {
  for (const client of clients) {
    send(client, eventName, payload);
  }
}

setInterval(() => {
  generalCount += 1;
  broadcast('message', {
    message: `Mensaje de texto ${generalCount}`,
    timestamp: new Date().toISOString(),
  });

  progress = progress >= 100 ? 10 : progress + 10;
  broadcast('progress', {
    message: `Progreso al ${progress}%`,
    progress,
    timestamp: new Date().toISOString(),
  });
}, 2000);

http
  .createServer((req, res) => {
    if (req.url !== '/events') {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    clients.add(res);
    send(res, 'message', {
      message: 'Conexión SSE establecida',
      timestamp: new Date().toISOString(),
    });

    req.on('close', () => {
      clients.delete(res);
    });
  })
  .listen(port, () => {
    console.log(`Servidor SSE en http://localhost:${port}/events`);
  });
