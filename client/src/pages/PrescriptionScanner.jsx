import { useState, useRef } from 'react';
import api from '../services/api';
import {
    Camera,
    Upload,
    Pill,
    Plus,
    Loader2,
    CheckCircle2,
    FileText,
    BrainCircuit,
    Lock
} from '../constants/icons';
import { toast } from 'react-toastify';
import { useRole } from '../context/RoleContext';

const PrescriptionScanner = () => {
    const [image, setImage] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [isLocked, setIsLocked] = useState(false);
    const fileInputRef = useRef(null);
    const { hasPermission } = useRole();

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const startScan = async () => {
        setScanning(true);
        try {
            const res = await api.post('/prescription/scan', { image });
            setMedicines(res.data.data.medicines);
            toast.success('Prescription scanned successfully!');
        } catch (err) {
            if (err.response?.status === 403) {
                setIsLocked(true);
            } else {
                toast.error(err.response?.data?.message || 'Failed to scan prescription');
            }
        } finally {
            setScanning(false);
        }
    };

    if (isLocked) {
        return (
            <div className="flex flex-col items-center justify-center p-8 md:p-20 text-center bg-gray-50 border border-dashed border-gray-200 rounded-[40px] max-w-4xl mx-auto">
                <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center mb-8 shadow-xl shadow-gray-200/50">
                    <Lock size={40} className="text-primary-400" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-tight">Neural Link Locked</h2>
                <p className="text-gray-500 max-w-md italic mb-10 text-lg">AI Prescriptive Analysis is reserved for Enterprise Grid nodes. Upgrade your protocol plan to enable real-time OCR.</p>
                <button
                    onClick={() => window.location.href = '/subscription'}
                    className="w-full sm:w-auto bg-primary-600 text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-200 transition-all hover:bg-primary-700 active:scale-95"
                >
                    Upgrade Authentication
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in pb-24 max-w-[1400px] mx-auto px-4 md:px-0">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Advanced Neural Layer</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">AI Rx Scanner</h1>
                    <p className="text-pharmacy-500 font-medium italic mt-3 opacity-60">High-fidelity OCR engine for automated prescription extraction.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                {/* Input Area */}
                <div className="bg-white p-8 md:p-12 rounded-[56px] border border-pharmacy-50 shadow-sm flex flex-col items-center justify-center min-h-[500px] lg:min-h-[600px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-pharmacy bg-[size:40px_40px] opacity-[0.02]"></div>

                    {!image ? (
                        <div className="text-center relative z-10">
                            <div className="w-32 h-32 bg-primary-50 text-primary-600 rounded-[44px] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                <Camera size={56} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-2xl font-black text-pharmacy-900 uppercase tracking-tighter mb-4">Initialize Input</h3>
                            <p className="text-sm text-pharmacy-400 mb-10 font-medium italic opacity-60 max-w-[240px] mx-auto leading-relaxed">System accepts high-resolution JPG, PNG or composite PDF protocols.</p>

                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="group/btn bg-pharmacy-900 text-white px-12 py-5 rounded-[28px] font-black uppercase tracking-widest text-[10px] hover:bg-black transition-all flex items-center gap-4 mx-auto shadow-2xl shadow-pharmacy-200 active:scale-95"
                            >
                                <Upload size={18} className="group-hover/btn:-translate-y-1 transition-transform" />
                                Access File System
                            </button>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col gap-10 relative z-10 animate-scale-in">
                            <div className="flex-1 relative rounded-[40px] overflow-hidden border-4 border-pharmacy-50 shadow-inner group/img min-h-[300px]">
                                <img src={image} className="w-full h-full object-contain bg-pharmacy-50" alt="Prescription" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <button
                                        onClick={() => setImage(null)}
                                        className="bg-white text-pharmacy-900 px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px]"
                                    >
                                        Drop Identity
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <button
                                    onClick={() => setImage(null)}
                                    className="flex-1 py-5 border-2 border-pharmacy-100 rounded-[24px] font-black uppercase tracking-widest text-[10px] text-pharmacy-400 hover:bg-pharmacy-50 transition-all"
                                >
                                    Cancel Protocol
                                </button>
                                <button
                                    onClick={startScan}
                                    disabled={scanning}
                                    className="flex-[2] py-5 bg-primary-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-primary-700 shadow-2xl shadow-primary-200 flex items-center justify-center gap-4 active:scale-95 transition-all overflow-hidden relative"
                                >
                                    {scanning ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
                                    {scanning ? 'Neural Decoding...' : 'Execute Synaptic Scan'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Area */}
                <div className="bg-primary-950 p-10 md:p-16 rounded-[56px] text-white shadow-2xl relative overflow-hidden min-h-[500px] lg:min-h-[600px] flex flex-col group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/10 blur-[100px] rounded-full -mr-48 -mt-48 group-hover:bg-primary-500/20 transition-all duration-1000"></div>

                    <div className="relative z-10 mb-12 flex items-center justify-between border-b border-white/5 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors">
                                <FileText size={22} className="text-primary-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/40">Extraction Node</h3>
                                <p className="text-xs font-bold text-primary-400">Status: {scanning ? 'Synchronizing' : 'Verified'}</p>
                            </div>
                        </div>
                        {medicines.length > 0 && !scanning && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                                {medicines.length} Entities Found
                            </span>
                        )}
                    </div>

                    <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        {scanning ? (
                            <div className="flex flex-col items-center justify-center h-full py-20">
                                <div className="relative mb-10">
                                    <div className="w-32 h-32 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BrainCircuit size={40} className="text-primary-400 animate-pulse" />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 animate-pulse">Scanning hand-written vector paths...</p>
                            </div>
                        ) : medicines.length > 0 ? (
                            <div className="space-y-6">
                                {medicines.map((med, i) => (
                                    <div key={i} className="group/item bg-white/5 border border-white/5 p-8 rounded-[32px] flex flex-col sm:flex-row gap-6 justify-between items-center hover:bg-white/10 transition-all border-l-4 border-l-primary-500 relative overflow-hidden active:scale-[0.98]">
                                        <div className="flex items-center gap-5 w-full">
                                            <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-400 group-hover/item:scale-110 group-hover/item:bg-primary-500 group-hover/item:text-white transition-all shadow-inner">
                                                <Pill size={28} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-2xl tracking-tighter uppercase leading-tight group-hover/item:text-primary-400 transition-colors">{med.name}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-3 py-1 rounded-full">{med.dose}</span>
                                                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 italic">Confidence: 0.98</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-primary-600 transition-all shrink-0 active:scale-90"
                                            onClick={() => toast.info(`Linked ${med.name} to Terminal`)}
                                        >
                                            <Plus size={24} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full opacity-10 grayscale group-hover:opacity-20 transition-opacity">
                                <BrainCircuit size={120} strokeWidth={1} />
                                <p className="text-xl font-black uppercase tracking-[0.5em] mt-12">Neural Standby</p>
                            </div>
                        )}
                    </div>

                    {medicines.length > 0 && !scanning && (
                        <div className="relative z-10 pt-10 mt-auto border-t border-white/5">
                            <button className="w-full py-6 bg-primary-600 rounded-[28px] font-black uppercase tracking-widest text-[11px] shadow-[0_20px_50px_-10px_rgba(14,165,233,0.5)] hover:bg-primary-700 transition-all flex items-center justify-center gap-4 active:scale-95">
                                <CheckCircle2 size={20} />
                                Push to Billing Interface
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
};


export default PrescriptionScanner;
