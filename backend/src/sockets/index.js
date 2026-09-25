import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { verifyToken } from '../utils/token.js';


// A minimal cookie-header parser: turns "a=1; b=2" into { a: '1', b: '2' }.
// Written by hand instead of using the 'cookie' npm package, which had
// inconsistent ESM/CommonJS export behavior across versions.
function parseCookieHeader(header) {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((pair) => {
      const [key, ...rest] = pair.trim().split('=');
      return [key, decodeURIComponent(rest.join('='))];
    })
  );
}


let io;


export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
  });


  io.use((socket, next) => {
    const cookies = parseCookieHeader(socket.handshake.headers.cookie);
    const token = cookies[env.COOKIE_NAME];
    if (!token) return next(new Error('Unauthorized'));


    try {
      const payload = verifyToken(token);
      socket.userId = payload.sub;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });


  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);
    console.log(`[devnexa] socket connected: user ${socket.userId}`);


    socket.on('disconnect', () => {
      console.log(`[devnexa] socket disconnected: user ${socket.userId}`);
    });
  });


  return io;
}


export function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized — call initSocket(httpServer) first');
  }
  return io;
}