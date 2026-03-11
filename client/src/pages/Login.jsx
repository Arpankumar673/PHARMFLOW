import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, Pill, ChevronRight } from '../constants/icons';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-pharmacy-50 px-4 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 bg-grid-pharmacy-900/[0.02] -z-10"></div>
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-500/5 rounded-full blur-[120px] -z-10"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px] -z-10"></div>

            <div className="max-w-md w-full animate-slide-up relative z-10">
                <div className="text-center mb-12">
                    <div className="flex justify-center items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-primary-600 rounded-[28px] flex items-center justify-center shadow-2xl shadow-primary-200 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <Pill className="text-white" size={36} />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black font-['Outfit'] text-pharmacy-900 tracking-tighter leading-none mb-3">
                        PharmFlow <span className="text-primary-600">SaaS</span>
                    </h1>
                    <p className="text-pharmacy-500 font-bold italic text-sm opacity-70 uppercase tracking-[0.15em]">Terminal Access Authorization</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 md:p-12 shadow-2xl shadow-pharmacy-900/10 border border-white/50 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/20 to-transparent"></div>

                    {error && (
                        <div className="mb-8 p-5 bg-red-50/50 backdrop-blur-sm text-red-700 rounded-[24px] text-[11px] font-black border border-red-100/50 flex items-center gap-3 animate-shake">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="group/input">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-pharmacy-400 mb-4 ml-2">Node Email Uplink</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-6 flex items-center text-pharmacy-300 group-focus-within/input:text-primary-600 transition-colors pointer-events-none">
                                    <Mail size={20} />
                                </span>
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-16 pr-8 py-5 bg-pharmacy-50 focus:bg-white border-2 border-transparent focus:border-primary-500/30 rounded-[24px] font-bold text-pharmacy-900 placeholder:text-pharmacy-200 transition-all outline-none"
                                    placeholder="terminal@pharmacy.io"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="group/input">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-pharmacy-400 mb-4 ml-2">Security Key Hash</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-6 flex items-center text-pharmacy-300 group-focus-within/input:text-primary-600 transition-colors pointer-events-none">
                                    <Lock size={20} />
                                </span>
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-16 pr-8 py-5 bg-pharmacy-50 focus:bg-white border-2 border-transparent focus:border-primary-500/30 rounded-[24px] font-bold text-pharmacy-900 placeholder:text-pharmacy-200 transition-all outline-none"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center gap-3 cursor-pointer group/check">
                                <div className="relative flex items-center">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 bg-pharmacy-50 rounded-lg border-2 border-pharmacy-100 peer-checked:bg-primary-600 peer-checked:border-primary-600 transition-all"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    </div>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-pharmacy-400 group-hover/check:text-pharmacy-600 transition-colors">Keep Session</span>
                            </label>
                            <Link to="/signup" className="text-[11px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors">New Deployment</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-pharmacy-900 hover:bg-pharmacy-800 text-white rounded-[24px] flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-pharmacy-900/20 active:scale-[0.98] transition-all relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Authorizing...
                                </>
                            ) : (
                                <>
                                    Initiate Session
                                    <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-12 space-y-4">
                    <p className="text-pharmacy-300 text-[10px] font-black uppercase tracking-[0.3em] italic">
                        Node Encryption v4.12.08 • Secure Tunnel Active
                    </p>
                    <div className="flex justify-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-pharmacy-300">
                        <a href="#" className="hover:text-primary-500 transition-colors">Legal Protocol</a>
                        <span className="opacity-30">|</span>
                        <a href="#" className="hover:text-primary-500 transition-colors">Direct Support</a>
                        <span className="opacity-30">|</span>
                        <a href="#" className="hover:text-primary-500 transition-colors">Network Status</a>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Login;
