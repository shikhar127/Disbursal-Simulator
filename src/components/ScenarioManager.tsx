import React, { useState } from 'react';
import type { Scenario } from '../types';
import { PRESETS } from '../types';
import { Download, Upload, Plus, Trash2, Copy, RotateCcw, Moon, Sun, Undo, Redo } from 'lucide-react';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ScenarioManagerProps {
  scenarios: Scenario[];
  activeScenarioId: string;
  darkMode: boolean;
  onAddScenario: (name: string, preset?: keyof typeof PRESETS) => void;
  onDeleteScenario: (id: string) => void;
  onDuplicateScenario: (id: string) => void;
  onSetActiveScenario: (id: string) => void;
  onResetScenario: (id: string) => void;
  onImportData: (id: string, data: any[]) => void;
  onToggleDarkMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const ScenarioManager: React.FC<ScenarioManagerProps> = ({
  scenarios,
  activeScenarioId,
  darkMode,
  onAddScenario,
  onDeleteScenario,
  onDuplicateScenario,
  onSetActiveScenario,
  onResetScenario,
  onImportData,
  onToggleDarkMode,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESETS>('Custom');

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId);

  const handleExportCSV = () => {
    if (!activeScenario) return;

    const csvData = activeScenario.monthlyData.map((row) => ({
      Month: row.month,
      Downloads: row.downloads,
      'Loan Page %': (row.loanPageRate * 100).toFixed(2),
      'Underwriting %': (row.underwritingRate * 100).toFixed(2),
      'Disbursal %': (row.disbursalRate * 100).toFixed(2),
      '% Conversion': (row.conversionRate * 100).toFixed(2),
      'Total New Loans': row.totalNewLoans.toFixed(2),
      'Disbursal from New (Cr)': row.disbursalFromNew.toFixed(2),
      'Cumulative New Users': row.cumulativeNewUsers.toFixed(2),
      'Repeat Disbursal (Cr)': row.repeatDisbursal.toFixed(2),
      'Total (Cr)': row.total.toFixed(2),
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeScenario.name}_data.csv`;
    link.click();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeScenario) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const importedData = results.data.map((row: any, idx: number) => ({
          month: idx + 1,
          downloads: parseInt(row.Downloads) || 0,
          loanPageRate: parseFloat(row['Loan Page %']) / 100 || 0,
          underwritingRate: parseFloat(row['Underwriting %']) / 100 || 0,
          disbursalRate: parseFloat(row['Disbursal %']) / 100 || 0,
          conversionRate: parseFloat(row['% Conversion']) / 100 || 0,
          totalNewLoans: 0,
          disbursalFromNew: 0,
          cumulativeNewUsers: 0,
          repeatDisbursal: 0,
          total: 0,
        }));
        onImportData(activeScenarioId, importedData);
      },
    });

    e.target.value = '';
  };

  const handleExportPDF = () => {
    if (!activeScenario) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Disbursal Simulator Report - ${activeScenario.name}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Global Parameters:`, 14, 35);
    doc.setFontSize(10);
    doc.text(`Avg Ticket Size: ₹${activeScenario.globalParams.avgTicketSize.toLocaleString()}`, 14, 42);
    doc.text(`Repeat Ticket Size: ₹${activeScenario.globalParams.repeatTicketSize.toLocaleString()}`, 14, 48);
    doc.text(`Repeat Conversion Rate: ${(activeScenario.globalParams.repeatConversionRate * 100).toFixed(2)}%`, 14, 54);

    const tableData = activeScenario.monthlyData.map((row) => [
      row.month,
      row.downloads,
      `${(row.loanPageRate * 100).toFixed(2)}%`,
      `${(row.underwritingRate * 100).toFixed(2)}%`,
      `${(row.disbursalRate * 100).toFixed(2)}%`,
      row.totalNewLoans.toFixed(2),
      row.disbursalFromNew.toFixed(2),
      row.cumulativeNewUsers.toFixed(2),
      row.repeatDisbursal.toFixed(2),
      row.total.toFixed(2),
    ]);

    autoTable(doc, {
      head: [['Month', 'Downloads', 'Loan %', 'UW %', 'Disb %', 'New Loans', 'New (Cr)', 'Cumul.', 'Repeat (Cr)', 'Total (Cr)']],
      body: tableData,
      startY: 65,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
    });

    doc.save(`${activeScenario.name}_report.pdf`);
  };

  const handleAddScenario = () => {
    if (newScenarioName.trim()) {
      onAddScenario(newScenarioName, selectedPreset);
      setNewScenarioName('');
      setShowAddDialog(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Scenario Tabs */}
        <div className="flex flex-wrap gap-2">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => onSetActiveScenario(scenario.id)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                scenario.id === activeScenarioId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {scenario.name}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo className="w-5 h-5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
            title="Add Scenario"
          >
            <Plus className="w-5 h-5" />
            <span>Add</span>
          </button>
          <button
            onClick={() => activeScenario && onDuplicateScenario(activeScenarioId)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            title="Duplicate Scenario"
          >
            <Copy className="w-5 h-5" />
            <span>Duplicate</span>
          </button>
          <button
            onClick={() => activeScenario && onResetScenario(activeScenarioId)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600"
            title="Reset Scenario"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => scenarios.length > 1 && onDeleteScenario(activeScenarioId)}
            disabled={scenarios.length === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Scenario"
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
          <label className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 cursor-pointer">
            <Upload className="w-5 h-5" />
            <span>Import CSV</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
            title="Export CSV"
          >
            <Download className="w-5 h-5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600"
            title="Export PDF"
          >
            <Download className="w-5 h-5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Add Scenario Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Add New Scenario</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scenario Name
                </label>
                <input
                  type="text"
                  value={newScenarioName}
                  onChange={(e) => setNewScenarioName(e.target.value)}
                  placeholder="Enter scenario name"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preset
                </label>
                <select
                  value={selectedPreset}
                  onChange={(e) => setSelectedPreset(e.target.value as keyof typeof PRESETS)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="Optimistic">Optimistic</option>
                  <option value="Conservative">Conservative</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAddScenario}
                  className="flex-1 px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowAddDialog(false);
                    setNewScenarioName('');
                  }}
                  className="flex-1 px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
