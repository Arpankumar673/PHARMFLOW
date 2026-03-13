const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PromoCode = require('./src/models/PromoCode');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to seed promo codes...');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
};

const promoCodes = [
    {
        code: "PHARM50",
        discountPercent: 50,
        durationMonths: 3,
        maxUses: 100,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
    },
    {
        code: "PHARM30",
        discountPercent: 30,
        durationMonths: 3,
        maxUses: 100,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
        code: "START20",
        discountPercent: 20,
        durationMonths: 2,
        maxUses: 200,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    },
    {
        code: "EARLY100",
        discountPercent: 100,
        durationMonths: 1,
        maxUses: 50,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    {
        code: "PHARMFREE3",
        freePlan: true,
        durationMonths: 3,
        maxUses: 30,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    }
];

const seedPromoCodes = async () => {
    await connectDB();
    try {
        await PromoCode.deleteMany();
        console.log('Old promo codes removed.');
        
        await PromoCode.insertMany(promoCodes);
        console.log('Default promo codes seeded successfully!');
        
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
};

seedPromoCodes();
