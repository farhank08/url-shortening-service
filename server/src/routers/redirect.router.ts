import chalk from 'chalk';
import { Router, Request, Response, NextFunction } from 'express';
import UrlModel from '../models/url.model.js';
import { normalize } from '../services/url.services.js';

// Initialize router instance
const router: Router = Router();

// Redirect using short code
router.get('/:shortCode', async (req: Request, res: Response, next: NextFunction) => {
	// Handle missing short code
	const shortCode: string | undefined = req.params.shortCode;
	if (!shortCode) {
		console.warn(
			`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
				req.originalUrl
			} ${chalk.redBright('failed')} : Missing short code in request params`
		);
		return res.status(400).json({
			success: false,
			message: 'Missing short code',
		});
	}

	let originalUrl: string | null;
	try {
		// Retrieve original URL from database
		originalUrl = await UrlModel.findOne({ shortCode }).select('url').lean();

		// Handle original URL not found
		if (!originalUrl) {
			console.warn(
				`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(
					req.method
				)} ${req.originalUrl} ${chalk.redBright('failed')} : Original URL not found`
			);
			return res.status(404).json({
				success: false,
				message: 'Orginal URL not found',
			});
		}
	} catch (error: unknown) {
		// Handle database query error
		console.error(
			`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
				req.originalUrl
			} ${chalk.redBright('failed')} : ${
				error instanceof Error ? error.message : 'Unhandled error'
			}`
		);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
		});
	}

	// Normalize original URL
	const normalizedUrl: string = normalize(originalUrl);

	// Redirect to original URL
	console.log(
		`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
			req.originalUrl
		} ${chalk.greenBright('succeded')} : Redirected to ${normalizedUrl}`
	);
	return res.redirect(301, normalizedUrl);
});

// Return router
export default router;
