import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve path for ES Module
const __filepath: string = fileURLToPath(import.meta.url);
const __dirname: string = path.dirname(__filepath);
const clientDistDir: string = path.resolve(__dirname, '../../client/dist');

// Initialize router
const router: Router = Router();

// Serve client dist HTML file
router.get('*', (req: Request, res: Response, next: NextFunction) => {
	res.status(200).sendFile(path.resolve(clientDistDir, 'index.html'), (error: Error) => {
		// Handle not found error
		if (error) return next();
	});
});

// Export router
export default router;
