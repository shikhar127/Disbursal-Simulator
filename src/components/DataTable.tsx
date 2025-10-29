import React, { useState } from 'react';
import type { MonthlyData } from '../types';
import { validatePercentage, validateDownloads } from '../utils/calculations';

interface DataTableProps {
  data: MonthlyData[];
  onUpdate: (monthIndex: number, field: keyof MonthlyData, value: number) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ data, onUpdate }) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);

  const handleCellClick = (rowIndex: number, colName: string, isEditable: boolean) => {
    if (isEditable) {
      setEditingCell({ row: rowIndex, col: colName });
    }
  };

  const handleCellChange = (rowIndex: number, field: keyof MonthlyData, value: string) => {
    let numValue: number;

    if (field === 'downloads') {
      numValue = parseInt(value) || 0;
    } else if (['loanPageRate', 'underwritingRate', 'disbursalRate', 'conversionRate'].includes(field)) {
      numValue = parseFloat(value) / 100 || 0;
    } else {
      numValue = parseFloat(value) || 0;
    }

    onUpdate(rowIndex, field, numValue);
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const renderCell = (
    rowIndex: number,
    field: keyof MonthlyData,
    value: number,
    isEditable: boolean,
    isPercentage: boolean = false
  ) => {
    const cellKey = `${rowIndex}-${field}`;
    const isEditing = editingCell?.row === rowIndex && editingCell?.col === field;
    const isInvalid =
      isEditable &&
      ((isPercentage && !validatePercentage(value)) ||
       (field === 'downloads' && !validateDownloads(value)));

    const displayValue = isPercentage ? (value * 100).toFixed(2) : value.toFixed(2);

    return (
      <td
        key={cellKey}
        onClick={() => handleCellClick(rowIndex, field, isEditable)}
        className={`px-4 py-3 text-sm transition-all duration-150 ${
          isEditable
            ? 'bg-white dark:bg-gray-800 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-700 hover:shadow-inner'
            : field === 'cumulativeNewUsers'
            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 font-semibold'
            : 'bg-gray-50 dark:bg-gray-700/50'
        } ${isInvalid ? 'border-2 border-red-500 animate-pulse' : 'border border-gray-200 dark:border-gray-600'}`}
      >
        {isEditing ? (
          <input
            type="number"
            step={isPercentage ? '0.01' : field === 'downloads' ? '1' : '0.01'}
            value={isPercentage ? (value * 100).toFixed(2) : value}
            onChange={(e) => handleCellChange(rowIndex, field, e.target.value)}
            onBlur={handleCellBlur}
            autoFocus
            className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        ) : (
          <span className="text-gray-900 dark:text-gray-100">
            {displayValue}
            {isPercentage && '%'}
          </span>
        )}
      </td>
    );
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="max-h-[600px] overflow-y-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 shadow-md">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                Downloads
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                Loan Page %
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                Underwriting %
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                Disbursal %
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                % Conversion
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                Total New Loans
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                Disbursal from New (Cr)
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600 bg-blue-100 dark:bg-blue-900/30">
                Cumulative New Users
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                Repeat Disbursal (Cr)
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider border border-gray-300 dark:border-gray-600">
                Total (Cr)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={row.month} className={`transition-colors duration-150 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-gray-800 dark:hover:to-gray-800 ${idx % 2 === 0 ? 'bg-white/50 dark:bg-gray-900/30' : 'bg-gray-50/30 dark:bg-gray-800/20'}`}>
                <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                  {row.month}
                </td>
                {renderCell(idx, 'downloads', row.downloads, true, false)}
                {renderCell(idx, 'loanPageRate', row.loanPageRate, true, true)}
                {renderCell(idx, 'underwritingRate', row.underwritingRate, true, true)}
                {renderCell(idx, 'disbursalRate', row.disbursalRate, true, true)}
                {renderCell(idx, 'conversionRate', row.conversionRate, true, true)}
                {renderCell(idx, 'totalNewLoans', row.totalNewLoans, false, false)}
                {renderCell(idx, 'disbursalFromNew', row.disbursalFromNew, false, false)}
                {renderCell(idx, 'cumulativeNewUsers', row.cumulativeNewUsers, false, false)}
                {renderCell(idx, 'repeatDisbursal', row.repeatDisbursal, false, false)}
                {renderCell(idx, 'total', row.total, false, false)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
