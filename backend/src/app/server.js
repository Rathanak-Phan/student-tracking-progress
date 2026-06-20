import dotenv from "dotenv";
dotenv.config({ override: true });

import app from "./app.js";
import { initSocket } from "./socket.js";
import { initializeDatabase } from "../database/index.js";

const port = process.env.PORT || 5002;
console.log(`Attempting to start server on port: ${port}`);

const startServer = async () => {
    try {
        await initializeDatabase();
        
        const server = app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });

        // Initialize Socket.io
        initSocket(server);

        server.on('error', (error) => {
            console.error("Server error:", error);
        });

        server.on('close', () => {
            console.log("Server closed");
        });
    } catch (error) {
        console.error("Failed to initialize:", error);
        process.exit(1);
    }
};

startServer();
