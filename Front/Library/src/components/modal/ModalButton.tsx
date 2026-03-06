import React from 'react';

interface ModalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
}

function ModalButton({ variant = 'primary', children, className = '', ...props }: ModalButtonProps) {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700',
    };

    return (
        <button
            className={`px-6 sm:px-12 py-3 sm:py-4 rounded-full font-medium text-sm sm:text-base transition cursor-pointer disabled:cursor-not-allowed ${variants[variant]} ${className}`.trim()}
            {...props}
        >
            {children}
        </button>
    );
}

export default ModalButton;
