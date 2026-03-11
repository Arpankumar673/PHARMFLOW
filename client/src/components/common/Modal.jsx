import React, { useEffect } from 'react';
import { X } from '../../constants/icons';
import { clsx } from 'clsx';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-primary-950/40 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={clsx(
                "relative bg-white w-full shadow-[0_-20px_60px_rgba(0,0,0,0.15)] sm:shadow-2xl transition-all duration-500",
                "rounded-t-[40px] sm:rounded-[40px] max-h-[92vh] flex flex-col",
                "animate-slide-up-modal sm:animate-scale-up-modal",
                maxWidth
            )}>
                {/* Mobile Handle */}
                <div className="sm:hidden flex justify-center py-4">
                    <div className="w-12 h-1.5 bg-pharmacy-100 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="px-8 pb-6 pt-2 sm:pt-8 flex items-center justify-between border-b border-pharmacy-50">
                    <div>
                        <h3 className="text-xl font-black text-pharmacy-900 uppercase tracking-tight">{title}</h3>
                        <div className="h-1 w-12 bg-primary-600 rounded-full mt-1.5"></div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-pharmacy-50 text-pharmacy-400 rounded-2xl hover:bg-pharmacy-100 transition-colors active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    {children}
                </div>
            </div>

            <style>{`
                @keyframes slide-up-modal {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                @keyframes scale-up-modal {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-slide-up-modal {
                    animation: slide-up-modal 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .animate-scale-up-modal {
                    animation: scale-up-modal 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
            `}</style>
        </div>
    );
};

export default Modal;
