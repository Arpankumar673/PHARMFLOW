import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
    AlertTriangle,
    ChevronRight,
    Calendar,
    TrendingDown,
    Loader2,
    CheckCircle2
} from '../../constants/icons';
import { format } from 'date-fns';

const ExpiryRiskWidget = () => {
    const [risks, setRisks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRisks = async () => {
            try {
                const res = await api.get('/analytics/expiry-risks');
                setRisks(res.data.data);
            } catch (err) {
                console.error("Failed to fetch expiry risks", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRisks();
    }, []);

    if (loading) return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-rose-500" />
        </div>
    );

    return (
        <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-rose-50/30">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 uppercase tracking-tighter">
                    <AlertTriangle size={18} className="text-rose-600" />
                    AI Expiry Risk Alerts
                </h3>
                <span className="text-[10px] font-black bg-rose-100 text-rose-700 px-2 py-1 rounded-md">ALPHA</span>
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto scrollbar-hide">
                {risks.length > 0 ? (
                    risks.map((risk, i) => (
                        <div key={i} className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-rose-200 transition-all group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{risk.medicineName}</p>
                                    <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-1">
                                        <Calendar size={10} />
                                        Exp: {format(new Date(risk.expiryDate), 'MMM yyyy')}
                                    </p>
                                </div>
                                <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${risk.riskLevel === 'High' ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                    {risk.riskLevel} Risk
                                </span>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl mt-4">
                                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none mb-1 flex items-center gap-1">
                                    <TrendingDown size={10} />
                                    AI Suggestion
                                </p>
                                <p className="text-xs text-gray-600 font-medium italic">{risk.suggestion}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center py-10 opacity-30 grayscale">
                        <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Expiry Risks</p>
                    </div>
                )}
            </div>

            {risks.length > 0 && (
                <button className="p-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-rose-600 transition-colors border-t border-gray-50 flex items-center justify-center gap-1">
                    Apply AI Suggestions <ChevronRight size={14} />
                </button>
            )}
        </div>
    );
};

export default ExpiryRiskWidget;
