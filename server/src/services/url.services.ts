import { nanoid } from 'nanoid';
import UrlModel, { UrlDocument } from '../models/url.model.js';

// Shorten URL
export const shorten = async (): Promise<string> => {
	let code: string;

	// Execute until unique code
	while (true) {
		// Generate code
		code = nanoid(8);

		// Check if existing code
		const existingCode: UrlDocument = await UrlModel.findOne({
			shortCode: code,
		}).lean();
		if (existingCode) {
			continue;
		}

		// Return unique code
		return code;
	}
};

// Normalize URL
export const normalize = (url: string): string => {
	const trimmedUrl = url.trim();
	try {
		return new URL(trimmedUrl).toString();
	} catch {
		return new URL(`https://${trimmedUrl}`).toString();
	}
};
