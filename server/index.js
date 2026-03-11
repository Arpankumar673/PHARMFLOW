const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const medicines = require('./routes/medicines');
const suppliers = require('./routes/suppliers');
const sales = require('./routes/sales');
const reports = require('./routes/reports');
const subscription = require('./routes/subscription');
const platform = require('./routes/platform');
const prescription = require('./routes/prescription');
const supplyChain = require('./routes/supplyChain');
const network = require('./routes/network');
const analytics = require('./routes/analytics');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/inventory', medicines);
app.use('/api/suppliers', suppliers);
app.use('/api/billing', sales);
app.use('/api/reports', reports);
app.use('/api/subscription', subscription);
app.use('/api/platform', platform);
app.use('/api/prescription', prescription);
app.use('/api/supply-chain', supplyChain);
app.use('/api/network', network);
app.use('/api/analytics', analytics);

// Basic route
app.get('/', (req, res) => {
    res.send('PharmFlow API is running...');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
