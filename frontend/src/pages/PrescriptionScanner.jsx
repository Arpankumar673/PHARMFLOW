import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import Webcam from 'react-webcam';
import {
    Camera,
    Upload,
    Pill,
    Plus,
    Loader2,
    CheckCircle2,
    FileText,
    BrainCircuit,
    PackageCheck,
    AlertCircle,
    X,
    Maximize2
} from '../constants/icons';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const PrescriptionScanner = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [medicines, setMedicines] = useState([]);
    const [inventoryMatch, setInventoryMatch] = useState({});
    const [matchedMedicines, setMatchedMedicines] = useState([]);
    const [cameraOn, setCameraOn] = useState(false);
    const fileInputRef = useRef(null);
    const webcamRef = useRef(null);

    // Redirect to login if no user
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size exceeds 5MB limit");
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
                setCameraOn(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setImage(imageSrc);
            setCameraOn(false);
            toast.success("Image captured from camera!");
        }
    };

    const startScan = async () => {
        setScanning(true);
        try {
            const res = await api.post('/prescription/scan', { image });
            const detectedMeds = res.data.data.medicines || [];
            setMedicines(detectedMeds);
            
            // Inventory Matching
            const matches = {};
            const fullMatches = [];
            for (const med of detectedMeds) {
                try {
                    const searchRes = await api.get(`/inventory/search?name=${med.name}`);
                    const foundItems = searchRes.data.data;
                    if (foundItems.length > 0) {
                        matches[med.name] = foundItems[0]; 
                        fullMatches.push(foundItems[0]);
                    } else {
                        matches[med.name] = null;
                    }
                } catch (e) {
                    console.error("Match error for", med.name, e);
                    matches[med.name] = null;
                }
            }
            setInventoryMatch(matches);
            setMatchedMedicines(fullMatches);
            toast.success('Neural extraction complete!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Synaptic breach: Neural link failed');
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-primary-100/50">Neural Extraction</span>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-pharmacy-900 tracking-tighter uppercase leading-none">AI Rx <span className="text-primary-600">Scanner</span></h1>
                    <p className="text-xs md:text-sm text-pharmacy-500 font-medium italic mt-2 opacity-60">High-fidelity OCR engine for automated prescription extraction.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
                {/* Input Area */}
                <div className="bg-white p-6 md:p-10 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-pharmacy bg-[size:30px_30px] opacity-[0.02]"></div>

                    {cameraOn ? (
                        <div className="w-full h-full flex flex-col gap-6 relative z-10 animate-scale-in">
                            <div className="flex-1 relative rounded-xl overflow-hidden border-4 border-slate-50 shadow-inner bg-black min-h-[300px]">
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: "environment" }}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 text-white">
                                    <button 
                                        onClick={() => setCameraOn(false)}
                                        className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-rose-500 transition-all"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setCameraOn(false)}
                                    className="flex-1 py-4 border-2 border-slate-100 rounded-xl font-black uppercase tracking-widest text-[9px] text-slate-400 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={capture}
                                    className="flex-[2] bg-primary-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-primary-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <Maximize2 size={18} />
                                    Capture
                                </button>
                            </div>
                        </div>
                    ) : !image ? (
                        <div className="text-center relative z-10">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                <Camera size={48} md:size={56} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-pharmacy-900 uppercase tracking-tighter mb-4 text-center">Analyze Prescription</h3>
                            <p className="text-xs md:text-sm text-pharmacy-400 mb-8 font-medium italic opacity-60 max-w-[280px] mx-auto leading-relaxed text-center italic">Scan directly with your camera or upload a saved protocol.</p>

                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*,.pdf"
                            />
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => setCameraOn(true)}
                                    className="bg-primary-600 text-white px-8 md:px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-primary-700 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                                >
                                    <Camera size={18} />
                                    Camera
                                </button>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="bg-slate-900 text-white px-8 md:px-10 py-4 rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
                                >
                                    <Upload size={18} />
                                    Upload
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col gap-8 relative z-10 animate-scale-in">
                            <div className="flex-1 relative rounded-xl overflow-hidden border-2 border-slate-100 shadow-inner group/img min-h-[300px]">
                                <img src={image} className="w-full h-full object-contain bg-slate-50" alt="Prescription" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <button
                                        onClick={() => setImage(null)}
                                        className="bg-white text-pharmacy-900 px-6 py-2 rounded-full font-black uppercase tracking-widest text-[9px]"
                                    >
                                        Drop Identity
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setImage(null)}
                                    className="flex-1 py-4 border-2 border-slate-100 rounded-xl font-black uppercase tracking-widest text-[9px] text-slate-400 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={startScan}
                                    disabled={scanning}
                                    className="flex-[2] py-4 bg-primary-600 text-white rounded-xl font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-primary-700 shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all overflow-hidden relative"
                                >
                                    {scanning ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                                    {scanning ? 'Neural Decoding...' : 'Execute Scan'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Area */}
                <div className="bg-slate-900 p-6 md:p-10 rounded-2xl text-white shadow-2xl relative overflow-hidden flex flex-col min-h-[400px] md:min-h-[500px]">
                    <div className="absolute inset-0 bg-grid-white opacity-[0.03]"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>

                    <div className="relative z-10 mb-8 flex items-center justify-between border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                <FileText size={20} className="text-primary-400" />
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Extraction Node</h3>
                                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-tighter">Status: {scanning ? 'Synchronizing' : 'Verified'}</p>
                            </div>
                        </div>
                        {medicines.length > 0 && !scanning && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                                {medicines.length} Entities
                            </span>
                        )}
                    </div>

                    <div className="relative z-10 flex-1 overflow-y-auto pr-1">
                        {scanning ? (
                            <div className="flex flex-col items-center justify-center h-full py-16">
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <BrainCircuit size={32} className="text-primary-400 animate-pulse" />
                                    </div>
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-primary-400 animate-pulse text-center">Scanning vector paths...</p>
                            </div>
                        ) : medicines.length > 0 ? (
                            <div className="space-y-4">
                                {medicines.map((med, i) => {
                                    const match = inventoryMatch[med.name];
                                    return (
                                        <div key={i} className="bg-white/5 border border-white/5 p-5 md:p-6 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-center hover:bg-white/10 transition-all border-l-4 border-l-primary-500 relative overflow-hidden group/item">
                                            <div className="flex items-center gap-4 w-full">
                                                <div className={clsx(
                                                    "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center transition-all shadow-inner",
                                                    match 
                                                        ? "bg-emerald-500/10 text-emerald-400" 
                                                        : "bg-rose-500/10 text-rose-400"
                                                )}>
                                                    {match ? <PackageCheck size={24} /> : <AlertCircle size={24} />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-lg md:text-xl tracking-tighter uppercase leading-tight group-hover/item:text-primary-400 transition-colors truncate uppercase">{med.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{med.dose || 'Standard'}</span>
                                                        <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                                                        <span className={clsx(
                                                            "text-[8px] md:text-[9px] font-black uppercase tracking-widest italic",
                                                            match ? "text-emerald-400" : "text-rose-400"
                                                        )}>
                                                            {match ? `Stock: ${match.quantity}` : 'No Stock'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-all shrink-0 active:scale-90"
                                                onClick={() => {
                                                    if (match) {
                                                        navigate('/billing', { state: { medicines: [match] } });
                                                    } else {
                                                        toast.warning('Not in inventory grid.');
                                                    }
                                                }}
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full py-12 opacity-10">
                                <BrainCircuit size={100} strokeWidth={1} />
                                <p className="text-xs md:text-sm font-black uppercase tracking-widest mt-8 text-center italic">Initialize Scan Protocol</p>
                            </div>
                        )}
                    </div>
 
                    {medicines.length > 0 && !scanning && (
                        <div className="relative z-10 pt-8 mt-auto border-t border-white/5">
                            <button 
                                onClick={() => navigate('/billing', { state: { medicines: matchedMedicines } })}
                                className="w-full py-4 bg-primary-600 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-primary-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                            >
                                <CheckCircle2 size={18} />
                                Push to Billing
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PrescriptionScanner;
