const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const fixIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const collection = mongoose.connection.collection('medicines');
        
        console.log('Dropping index barcode_1...');
        try {
            await collection.dropIndex('barcode_1');
            console.log('Index dropped successfully');
        } catch (err) {
            console.log('Index barcode_1 not found or already dropped');
        }

        console.log('Creating sparse unique index on barcode...');
        await collection.createIndex({ barcode: 1 }, { unique: true, sparse: true });
        console.log('Index created successfully');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
};

fixIndex();
