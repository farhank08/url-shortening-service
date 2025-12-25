import chalk from 'chalk';
import { Router, Request, Response, NextFunction } from 'express';
import UrlModel, { UrlDocument } from '../models/url.model.js';
import * as UrlServices from '../services/url.services.js';

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
		// Retrieve original URL record from database
		const filter = { shortCode };
		const record: UrlDocument | null = await UrlModel.findOne(filter).lean();

		// Handle record not found
		if (!record) {
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

		// Normalize original URL
		originalUrl = UrlServices.normalize(record.url);

		// TODO: Update stats for record
		const update = {
			$inc: { 'stats.accessCount': 1 },
			$set: { 'stats.lastAccessed': new Date() },
		};
		const options = { new: true };
		const updatedRecord: UrlDocument = await UrlModel.findOneAndUpdate(
			filter,
			update,
			options
		).lean();
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

	// Redirect to original URL
	console.log(
		`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
			req.originalUrl
		} ${chalk.greenBright('succeded')} : Redirected to ${originalUrl}`
	);
	return res.redirect(302, originalUrl);
});

// Return router
export default router;
