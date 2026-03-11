import { useState, useEffect } from 'react';
import api from '../services/api';
import {
    CheckCircle2,
    Zap,
    Crown,
    Rocket,
    ShieldCheck,
    CreditCard,
    AlertTriangle,
    Loader2,
    ArrowUpRight
} from '../constants/icons';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Subscription = () => {
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchSubscriptionStatus();
    }, []);

    const fetchSubscriptionStatus = async () => {
        try {
            const res = await api.get('/subscription/status');
            setCurrentSubscription(res.data.data);
        } catch (err) {
            console.error('Error fetching subscription', err);
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpay = (orderData, plan) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_placeholder",
            amount: orderData.amount,
            currency: "INR",
            name: "PharmFlow SaaS",
            description: `${plan} Subscription`,
            image: "https://example.com/logo.png",
            order_id: orderData.id,
            handler: async (response) => {
                try {
                    setProcessing(true);
                    const verifyRes = await api.post('/subscription/verify-payment', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });

                    if (verifyRes.data.success) {
                        toast.success('Subscription activated successfully!');
                        fetchSubscriptionStatus();
                        window.location.reload();
                    }
                } catch (err) {
                    toast.error('Payment verification failed');
                } finally {
                    setProcessing(false);
                }
            },
            prefill: {
                name: user?.name,
                email: user?.email,
                contact: user?.phone
            },
            theme: {
                color: "#0ea5e9"
            }
        };

        if (!window.Razorpay) {
            toast.error('Razorpay SDK failed to load. Please check your connection.');
            return;
        }

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleSubscribe = async (plan) => {
        try {
            setProcessing(true);
            const res = await api.post('/subscription/create-order', { plan });
            loadRazorpay(res.data.order, plan);
        } catch (err) {
            toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to initiate payment');
        } finally {
            setProcessing(false);
        }
    };

    const plans = [
        {
            id: 'Basic',
            name: 'Standard Node',
            price: 199,
            icon: Zap,
            color: 'from-blue-600 to-cyan-500',
            features: [
                'Inventory Architecture',
                'Point of Sale Terminal',
                'Critical Stock Alerts',
                'Core Data Logs',
                '1 Neural Staff Link'
            ]
        },
        {
            id: 'Pro',
            name: 'Quantum Hub',
            price: 399,
            recommended: true,
            icon: Rocket,
            color: 'from-primary-600 to-emerald-500',
            features: [
                'Everything in Standard',
                'AI Demand Forecasting',
                'Deep Neural Analytics',
                '5 Staff Access Nodes',
                'Advanced OCR Scanner'
            ]
        },
        {
            id: 'Enterprise',
            name: 'Empire Grid',
            price: 799,
            icon: Crown,
            color: 'from-purple-600 to-pink-500',
            features: [
                'Quantum Hub Access',
                'Global Multi-store Grid',
                'Unlimited System Links',
                'Direct Architect Support',
                'Zero-Latency Priority'
            ]
        }
    ];

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-600">Accessing Upgrade Grid...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24 animate-fade-in max-w-[1400px] mx-auto">
            <header className="text-center max-w-3xl mx-auto pt-10 px-4">
                <div className="inline-block px-4 py-2 bg-primary-50 rounded-full text-[10px] font-black text-primary-600 uppercase tracking-widest mb-6">Subscription Terminal</div>
                <h1 className="text-4xl lg:text-6xl font-black text-pharmacy-900 tracking-tighter mb-6 uppercase leading-none">Upgrade Your<br /><span className="text-primary-600">Pharmacy Core</span></h1>
                <p className="text-pharmacy-500 text-lg font-medium italic opacity-70">Scale your operations with advanced AI protocols and enterprise-grade infrastructure.</p>
            </header>

            {currentSubscription?.status === 'active' && (
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-[32px] p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-emerald-200 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                        <div className="flex items-center gap-6 relative z-10 text-white text-center md:text-left">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-inner">
                                <ShieldCheck size={40} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter">{currentSubscription.plan} Identity Active</h3>
                                <p className="text-emerald-100 font-medium italic mt-1 opacity-80">Full protocol access enabled until {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <button className="relative z-10 w-full md:w-auto bg-white text-emerald-600 font-black uppercase tracking-widest text-[10px] px-10 py-5 rounded-2xl hover:bg-emerald-50 transition-all active:scale-95 shadow-xl">Manage Billing Grid</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-4">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={clsx(
                            "relative flex flex-col p-10 lg:p-12 rounded-[56px] transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group overflow-hidden bg-white border border-pharmacy-50",
                            plan.recommended ? "ring-2 ring-primary-500 lg:scale-[1.05] shadow-2xl z-10" : "hover:-translate-y-2"
                        )}
                    >
                        {plan.recommended && (
                            <div className="absolute top-8 right-8">
                                <span className="bg-primary-600 text-white text-[9px] font-black py-2 px-4 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                                    <Zap size={10} fill="currentColor" />
                                    High Pulse
                                </span>
                            </div>
                        )}

                        <div className={clsx(
                            "w-20 h-20 rounded-[28px] bg-gradient-to-br flex items-center justify-center text-white mb-10 shadow-xl shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                            plan.color
                        )}>
                            <plan.icon size={36} strokeWidth={2.5} />
                        </div>

                        <h3 className="text-3xl font-black text-pharmacy-900 mb-2 tracking-tighter uppercase">{plan.name}</h3>
                        <p className="text-[10px] font-black text-pharmacy-400 uppercase tracking-widest mb-10 italic">Tier identification code: PF-{plan.id.toUpperCase()}</p>

                        <div className="flex items-baseline gap-2 mb-10 p-6 bg-pharmacy-50 rounded-[32px] justify-center border border-pharmacy-100">
                            <span className="text-5xl font-black text-pharmacy-900 tracking-tighter">₹{plan.price}</span>
                            <span className="text-sm font-black text-pharmacy-400 uppercase">/Cycle</span>
                        </div>

                        <ul className="space-y-6 mb-12 flex-1">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-4 text-xs font-bold text-pharmacy-700 uppercase tracking-tight">
                                    <div className="w-5 h-5 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                        <CheckCircle2 size={12} strokeWidth={3} />
                                    </div>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled={currentSubscription?.plan === plan.id || processing}
                            onClick={() => handleSubscribe(plan.id)}
                            className={clsx(
                                "w-full py-6 rounded-[32px] font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden relative",
                                plan.recommended
                                    ? "bg-primary-600 text-white shadow-2xl shadow-primary-200 hover:bg-primary-700"
                                    : "bg-pharmacy-900 text-white hover:bg-black",
                                currentSubscription?.plan === plan.id && "bg-pharmacy-100 text-pharmacy-400 cursor-not-allowed shadow-none border-dashed border-2 border-pharmacy-200"
                            )}
                        >
                            {processing ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    {currentSubscription?.plan === plan.id ? 'Core Identity Verified' : (
                                        <>
                                            Initialize Activation
                                            <ArrowUpRight size={18} />
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className="max-w-6xl mx-auto mt-24 px-4">
                <div className="bg-primary-950 p-12 lg:p-20 rounded-[64px] text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/20 blur-[150px] rounded-full -mr-64 -mt-64 group-hover:bg-primary-500/30 transition-all duration-1000"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 bg-white/5 py-2 px-4 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-white/10">
                                <AlertTriangle size={14} className="text-amber-400" />
                                Enterprise Override Available
                            </div>
                            <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-[1] mb-8">Need Unlimited<br /><span className="text-primary-400">Scale Grid?</span></h2>
                            <p className="text-lg text-primary-100/60 font-medium italic mb-12 max-w-lg mx-auto lg:mx-0">For hospital networks and national pharmacy chains, we provide dedicated cloud instances and custom protocol integration.</p>
                            <button className="w-full sm:w-auto bg-white text-primary-950 px-12 py-6 rounded-[28px] font-black uppercase tracking-widest text-[11px] hover:bg-primary-50 active:scale-95 transition-all shadow-2xl">Consult Systems Architect</button>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full max-w-md aspect-square rounded-[64px] bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-3xl group-hover:rotate-1 transition-transform duration-1000 p-12 relative">
                                <CreditCard size={120} className="text-white opacity-10 group-hover:opacity-20 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-32 h-32 bg-primary-500/20 blur-[40px] rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Subscription;
