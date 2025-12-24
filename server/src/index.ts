import dotenv from 'dotenv';
import { Express } from 'express';
import { Server } from 'http';
import mongoose from 'mongoose';
import { createServer } from './server.js';
import { initDb } from './databases/dbClient.js';

// Load environment variables
dotenv.config();

// Port for server
const PORT = process.env.PORT || 3000;

// Connect to database
try {
	await initDb();
	console.log('MongoDB connection successful');
} catch (error: unknown) {
	// Handle connection failed error
	console.error(
		`MongoDB connection failed: ${
			error && error instanceof Error ? error.message : 'Unhandled error'
		}`
	);

	// Exit with error
	process.exit(1);
}

// Create an express server
const app: Express = createServer();

// Start listening on port
const server: Server = app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

// Manage graceful shutdown
const shutdown = async () => {
	try {
		// Stop accepting new HTTP connections
		if (server.listening) {
			await new Promise<void>((resolve) => {
				server.close(() => {
					console.log('Server shutdown successful');
					resolve();
				});
			});
		}

		// Close MongoDB connection
		if (mongoose.connection.readyState === mongoose.STATES.connected) {
			await mongoose.disconnect();
			console.log('MongoDB disconnection successful');
		}
	} catch (error) {
		// Handle shutdown error
		console.error(`Shutdown error: ${error instanceof Error ? error.message : 'Unhandled error'}`);
	} finally {
		// Exit with success
		process.exit(0);
	}
};

// Assign shutdown callback
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
