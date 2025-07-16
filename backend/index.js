import db from './Database/Database.js';
import server from './Server/Server.js';

// Initialize database connection
await db.connect();

// Start the server
await server.start();