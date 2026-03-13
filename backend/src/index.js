const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');

// Connect to database
connectDB();

// Route files
const auth = require('./routes/auth');
const medicines = require('./routes/medicines');
const suppliers = require('./routes/suppliers');
const sales = require('./routes/sales');
const dashboard = require('./routes/dashboard');
const reports = require('./routes/reports');
const subscription = require('./routes/subscription');
const platform = require('./routes/platform');
const prescription = require('./routes/prescription');
const supplyChain = require('./routes/supplyChain');
const network = require('./routes/network');
const analytics = require('./routes/analytics');
const purchaseOrders = require('./routes/purchaseOrders');
const pharmacy = require('./routes/pharmacy');
const users = require('./routes/users');
const staff = require('./routes/staff');
const settings = require('./routes/settings');
const system = require('./routes/system');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

// Express Session
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Set security headers
app.use(helmet());

// PharmFlow v2 request logging
app.use((req, res, next) => {
    console.log(`PharmFlow v2 API request: ${req.method} ${req.url}`);
    next();
});

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api', apiLimiter);
app.use('/api/auth', auth);
app.use('/api/inventory', medicines);
app.use('/api/suppliers', suppliers);
app.use('/api/billing', sales);
app.use('/api/dashboard', dashboard);
app.use('/api/reports', reports);
app.use('/api/subscription', subscription);
app.use('/api/platform', platform);
app.use('/api/prescription', prescription);
app.use('/api/supply-chain', supplyChain);
app.use('/api/network', network);
app.use('/api/analytics', analytics);
app.use('/api/purchase-orders', purchaseOrders);
app.use('/api/pharmacy', pharmacy);
app.use('/api/users', users);
app.use('/api/staff', staff);
app.use('/api/settings', settings);
app.use('/api/system', system);

// API v2 Routes (Versioned)
app.use('/api/v2/auth', auth);
app.use('/api/v2/inventory', medicines);
app.use('/api/v2/billing', sales);

// TODO: Implement more versioned v2 specific logic here in the future


// Basic route
app.get('/', (req, res) => {
    res.send('PharmFlow v2 API running');
});


let PORT = parseInt(process.env.PORT) || 5001;

/**
 * Starts the server and handles port conflicts by trying the next port.
 * @param {number} port - The port to try listening on.
 */
function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`🚀 PharmFlow v2 API running on port ${port}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️  Port ${port} is in use, trying ${port + 1}...`);
            startServer(port + 1);
        } else {
            console.error('❌ Server error:', err);
        }
    });

    // Handle unhandled promise rejections within the server context
    process.on('unhandledRejection', (err, promise) => {
        console.log(`Unhandled Rejection: ${err.message}`);
        server.close(() => process.exit(1));
    });
}

startServer(PORT);
