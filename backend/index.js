import { connectDB } from './db/connectDB.js';
import { getServerUrl } from './utils/getServerUrl.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import cookieParser from 'cookie-parser';

// Setup the server
const app = express();
const { host, port } = getServerUrl();
app.use((req, res, next) => {
    console.log(`Received ${req.method} request to: ${req.url}`);
    const originalSend = res.send;
    res.send = function(data) {
        const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for 4xx/5xx, Green for others
        const resetColor = '\x1b[0m';
        console.log(`Sent response for ${req.method} ${req.url} - Status: ${statusColor}${res.statusCode}${resetColor}`);
        return originalSend.call(this, data);
    };
    
    next();
});
app.use(cors({ origin: `${host}:${port}` }));
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);

// Start the server
app.listen(port, async () => {
    await connectDB();
    console.log(`  \x1b[32m➜\x1b[0m  \x1b[1mServer:\x1b[0m   \x1b[36mhttp://${host}:\x1b[1m${port}\x1b[0m\x1b[36m/\x1b[0m`);
});


