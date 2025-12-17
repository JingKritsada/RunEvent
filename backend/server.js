const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const dataRoutes = require('./routes/dataRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGODB_URI);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`Error: ${error.message}`);
		process.exit(1);
	}
};

// Connect to Database
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/data', dataRoutes);

// Basic Route
app.get('/', (req, res) => {
	res.send('API is running...');
});

// Start Server
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
