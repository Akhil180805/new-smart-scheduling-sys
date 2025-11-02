
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
        {icon}
      </div>
    </div>
  );
};

export default Card;
