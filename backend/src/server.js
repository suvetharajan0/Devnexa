import http from 'http';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { initSocket } from './sockets/index.js';
import { env } from './config/env.js';

async function main() {
  await connectDB();

  const app = createApp();
  const httpServer = http.createServer(app);

  initSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log(`[devnexa] API server running on port ${env.PORT} (${env.NODE_ENV})`);
  });
}

main().catch((err) => {
  console.error('[devnexa] Fatal startup error:', err);
  process.exit(1);
});
