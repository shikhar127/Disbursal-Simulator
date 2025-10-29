import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { GlobalParams } from './components/GlobalParams';
import { DataTable } from './components/DataTable';
import { Charts } from './components/Charts';
import { SummaryCards } from './components/SummaryCards';
import { ScenarioManager } from './components/ScenarioManager';

function App() {
  const {
    scenarios,
    activeScenarioId,
    darkMode,
    history,
    historyIndex,
    addScenario,
    deleteScenario,
    duplicateScenario,
    setActiveScenario,
    updateGlobalParams,
    updateMonthlyData,
    resetScenario,
    importScenarioData,
    toggleDarkMode,
    undo,
    redo,
  } = useStore();

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!activeScenario) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            No scenarios available
          </h1>
          <button
            onClick={() => addScenario('New Scenario', 'Custom')}
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create First Scenario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-all duration-500">
      <div className="container mx-auto px-4 py-8">
        {/* Header with gradient */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-slide-down">
              Loan Disbursal Simulator
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 animate-slide-up">
            Interactive loan disbursement funnel analysis with scenario comparison
          </p>
        </div>

        {/* Scenario Manager */}
        <ScenarioManager
          scenarios={scenarios}
          activeScenarioId={activeScenarioId}
          darkMode={darkMode}
          onAddScenario={addScenario}
          onDeleteScenario={deleteScenario}
          onDuplicateScenario={duplicateScenario}
          onSetActiveScenario={setActiveScenario}
          onResetScenario={resetScenario}
          onImportData={importScenarioData}
          onToggleDarkMode={toggleDarkMode}
          onUndo={undo}
          onRedo={redo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />

        {/* Global Parameters */}
        <GlobalParams
          params={activeScenario.globalParams}
          onUpdate={(params) => updateGlobalParams(activeScenarioId, params)}
        />

        {/* Summary Cards */}
        <SummaryCards scenario={activeScenario} />

        {/* Data Table */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6 animate-scale-in">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Monthly Data - {activeScenario.name}
          </h2>
          <DataTable
            data={activeScenario.monthlyData}
            onUpdate={(monthIndex, field, value) => {
              updateMonthlyData(activeScenarioId, monthIndex, { [field]: value });
            }}
          />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Visualizations
          </h2>
          <Charts scenarios={scenarios} />
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          <p>
            Built with React, TypeScript, Tailwind CSS, Recharts, and Zustand
          </p>
          <p className="text-sm mt-2">
            All calculations are performed in real-time. Data is automatically saved to localStorage.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
