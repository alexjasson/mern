import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ override: true, path: '../.env', quiet: true });
if (!process.env.PORT || !process.env.HOST) {
    throw new Error("PORT or HOST environment variables are not defined.");
}

const PORT = process.env.PORT;
const HOST = process.env.HOST;
const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api', (req, res) => {
    res.json({ message: "Server is working!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});