import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderButtonProps {
    to: string;
    children: React.ReactNode;
    variant?: 'primary' | 'delete';
    className?: string;
}

export const HeaderButton: React.FC<HeaderButtonProps> = ({ 
    to, 
    children, 
    variant = 'primary', 
    className = '',
}) => {
    const baseStyles = 'inline-block rounded-md text-xl cursor-pointer';
    
    const variants = {
        primary: 'text-bold px-4 py-2 font-medium',
        delete: 'text-red-800 px-4 py-2 font-medium',
    };

    return (
        <Link
            to={to}
            className={`${baseStyles} ${variants[variant]} ${className}`.trim()}
        >
            {children}
        </Link>
    );
};

export default HeaderButton;
