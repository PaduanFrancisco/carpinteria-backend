// api/index.ts
import { createServer } from 'node:http';
import app from '../src/index.js';

export default function handler(req: any, res: any) {
  const server = createServer(app);
  server.emit('request', req, res);
}
