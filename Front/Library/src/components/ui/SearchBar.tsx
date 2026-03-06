import React from "react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Buscar", className = '', ...props }) => {
    return (
        <div className={`relative ${className}`.trim()}>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-white rounded-xl px-4 py-3 pr-12 text-lg text-gray-900 placeholder-black border border-transparent focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
                {...props}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <i className="fa-solid fa-magnifying-glass"></i>
            </span>
        </div>
    );
};

export default SearchBar;