import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Pill, Building2, User, Mail, Lock, Phone, MapPin, CheckCircle2, ChevronRight, Sparkles, Loader2 } from '../constants/icons';
import { toast } from 'react-toastify';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        subscriptionPlan: 'Basic'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/register-pharmacy', formData);
            localStorage.setItem('token', res.data.token);
            toast.success('Welcome to PharmFlow! Your pharmacy is ready.');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(step + 1);
    };
    const prevStep = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setStep(step - 1);
    };

    return (
        <div className="min-h-screen bg-pharmacy-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-grid-pharmacy-900/[0.02] -z-10"></div>
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary-500/5 to-transparent -z-10"></div>

            <div className="max-w-4xl mx-auto w-full relative z-10">
                <div className="text-center mb-12 animate-fade-in">
                    <Link to="/" className="inline-flex justify-center items-center gap-4 mb-8 group hover:scale-105 transition-transform">
                        <div className="w-14 h-14 bg-primary-600 rounded-[24px] flex items-center justify-center shadow-2xl shadow-primary-200 group-hover:rotate-12 transition-transform">
                            <Pill className="text-white" size={32} />
                        </div>
                        <span className="text-4xl font-black text-pharmacy-900 tracking-tighter">PharmFlow <span className="text-primary-600 font-black">CORE</span></span>
                    </Link>
                    <h2 className="text-4xl md:text-5xl font-black text-pharmacy-900 tracking-tighter leading-none mb-6">Initialize New Node</h2>
                    <p className="text-lg text-pharmacy-500 font-medium italic opacity-70">Join the architectural evolution of digital pharmacy management.</p>
                </div>

                <div className="flex justify-center mb-12">
                    <div className="flex items-center gap-4 md:gap-8 overflow-hidden px-4 py-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center">
                                <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center font-black text-sm transition-all duration-700 shadow-lg ${step >= i
                                    ? 'bg-primary-600 text-white shadow-primary-200'
                                    : 'bg-white text-pharmacy-300 border border-pharmacy-100'
                                    }`}>
                                    {step > i ? <CheckCircle2 size={24} strokeWidth={3} /> : i}
                                </div>
                                {i < 3 && <div className={`w-12 md:w-20 h-1.5 mx-2 rounded-full transition-all duration-1000 ${step > i ? 'bg-primary-600 shadow-sm shadow-primary-200' : 'bg-pharmacy-100'}`}></div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-[48px] shadow-2xl shadow-pharmacy-900/5 overflow-hidden border border-white/50 backdrop-blur-sm animate-slide-up">
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="p-8 md:p-14 animate-fade-in">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                                    <h3 className="text-2xl font-black flex items-center gap-4 text-pharmacy-900 uppercase tracking-tighter">
                                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                            <Building2 size={22} />
                                        </div>
                                        Structural Foundations
                                    </h3>
                                    <span className="bg-pharmacy-50 text-pharmacy-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Phase 01 / 03</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="group">
                                            <label className="label-signup">Node Identity Name</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-pharmacy-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input name="name" type="text" required className="input-signup" placeholder="e.g. Apollo Central Node" value={formData.name} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="label-signup">Global Contact Uplink</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-pharmacy-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input name="phone" type="text" required className="input-signup" placeholder="+91 0000 000000" value={formData.phone} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="group h-full">
                                            <label className="label-signup">Physical Coordinates</label>
                                            <div className="relative h-[calc(100%-32px)]">
                                                <MapPin className="absolute left-6 top-6 text-pharmacy-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <textarea name="address" required className="input-signup h-full min-h-[148px] pt-6 resize-none" placeholder="Enter precise physical location..." value={formData.address} onChange={handleChange}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-14 flex justify-end">
                                    <button type="button" onClick={nextStep} className="btn-next group">
                                        Configure Admin
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="p-8 md:p-14 animate-fade-in">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                                    <h3 className="text-2xl font-black flex items-center gap-4 text-pharmacy-900 uppercase tracking-tighter">
                                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                            <User size={22} />
                                        </div>
                                        Administrative Profile
                                    </h3>
                                    <span className="bg-pharmacy-50 text-pharmacy-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Phase 02 / 03</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-8">
                                        <div className="group">
                                            <label className="label-signup">Architect Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-pharmacy-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input name="ownerName" type="text" required className="input-signup" placeholder="e.g. Dr. Rajesh Kumar" value={formData.ownerName} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="group">
                                            <label className="label-signup">Terminal Email Uplink</label>
                                            <div className="relative">
                                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-pharmacy-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input name="email" type="email" required className="input-signup" placeholder="rajesh@node-alpha.com" value={formData.email} onChange={handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-8 flex flex-col justify-between">
                                        <div className="group">
                                            <label className="label-signup">Secure Access Protocol</label>
                                            <div className="relative">
                                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-pharmacy-300 group-focus-within:text-primary-600 transition-colors" size={20} />
                                                <input name="password" type="password" required className="input-signup" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="bg-pharmacy-900/5 p-8 rounded-[32px] border border-pharmacy-100 flex items-start gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                                <Sparkles className="text-primary-600" size={20} />
                                            </div>
                                            <p className="text-[11px] text-pharmacy-500 font-bold uppercase italic leading-relaxed tracking-tight">
                                                Note: This identity will be granted <span className="text-primary-600">Full-Spectrum Authorization</span> across this tenant.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-14 flex flex-col sm:flex-row border-t border-pharmacy-50 pt-10 justify-between items-center gap-6">
                                    <button type="button" onClick={prevStep} className="text-pharmacy-400 font-black uppercase tracking-widest text-[10px] hover:text-pharmacy-900 transition-colors">Abort to Previous</button>
                                    <button type="button" onClick={nextStep} className="btn-next group w-full sm:w-auto">
                                        Authorization Tiers
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="p-8 md:p-14 animate-fade-in">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                                    <h3 className="text-2xl font-black flex items-center gap-4 text-pharmacy-900 uppercase tracking-tighter">
                                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                                            <Sparkles size={22} />
                                        </div>
                                        Operating Tier Grid
                                    </h3>
                                    <span className="bg-pharmacy-50 text-pharmacy-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest">Phase 03 / 03</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        { id: 'Basic', price: '₹999', features: ['Standard POS', 'Stock Tracking', 'Single Admin'] },
                                        { id: 'Pro', price: '₹2,499', features: ['AI Pulse Analysis', 'Optical Scanner', '5 Admin Slots'], recommended: true },
                                        { id: 'Enterprise', price: 'Custom', features: ['Multi-Node Mesh', 'Neural Logistics', 'Infinity Flow'] }
                                    ].map(plan => (
                                        <div
                                            key={plan.id}
                                            onClick={() => setFormData({ ...formData, subscriptionPlan: plan.id })}
                                            className={`relative p-8 rounded-[40px] border-2 transition-all cursor-pointer group/plan ${formData.subscriptionPlan === plan.id
                                                ? 'border-primary-600 bg-primary-50/10 shadow-2xl shadow-primary-200/20'
                                                : 'border-pharmacy-50 hover:border-pharmacy-200 bg-white'
                                                }`}
                                        >
                                            {plan.recommended && (
                                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[9px] font-black py-2 px-5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary-200">Optimal Vector</div>
                                            )}
                                            <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${formData.subscriptionPlan === plan.id ? 'text-primary-600' : 'text-pharmacy-300'}`}>{plan.id}</p>
                                            <h4 className="text-3xl font-black text-pharmacy-900 mb-8 leading-none">{plan.price} <span className="text-[10px] font-bold text-pharmacy-400 uppercase tracking-widest">/mo</span></h4>
                                            <ul className="space-y-4">
                                                {plan.features.map((f, i) => (
                                                    <li key={i} className="text-[10px] font-black text-pharmacy-500 uppercase tracking-tight flex items-start gap-4 italic opacity-90">
                                                        <CheckCircle2 size={16} className={formData.subscriptionPlan === plan.id ? 'text-primary-600 shrink-0' : 'text-pharmacy-200 shrink-0'} />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-14 flex flex-col sm:flex-row border-t border-pharmacy-50 pt-10 justify-between items-center gap-8">
                                    <button type="button" onClick={prevStep} className="text-pharmacy-400 font-black uppercase tracking-widest text-[10px] hover:text-pharmacy-900 transition-colors">Access Redefinition</button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-next px-16 bg-pharmacy-900 shadow-2xl shadow-pharmacy-200 w-full sm:w-auto"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 size={24} className="animate-spin" />
                                                Syncing Neural Link...
                                            </>
                                        ) : (
                                            <>
                                                Initialize Node
                                                <Sparkles size={20} className="animate-pulse" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                <div className="text-center mt-12 animate-fade-in">
                    <p className="text-pharmacy-400 text-sm font-bold uppercase tracking-widest opacity-60">
                        Node already established?{' '}
                        <button onClick={() => navigate('/login')} className="text-primary-600 hover:text-primary-700 transition-colors">
                            Authenticate Link Here
                        </button>
                    </p>
                </div>
            </div>

            <style>{`
                .label-signup {
                    display: block;
                    font-size: 10px;
                    font-weight: 900;
                    text-transform: uppercase;
                    color: #94a3b8;
                    margin-bottom: 12px;
                    letter-spacing: 0.2em;
                    font-family: 'Outfit', sans-serif;
                }
                .input-signup {
                    width: 100%;
                    padding: 22px 24px 22px 64px;
                    border-radius: 28px;
                    border: 2px solid #f1f5f9;
                    background: #f8fafc;
                    font-size: 16px;
                    font-weight: 800;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    color: #0f172a;
                    font-family: 'Outfit', sans-serif;
                    letter-spacing: -0.02em;
                }
                .input-signup:focus {
                    outline: none;
                    background: white;
                    border-color: #0ea5e9;
                    box-shadow: 0 15px 30px -10px rgba(14, 165, 233, 0.15);
                    transform: translateY(-2px);
                }
                .btn-next {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 22px 42px;
                    border-radius: 32px;
                    background: #0ea5e9;
                    color: white;
                    font-weight: 950;
                    font-size: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 10px 40px -10px rgba(14, 165, 233, 0.4);
                }
                .btn-next:hover:not(:disabled) {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 20px 50px -10px rgba(14, 165, 233, 0.5);
                    background: #0284c7;
                }
                .btn-next:active:not(:disabled) {
                    transform: translateY(-1px) scale(0.98);
                }
                .btn-next:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default Signup;
