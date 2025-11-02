
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  const inputId = id || props.name;
  return (
    <div>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        id={inputId}
        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
        {...props}
      />
    </div>
  );
};

export default Input;