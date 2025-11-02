import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

const Select: React.FC<SelectProps> = ({ label, id, children, ...props }) => {
    const selectId = id || props.name || label.replace(/\s+/g, '-').toLowerCase();
    return (
        <div>
            <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
                id={selectId}
                className="block w-full px-3 py-2 border border-gray-300 bg-gray-50/50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                {...props}
            >
                {children}
            </select>
        </div>
    );
};

export default Select;