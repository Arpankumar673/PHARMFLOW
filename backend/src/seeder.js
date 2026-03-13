const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Supplier = require('./models/Supplier');
const Medicine = require('./models/Medicine');
const Pharmacy = require('./models/Pharmacy');
const bcrypt = require('bcryptjs');

dotenv.config();

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await User.deleteMany();
        await Supplier.deleteMany();
        await Medicine.deleteMany();
        await Pharmacy.deleteMany();

        // Create a Pharmacy
        const pharmacy = await Pharmacy.create({
            name: 'PharmFlow Central',
            ownerName: 'Pharmacy Owner',
            email: 'owner@pharmflow.com',
            phone: '9988776655',
            address: 'Main Street, Cloud City',
            subscriptionPlan: 'Enterprise'
        });

        const users = [
            {
                name: 'Super Admin',
                email: 'superadmin@pharmflow.com',
                password: 'password123', // Will be hashed by model pre-save hook
                role: 'SuperAdmin'
            },
            {
                name: 'Pharmacy Owner',
                email: 'owner@pharmflow.com',
                password: 'password123',
                role: 'PharmacyOwner',
                pharmacy: pharmacy._id
            },
            {
                name: 'John Pharmacist',
                email: 'pharmacist@pharmflow.com',
                password: 'password123',
                role: 'Pharmacist',
                pharmacy: pharmacy._id
            },
            {
                name: 'Staff User',
                email: 'staff@pharmflow.com',
                password: 'password123',
                role: 'Staff',
                pharmacy: pharmacy._id
            }
        ];

        // We use create instead of insertMany here to trigger pre-save hooks (though seeder usually prefers insertMany)
        // If we use insertMany, we must hash password here or rely on the fact that we're seeding for dev.
        // Actually, the previous seeder hashed manually. Let me hash manually to be safe for insertMany.
        const hashedUsers = users.map(u => ({
            ...u,
            password: bcrypt.hashSync(u.password, 10)
        }));

        await User.insertMany(hashedUsers);

        // Create Suppliers
        const suppliers = [
            {
                name: 'Global Pharma Corp',
                phone: '1234567890',
                address: 'Medical Industrial Area, Mumbai',
                email: 'contact@globalpharma.com',
                pharmacy: pharmacy._id
            },
            {
                name: 'HealthCare Dist',
                phone: '9876543210',
                address: 'Pharmacy Square, Delhi',
                email: 'sales@healthcare.com',
                pharmacy: pharmacy._id
            }
        ];

        const createdSuppliers = await Supplier.insertMany(suppliers);

        // Create Medicines
        const medicines = [
            {
                name: 'Paracetamol 500mg',
                batchNumber: 'BT12345',
                expiryDate: '2025-12-31',
                quantity: 500,
                purchasePrice: 1.5,
                sellingPrice: 5,
                supplier: createdSuppliers[0]._id,
                category: 'Tablet',
                pharmacy: pharmacy._id
            },
            {
                name: 'Amoxicillin 250mg',
                batchNumber: 'AX98765',
                expiryDate: '2025-06-30',
                quantity: 200,
                purchasePrice: 8,
                sellingPrice: 15,
                supplier: createdSuppliers[1]._id,
                category: 'Capsule',
                pharmacy: pharmacy._id
            },
            {
                name: 'Cough Syrup (Adult)',
                batchNumber: 'CS55443',
                expiryDate: '2024-11-20',
                quantity: 45,
                purchasePrice: 40,
                sellingPrice: 85,
                supplier: createdSuppliers[0]._id,
                category: 'Syrup',
                pharmacy: pharmacy._id
            },
            {
                name: 'Vitamin C 1000mg',
                batchNumber: 'VC00911',
                expiryDate: '2026-03-15',
                quantity: 8,
                purchasePrice: 12,
                sellingPrice: 25,
                supplier: createdSuppliers[1]._id,
                category: 'Tablet',
                lowStockThreshold: 10,
                pharmacy: pharmacy._id
            }
        ];

        await Medicine.insertMany(medicines);

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
