// AI Expiry Prediction Service
// Logic: Analyzes current stock, sales rate, and expiry date to predict risk

exports.predictExpiryRisk = (stockQuantity, salesHistory, expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);

    // Time until expiry in months
    const monthsUntilExpiry = (expiry.getFullYear() - today.getFullYear()) * 12 + (expiry.getMonth() - today.getMonth());

    // Average sales per month (mock logic based on history)
    const avgMonthlySales = salesHistory.length > 0 ?
        salesHistory.reduce((acc, sale) => acc + sale.quantity, 0) / Math.max(salesHistory.length, 1) : 10;

    const projectedConsumption = avgMonthlySales * monthsUntilExpiry;

    let riskScore = 0;
    let riskLevel = "Low";
    let suggestion = "Monitor stock levels.";

    if (projectedConsumption < stockQuantity) {
        // High risk if we have more stock than we can likely sell before expiry
        riskScore = 0.8;
        riskLevel = "High";
        suggestion = "Consider 20% discount to clear stock.";
    } else if (projectedConsumption < stockQuantity * 1.5) {
        riskScore = 0.5;
        riskLevel = "Medium";
        suggestion = "Move toward front of shelf.";
    }

    return {
        riskScore,
        riskLevel,
        suggestion
    };
};
