// Basic Mock OCR Service for Prescription Scanning
// In production, this would use Google Cloud Vision or Tesseract.js

exports.scanPrescription = async (imageUrl) => {
    // Simulate OCR delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock detected medicines based on common prescription patterns
    // In a real app, this would be the output of an AI model processing OCR text
    return {
        medicines: [
            { name: "Paracetamol", dose: "500mg" },
            { name: "Amoxicillin", dose: "250mg" },
            { name: "Cetirizine", dose: "10mg" }
        ],
        confidenceScore: 0.94
    };
};
