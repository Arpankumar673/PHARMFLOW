import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { X, Camera, RotateCw, AlertCircle } from '../constants/icons';

const BarcodeScanner = ({ onScan, onClose }) => {
    const videoRef = useRef(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const [error, setError] = useState('');
    const codeReaderRef = useRef(null);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        codeReader.listVideoInputDevices()
            .then((videoInputDevices) => {
                setDevices(videoInputDevices);
                if (videoInputDevices.length > 0) {
                    // Pre-select the back camera if available
                    const backCamera = videoInputDevices.find(device =>
                        device.label.toLowerCase().includes('back') ||
                        device.label.toLowerCase().includes('rear')
                    );
                    setSelectedDeviceId(backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId);
                }
            })
            .catch((err) => {
                setError('No camera found or permission denied');
                console.error(err);
            });

        return () => {
            codeReader.reset();
        };
    }, []);

    useEffect(() => {
        if (!selectedDeviceId || !videoRef.current) return;

        codeReaderRef.current.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, err) => {
                if (result) {
                    onScan(result.getText());
                    codeReaderRef.current.reset();
                }
                if (err && !(err.name === 'NotFoundException')) {
                    console.error(err);
                }
            }
        );

        return () => {
            codeReaderRef.current.reset();
        };
    }, [selectedDeviceId, onScan]);

    const switchCamera = () => {
        const nextIndex = (devices.findIndex(d => d.deviceId === selectedDeviceId) + 1) % devices.length;
        setSelectedDeviceId(devices[nextIndex].deviceId);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col animate-fade-in">
            <div className="p-4 flex items-center justify-between text-white z-10">
                <div className="flex items-center gap-2">
                    <Camera size={20} className="text-primary-400" />
                    <span className="font-bold uppercase tracking-widest text-xs">Mobile Scanner Terminal</span>
                </div>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" />

                {/* Scanner Overlay */}
                <div className="absolute inset-0 pointer-events-none border-[40px] border-black/40 flex items-center justify-center">
                    <div className="w-72 h-48 border-2 border-primary-500 rounded-2xl relative">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-xl -translate-x-1 -translate-y-1"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-xl translate-x-1 -translate-y-1"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-xl -translate-x-1 translate-y-1"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-xl translate-x-1 translate-y-1"></div>

                        {/* Scanning Line Animation */}
                        <div className="absolute inset-x-0 h-1 bg-primary-500/50 shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-scan-line"></div>
                    </div>
                </div>

                {error && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center">
                        <AlertCircle size={48} className="text-red-500 mb-4" />
                        <h3 className="text-white font-bold text-lg mb-2">Camera Error</h3>
                        <p className="text-gray-400 text-sm max-w-xs">{error}</p>
                    </div>
                )}
            </div>

            <div className="p-8 pb-12 flex items-center justify-center gap-6 z-10">
                {devices.length > 1 && (
                    <button
                        onClick={switchCamera}
                        className="p-4 bg-white/10 rounded-2xl text-white flex items-center gap-2 hover:bg-white/20 transition-colors"
                    >
                        <RotateCw size={24} />
                        <span className="font-bold text-sm">Switch Camera</span>
                    </button>
                )}
                <div className="text-white/40 text-[10px] font-black uppercase tracking-widest text-center">
                    Center the barcode within the frame<br />to initiate medicine lookup
                </div>
            </div>

            <style>{`
                @keyframes scan-line {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan-line {
                    animation: scan-line 2.5s infinite linear;
                }
            `}</style>
        </div>
    );
};

export default BarcodeScanner;
