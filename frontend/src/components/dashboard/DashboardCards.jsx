import React from 'react';
import { TrendingUp, ShoppingBag, AlertTriangle, Calendar } from 'lucide-react';

const Card = ({ title, value, icon: Icon, colorClass, label }) => (
  <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 flex items-center gap-4 md:gap-5 transition-all hover:shadow-md">
    <div className={`p-3 md:p-4 rounded-xl ${colorClass} text-white`}>
      <Icon size={20} className="md:w-6 md:h-6" />
    </div>
    <div>
      <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-xl md:text-2xl font-black text-slate-900">{value}</h3>
      <p className="text-[10px] md:text-xs font-medium text-slate-400 mt-1">{title}</p>
    </div>
  </div>
);

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      label: "Today's Sales",
      value: `₹${stats?.revenueToday?.toLocaleString() || 0}`,
      title: "Gross Revenue",
      icon: TrendingUp,
      colorClass: "bg-blue-600 shadow-lg shadow-blue-200"
    },
    {
      label: "Total Orders",
      value: stats?.ordersToday || 0,
      title: "Completed Today",
      icon: ShoppingBag,
      colorClass: "bg-emerald-600 shadow-lg shadow-emerald-200"
    },
    {
      label: "Low Stock",
      value: stats?.lowStockCount || 0,
      title: "Items to Restock",
      icon: AlertTriangle,
      colorClass: "bg-amber-500 shadow-lg shadow-amber-200"
    },
    {
      label: "Expiring",
      value: stats?.expiringSoonCount || 0,
      title: "Next 30 Days",
      icon: Calendar,
      colorClass: "bg-rose-500 shadow-lg shadow-rose-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, idx) => (
        <Card key={idx} {...card} />
      ))}
    </div>
  );
};

export default DashboardCards;
