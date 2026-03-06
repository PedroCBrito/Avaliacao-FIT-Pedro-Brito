import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-gray-100 rounded-xl shadow-xl w-full max-w-3xl mx-4 p-6 flex flex-col gap-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                </div>
                {children}
            </div>
        </div>,
        document.body
    );
}

export default Modal;
