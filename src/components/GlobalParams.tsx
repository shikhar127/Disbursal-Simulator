import React from 'react';
import type { GlobalParams as GlobalParamsType } from '../types';

interface GlobalParamsProps {
  params: GlobalParamsType;
  onUpdate: (params: Partial<GlobalParamsType>) => void;
}

export const GlobalParams: React.FC<GlobalParamsProps> = ({ params, onUpdate }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Global Parameters</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avg Ticket Size (New User)
          </label>
          <input
            type="number"
            value={params.avgTicketSize}
            onChange={(e) => onUpdate({ avgTicketSize: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Repeat Ticket Size
          </label>
          <input
            type="number"
            value={params.repeatTicketSize}
            onChange={(e) => onUpdate({ repeatTicketSize: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Repeat Conversion Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={(params.repeatConversionRate * 100).toFixed(2)}
            onChange={(e) => onUpdate({ repeatConversionRate: parseFloat(e.target.value) / 100 || 0 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Months
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={params.numberOfMonths}
            onChange={(e) => onUpdate({ numberOfMonths: parseInt(e.target.value) || 1 })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>
    </div>
  );
};
