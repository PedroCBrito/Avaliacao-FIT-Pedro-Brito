import React from "react";

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder = "Buscar", className = '', ...props }) => {
    return (
        <input
            type="text"
            placeholder={placeholder}
            className={`bg-white rounded-xl px-4 py-3 text-lg text-gray-1000 placeholder-black border border-transparent focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-200 ${className}`.trim()}
            {...props}
        />
    );
};

export default SearchBar;