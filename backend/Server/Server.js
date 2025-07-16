import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ override: true, path: '../.env', quiet: true });

class Server {
  constructor() {
    const { SERVER_HOST, SERVER_PORT } = process.env;
    if (!SERVER_HOST || !SERVER_PORT) {
      throw new Error('SERVER_HOST and SERVER_PORT environment variables must be defined');
    }

    this.host = SERVER_HOST;
    this.port = SERVER_PORT;
    this.app = express();
    this._setupMiddleware();
    this._setupRoutes();
  }

  _setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  _setupRoutes() {
    this.app.get('/api', (req, res) => {
      res.json({ message: 'Server is working!' });
    });
  }

  async start() {
    try {
      // Start HTTP server
      this.app.listen(this.port, this.host, () => {
        console.log(`Server listening at: http://${this.host}:${this.port}`);
      });
    } catch (err) {
      console.error('Failed to start server:', err.message);
      process.exit(1);
    }
  }
}

export default new Server();
