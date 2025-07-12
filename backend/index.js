import db from './Database.js';
import server from './Server.js';

// Initialize database connection
await db.connect();

// Start the server
await server.start();