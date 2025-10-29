import React from 'react';
import type { GlobalParams as GlobalParamsType } from '../types';
import { DollarSign, Percent, Calendar } from 'lucide-react';

interface GlobalParamsProps {
  params: GlobalParamsType;
  onUpdate: (params: Partial<GlobalParamsType>) => void;
}

export const GlobalParams: React.FC<GlobalParamsProps> = ({ params, onUpdate }) => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6 backdrop-blur-sm animate-slide-up">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Global Parameters
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            Avg Ticket Size (New User)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">₹</span>
            <input
              type="number"
              value={params.avgTicketSize}
              onChange={(e) => onUpdate({ avgTicketSize: parseInt(e.target.value) || 0 })}
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 group-hover:shadow-md"
            />
          </div>
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-purple-500" />
            Repeat Ticket Size
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">₹</span>
            <input
              type="number"
              value={params.repeatTicketSize}
              onChange={(e) => onUpdate({ repeatTicketSize: parseInt(e.target.value) || 0 })}
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all duration-200 hover:border-purple-300 dark:hover:border-purple-500 group-hover:shadow-md"
            />
          </div>
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Percent className="w-4 h-4 text-pink-500" />
            Repeat Conversion Rate (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={(params.repeatConversionRate * 100).toFixed(2)}
              onChange={(e) => onUpdate({ repeatConversionRate: parseFloat(e.target.value) / 100 || 0 })}
              className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all duration-200 hover:border-pink-300 dark:hover:border-pink-500 group-hover:shadow-md"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">%</span>
          </div>
        </div>
        <div className="group">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            Number of Months
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={params.numberOfMonths}
            onChange={(e) => onUpdate({ numberOfMonths: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500 group-hover:shadow-md"
          />
        </div>
      </div>
    </div>
  );
};
