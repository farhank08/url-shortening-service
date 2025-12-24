import chalk from 'chalk';
import { Router, Request, Response } from 'express';

// Initialize router
const router: Router = Router();

// Handle unhandled routes
router.use((req: Request, res: Response): Response => {
	console.error(
		`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
			req.originalUrl
		} ${chalk.redBright('failed')}: Unhandled route`
	);
	return res.status(404).json({
		success: false,
		message: 'Unhandled route',
	});
});

export default router;
