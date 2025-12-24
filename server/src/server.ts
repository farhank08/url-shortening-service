import cors from 'cors';
import express, { Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ApiRouter from './routers/apiRouter.js';
import RedirectRouter from './routers/redirectRouter.js';
import UnhandledRouteHandler from './routers/unhandledRouter.js';
import ViewRouter from './routers/viewRouter.js';

// Resolve path for ES Module
const __filepath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filepath);
const clientDistDir = path.resolve(__dirname, '../../client/dist');

export const createServer = (): Express => {
	// Initialize server
	const app = express();

	// Enable cross-origin requests
	app.use(cors());

	// Parse JSON responses
	app.use(express.json());

	// Serve static files
	app.use(express.static(clientDistDir));

	// Handle API routes
	app.use('/api', ApiRouter);

	// Handle redirect routes
	app.use('/:shortCode', RedirectRouter);

	// Handle view routes
	app.use(ViewRouter);

	// Handled unhandled routes
	app.use(UnhandledRouteHandler);

	return app;
};
