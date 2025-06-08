const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes'); // your existing routes
const authMiddleware = require('./middlewares/authMiddleware');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(helmet());

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes - JWT middleware applied here
app.use('/api/products', authMiddleware, productRoutes);

// Error handling middleware and others...
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports= app;