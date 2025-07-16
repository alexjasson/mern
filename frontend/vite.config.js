import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config({ override: true, path: '../.env', quiet: true });

export default defineConfig({
  plugins: [
    react(),
    {
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          if (!process.env.CLIENT_HOST || !process.env.CLIENT_PORT) {
            throw new Error('CLIENT_HOST and CLIENT_PORT environment variables must be defined');
          }
          const host = process.env.CLIENT_HOST;
          const port = process.env.CLIENT_PORT;
          console.log(`Client running at: http://${host}:${port}`);
        });
      },
    },
  ],
  logLevel: 'error',
})
