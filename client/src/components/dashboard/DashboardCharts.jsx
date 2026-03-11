import React, { Suspense, lazy } from 'react';
import { Loader2, Lock } from '../../constants/icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

// Lazy load chart components
const Line = lazy(() => import('react-chartjs-2').then((mod) => ({ default: mod.Line })));
const Bar = lazy(() => import('react-chartjs-2').then((mod) => ({ default: mod.Bar })));
const Doughnut = lazy(() => import('react-chartjs-2').then((mod) => ({ default: mod.Doughnut })));

const DashboardCharts = ({ salesData, topSelling, isTopSellingLocked }) => {
    const weeklySalesData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Sales Revenue (₹)',
                data: salesData || [4200, 5800, 4900, 6200, 5500, 7800, 6400],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ]
    };

    const topSellingData = {
        labels: topSelling?.map(med => med.name) || ['Paracetamol', 'Amoxicillin', 'Cetirizine', 'Ibuprofen', 'Azithromycin'],
        datasets: [
            {
                label: 'Units Sold',
                data: topSelling?.map(med => med.totalSold) || [120, 95, 80, 75, 60],
                backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
                ],
                borderRadius: 8,
            }
        ]
    };

    const categoryDistributionData = {
        labels: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Topical'],
        datasets: [
            {
                data: [45, 25, 15, 10, 5],
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                beginAtZero: true,
                grid: { borderDash: [2, 2] }
            }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Sales Trend */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-gray-800">Weekly Sales Trend</h3>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded"> +8.4% vs last week</span>
                </div>
                <div className="h-[300px]">
                    <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-gray-300" /></div>}>
                        <Line data={weeklySalesData} options={options} />
                    </Suspense>
                </div>
            </div>

            {/* Inventory Distribution */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px]">
                <h3 className="font-bold text-gray-800 mb-8">Inventory by Category</h3>
                <div className="h-[250px] relative">
                    <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-gray-300" /></div>}>
                        <Doughnut data={categoryDistributionData} options={{ maintainAspectRatio: false }} />
                    </Suspense>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-2">
                    {categoryDistributionData.labels.map((label, i) => (
                        <div key={label} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: categoryDistributionData.datasets[0].backgroundColor[i] }}></div>
                            <span className="text-xs text-gray-600 font-medium">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Selling Medicines */}
            <div className="lg:col-span-3 bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px] relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-gray-800">Top Selling Products</h3>
                    {!isTopSellingLocked && <button className="text-xs font-bold text-blue-600 hover:underline">View All Sales</button>}
                </div>

                {isTopSellingLocked ? (
                    <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Lock size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">Detailed Analytics Locked</h4>
                        <p className="text-sm text-gray-500 max-w-sm mb-6 font-medium italic">Upgrade to the Pro plan to access medicine performance ranking and granular yield sharding.</p>
                        <button
                            onClick={() => window.location.href = '/subscription'}
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-colors"
                        >
                            Upgrade Plan
                        </button>
                    </div>
                ) : (
                    <div className="h-[280px]">
                        <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-gray-300" /></div>}>
                            <Bar data={topSellingData} options={{ ...options, plugins: { legend: { display: false } } }} />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCharts;
