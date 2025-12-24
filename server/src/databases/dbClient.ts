import mongoose from 'mongoose';

// Connect client to database
export const initDb = async () => {
	const uri: string = process.env.MONGODB_URI || '';

	// Connect client to Mongodb database
	const client = await mongoose.connect(uri);

	// Handle connection success
	client.connection.on('connected', () => {
		console.log('MongoDB connection successful');
	});

	// Handle connection failure
	client.connection.on('error', (error) => {
		throw new Error(`MongoDB connection failed\n${error}`);
	});
};
