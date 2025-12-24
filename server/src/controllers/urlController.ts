import chalk from 'chalk';
import { Request, Response } from 'express';
import UrlModel, { UrlDocument } from '../models/urlModel.js';
import * as UrlShortener from '../services/urlShortener.js';

// Create short URL
export const createShort = async (req: Request, res: Response): Promise<Response> => {
	// Handle missing url error
	const url: string | undefined = req.body.url;
	if (!url) {
		console.warn(
			`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
				req.originalUrl
			} ${chalk.redBright('failed')} : Missing URL in request body`
		);
		return res.status(400).json({
			success: false,
			message: 'Missing URL in request body',
		});
	}

	// Check for existing URL in databse
	let newShort: UrlDocument;
	try {
		const existingUrl: UrlDocument | null = await UrlModel.findOne({ url }).lean();

		// Handle existing url
		if (existingUrl) {
			console.log(
				`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(
					req.method
				)} ${req.originalUrl} ${chalk.greenBright('succeded')} : URL already exists (reused)`
			);
			return res.status(200).json({
				success: true,
				message: 'URL already exists',
				payload: existingUrl,
			});
		}

		// Generate short code
		const shortCode: string = await UrlShortener.shorten();

		// Create new short in database
		newShort = await UrlModel.create({
			url,
			shortCode,
		});

		// Convert to object
		newShort = newShort.toObject();
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

	// Return with new shortened URL
	console.log(
		`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
			req.originalUrl
		} ${chalk.greenBright('succeded')} : Shortened url created`
	);
	return res.status(201).json({
		success: true,
		message: 'Shortened url created',
		payload: {
			_id: newShort._id,
			url: newShort.url,
			shortCode: newShort.shortCode,
			createdAt: newShort.createdAt,
			updatedAt: newShort.updatedAt,
		},
	});
};

// Get original URL
export const getUrl = async (req: Request, res: Response): Promise<Response> => {
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

	// Retrieve original URL from database
	let originalUrl: UrlDocument | null;
	try {
		originalUrl = await UrlModel.findOne({ shortCode }).lean();

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

	// Return with original url
	console.log(
		`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
			req.originalUrl
		} ${chalk.greenBright('succeded')} : Original URL found`
	);
	return res.status(200).json({
		success: true,
		message: 'Original URL found',
		payload: {
			_id: originalUrl._id,
			url: originalUrl.url,
			shortCode: originalUrl.shortCode,
			createdAt: originalUrl.createdAt,
			updatedAt: originalUrl.updatedAt,
		},
	});
};

// Update short URL
export const updateUrl = async (req: Request, res: Response): Promise<Response> => {
	// Handle missing request body
	const url: string | undefined = req.body.url;
	if (!url) {
		console.warn(
			`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
				req.originalUrl
			} ${chalk.redBright('failed')} : Missing request body`
		);
		return res.status(400).json({
			success: false,
			message: 'Missing request body',
		});
	}

	// Handle missing request params
	const shortCode: string | undefined = req.params.shortCode;
	if (!shortCode) {
		console.warn(
			`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
				req.originalUrl
			} ${chalk.redBright('failed')} : Missing request params`
		);
		return res.status(400).json({
			success: false,
			message: 'Missing request params',
		});
	}

	let updatedUrl: UrlDocument | null;
	try {
		// Define filters and update
		const filter: { shortCode: string } = { shortCode };
		const update: { url: string } = { url };

		// Update original URL
		updatedUrl = await UrlModel.findOneAndUpdate(filter, update, {
			new: true,
		}).lean();

		// Handle short code not found
		if (!updatedUrl) {
			console.warn(
				`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(
					req.method
				)} ${req.originalUrl} ${chalk.redBright('failed')} : Short code not found`
			);
			return res.status(404).json({
				success: false,
				message: 'Short code not found',
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

	// Return with updated URL
	console.log(
		`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
			req.originalUrl
		} ${chalk.greenBright('succeded')} : Original URL updated`
	);
	return res.status(200).json({
		success: true,
		message: 'Original URL updated',
		payload: {
			_id: updatedUrl._id,
			url: updatedUrl.url,
			shortCode: updatedUrl.shortCode,
			createdAt: updatedUrl.createdAt,
			updatedAt: updatedUrl.updatedAt,
		},
	});
};

// Delete short code
export const deleteUrl = async (req: Request, res: Response): Promise<Response> => {
	// Handle missing request params
	const shortCode: string | undefined = req.params.shortCode;
	if (!shortCode) {
		console.warn(
			`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
				req.originalUrl
			} ${chalk.redBright('failed')} : Missing request params`
		);
		return res.status(400).json({
			success: false,
			message: 'Missing request params',
		});
	}

	try {
		// Define filters
		const filter: { shortCode: string } = { shortCode };

		// Find and delete from database
		const deletedUrl: UrlDocument | null = await UrlModel.findOneAndDelete(filter).lean();

		// Handle short code not found
		if (!deletedUrl) {
			console.warn(
				`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(
					req.method
				)} ${req.originalUrl} ${chalk.redBright('failed')} : Short code not found`
			);
			return res.status(404).json({
				success: false,
				message: 'Short code not found',
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

	// Return with success
	console.log(
		`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
			req.originalUrl
		} ${chalk.greenBright('succeded')} : Short code deleted`
	);
	return res.status(204).json({
		success: true,
		message: 'Short code deleted',
	});
};

// Retrieve URL statistics
export const getStats = async (req: Request, res: Response): Promise<Response> => {
	// Handle missing request params
	const shortCode: string | undefined = req.params.shortCode;
	if (!shortCode) {
		console.warn(
			`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
				req.originalUrl
			} ${chalk.redBright('failed')} : Missing request params`
		);
		return res.status(400).json({
			success: false,
			message: 'Missing request params',
		});
	}

	let url: UrlDocument | null;
	try {
		// Retrieve short code
		url = await UrlModel.findOne({ shortCode }).lean();

		// Handle short code not found
		if (!url) {
			console.warn(
				`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(
					req.method
				)} ${req.originalUrl} ${chalk.redBright('failed')} : Short code not found`
			);
			return res.status(404).json({
				success: false,
				message: 'Short code not found',
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

	// Return with statistics
	console.log(
		`${chalk.blueBright(new Date().toLocaleString())} Request ${chalk.yellowBright(req.method)} ${
			req.originalUrl
		} ${chalk.greenBright('succeded')} : Short code stats found`
	);
	return res.status(200).json({
		success: true,
		message: 'Short code stats found',
		payload: url,
	});
};
