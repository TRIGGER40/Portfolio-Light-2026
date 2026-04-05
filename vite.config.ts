import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    // Serve /videos/ folder with correct MIME types (Vite 6 static-serve workaround)
    {
      name: 'serve-videos',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url?.startsWith('/VIDEOS/')) return next();
          const filePath = path.join(__dirname, 'public', req.url.split('?')[0]);
          if (!fs.existsSync(filePath)) return next();
          const ext = path.extname(filePath).toLowerCase();
          const mime: Record<string, string> = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.ogg': 'video/ogg' };
          const contentType = mime[ext] || 'application/octet-stream';
          const stat = fs.statSync(filePath);
          res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': stat.size,
            'Cache-Control': 'public, max-age=86400',
            'Accept-Ranges': 'bytes',
          });
          fs.createReadStream(filePath).pipe(res);
        });
      },
    },
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
