import mongoose, { Document } from 'mongoose';

export interface UrlDocument extends Document {
	url: string;
	shortCode: string;
	stats?: {
		accessCount: number;
	};
	createdAt: Date;
	updatedAt: Date;
}

// URL schema
const urlSchema = new mongoose.Schema<UrlDocument>(
	{
		url: { type: String, required: true, trim: true, unique: true },
		shortCode: { type: String, required: true, trim: true, unique: true },
		stats: {
			accessCount: { type: Number, default: 0 },
		},
	},
	{
		// Add timestamps
		timestamps: true,
	}
);

// Prevent model overwrite in dev / serverless environments
const UrlModel = mongoose.models.Url || mongoose.model<UrlDocument>('Url', urlSchema);

// Export model
export default UrlModel;
