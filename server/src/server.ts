import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ApiRouter from './routers/api.router.js';
import RedirectRouter from './routers/redirect.router.js';
import UnhandledRouteHandler from './routers/unhandled.router.js';
import ViewRouter from './routers/view.router.js';

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

	// Handle auto favicon browser request
	app.get('/favicon.ico', (req: Request, res: Response) => {
		return res.status(204);
	});

	// Handle API routes
	app.use('/api', ApiRouter);

	// Handle redirect routes
	app.use(RedirectRouter);

	// Handle view routes
	app.use(ViewRouter);

	// Handled unhandled routes
	app.use(UnhandledRouteHandler);

	return app;
};
