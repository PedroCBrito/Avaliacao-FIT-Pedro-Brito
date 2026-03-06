import React from 'react';
import { Link } from 'react-router-dom';

type HeaderButtonAsLink = {
    to: string;
    onClick?: never;
};

type HeaderButtonAsButton = {
    to?: never;
    onClick: () => void;
};

type HeaderButtonProps = (HeaderButtonAsLink | HeaderButtonAsButton) & {
    children: React.ReactNode;
    variant?: 'primary' | 'delete';
    className?: string;
};

export const HeaderButton: React.FC<HeaderButtonProps> = ({
    to,
    onClick,
    children,
    variant = 'primary',
    className = '',
}) => {
    const baseStyles = 'inline-block rounded-md text-xl cursor-pointer';

    const variants = {
        primary: 'text-bold px-4 py-2 font-medium',
        delete: 'text-red-800 px-4 py-2 font-medium',
    };

    const combined = `${baseStyles} ${variants[variant]} ${className}`.trim();

    if (to) {
        return (
            <Link to={to} className={combined}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={combined}>
            {children}
        </button>
    );
};

export default HeaderButton;
