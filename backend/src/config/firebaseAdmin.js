const admin = require("firebase-admin");
const path = require('path');

// Dynamically handle service account key location
// Note: User MUST provide this file for the system to work
let serviceAccount;
try {
    serviceAccount = require("../serviceAccountKey.json");
} catch (error) {
    console.warn("⚠️ Firebase Service Account Key not found in backend/src/serviceAccountKey.json");
    console.warn("Please download it from Firebase Console -> Project Settings -> Service Accounts");
}

if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("🔥 Firebase Admin SDK Initialized");
    } catch (error) {
        console.error("❌ Firebase Admin Initialization Failed:", error.message);
        console.warn("Please check your backend/src/serviceAccountKey.json file.");
    }
}

module.exports = admin;
