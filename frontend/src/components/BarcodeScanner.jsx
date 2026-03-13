import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera } from '../constants/icons';

const BarcodeScanner = ({ onScan, onClose }) => {
    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 10, 
                qrbox: { width: 250, height: 150 },
                aspectRatio: 1.0
            },
            /* verbose= */ false
        );

        scanner.render(
            (decodedText) => {
                scanner.clear().then(() => {
                    onScan(decodedText);
                }).catch(err => {
                    console.error("Failed to clear scanner", err);
                    onScan(decodedText);
                });
            },
            (error) => {
                // Ignore errors as they happen constantly during scanning
            }
        );

        return () => {
            scanner.clear().catch(error => {
                console.error("Failed to clear scanner on unmount", error);
            });
        };
    }, [onScan]);

    return (
        <div className="fixed inset-0 z-[300] bg-black/90 flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-white rounded-[40px] overflow-hidden relative shadow-2xl">
                <div className="p-6 bg-pharmacy-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Camera size={20} className="text-primary-400" />
                        <span className="font-black uppercase tracking-widest text-[10px]">Laser Terminal Active</span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-4 bg-slate-50">
                    <div id="reader" className="overflow-hidden rounded-2xl border-none"></div>
                </div>

                <div className="p-8 text-center bg-white border-t border-pharmacy-50">
                    <p className="text-xs font-bold text-slate-500 italic mb-2">Center the barcode within the scanner frame.</p>
                    <div className="h-1.5 w-24 bg-primary-100 rounded-full mx-auto overflow-hidden">
                        <div className="h-full bg-primary-600 w-1/2 animate-shimmer"></div>
                    </div>
                </div>
            </div>

            <style>{`
                #reader blockquote {
                    display: none !important;
                }
                #reader button {
                    background: #1e293b !important;
                    color: white !important;
                    border: none !important;
                    padding: 12px 24px !important;
                    border-radius: 16px !important;
                    font-weight: 800 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    font-size: 10px !important;
                    cursor: pointer !important;
                    margin-top: 10px !important;
                }
                #reader select {
                    padding: 10px !important;
                    border-radius: 12px !important;
                    border: 1px solid #e2e8f0 !important;
                    margin: 10px 0 !important;
                }
                #reader__scan_region video {
                    border-radius: 16px !important;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite linear;
                }
            `}</style>
        </div>
    );
};

export default BarcodeScanner;
