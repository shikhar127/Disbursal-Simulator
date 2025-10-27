import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scenario, MonthlyData, GlobalParams } from '../types';
import { PRESETS, DEFAULT_GLOBAL_PARAMS } from '../types';
import { calculateMonthlyData, createEmptyMonthlyData } from '../utils/calculations';

interface StoreState {
  scenarios: Scenario[];
  activeScenarioId: string;
  darkMode: boolean;
  history: Scenario[][];
  historyIndex: number;

  // Actions
  addScenario: (name: string, preset?: keyof typeof PRESETS) => void;
  deleteScenario: (id: string) => void;
  duplicateScenario: (id: string) => void;
  setActiveScenario: (id: string) => void;
  updateScenarioName: (id: string, name: string) => void;
  updateGlobalParams: (id: string, params: Partial<GlobalParams>) => void;
  updateMonthlyData: (id: string, monthIndex: number, data: Partial<MonthlyData>) => void;
  bulkUpdateMonthlyData: (id: string, monthIndices: number[], field: keyof MonthlyData, value: number) => void;
  resetScenario: (id: string) => void;
  importScenarioData: (id: string, data: MonthlyData[]) => void;
  toggleDarkMode: () => void;
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

const createDefaultScenario = (id: string, name: string, preset: keyof typeof PRESETS = 'Custom'): Scenario => {
  const globalParams = { ...DEFAULT_GLOBAL_PARAMS };
  const presetConfig = PRESETS[preset];
  const monthlyData = createEmptyMonthlyData(globalParams.numberOfMonths, presetConfig);
  const calculated = calculateMonthlyData(monthlyData, globalParams);

  return {
    id,
    name,
    globalParams,
    monthlyData: calculated,
  };
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      scenarios: [
        createDefaultScenario('1', 'Optimistic', 'Optimistic'),
        createDefaultScenario('2', 'Conservative', 'Conservative'),
      ],
      activeScenarioId: '1',
      darkMode: false,
      history: [],
      historyIndex: -1,

      addScenario: (name, preset = 'Custom') => {
        const newId = Date.now().toString();
        const newScenario = createDefaultScenario(newId, name, preset);
        set((state) => ({
          scenarios: [...state.scenarios, newScenario],
          activeScenarioId: newId,
        }));
        get().saveHistory();
      },

      deleteScenario: (id) => {
        set((state) => {
          const filtered = state.scenarios.filter((s) => s.id !== id);
          if (filtered.length === 0) {
            return state; // Don't allow deleting all scenarios
          }
          return {
            scenarios: filtered,
            activeScenarioId: state.activeScenarioId === id ? filtered[0].id : state.activeScenarioId,
          };
        });
        get().saveHistory();
      },

      duplicateScenario: (id) => {
        const scenario = get().scenarios.find((s) => s.id === id);
        if (!scenario) return;

        const newId = Date.now().toString();
        const duplicated: Scenario = {
          ...scenario,
          id: newId,
          name: `${scenario.name} (Copy)`,
        };

        set((state) => ({
          scenarios: [...state.scenarios, duplicated],
          activeScenarioId: newId,
        }));
        get().saveHistory();
      },

      setActiveScenario: (id) => {
        set({ activeScenarioId: id });
      },

      updateScenarioName: (id, name) => {
        set((state) => ({
          scenarios: state.scenarios.map((s) =>
            s.id === id ? { ...s, name } : s
          ),
        }));
        get().saveHistory();
      },

      updateGlobalParams: (id, params) => {
        set((state) => {
          const scenarios = state.scenarios.map((scenario) => {
            if (scenario.id !== id) return scenario;

            const newParams = { ...scenario.globalParams, ...params };

            // If number of months changed, adjust monthly data
            let monthlyData = scenario.monthlyData;
            if (params.numberOfMonths !== undefined && params.numberOfMonths !== scenario.globalParams.numberOfMonths) {
              if (params.numberOfMonths > monthlyData.length) {
                // Add new months
                const lastMonth = monthlyData[monthlyData.length - 1];
                const newMonths = Array.from(
                  { length: params.numberOfMonths - monthlyData.length },
                  (_, i) => ({
                    month: monthlyData.length + i + 1,
                    downloads: lastMonth?.downloads ?? 1000,
                    loanPageRate: lastMonth?.loanPageRate ?? 0.5,
                    underwritingRate: lastMonth?.underwritingRate ?? 0.8,
                    disbursalRate: lastMonth?.disbursalRate ?? 0.3,
                    conversionRate: lastMonth?.conversionRate ?? 0.02,
                    totalNewLoans: 0,
                    disbursalFromNew: 0,
                    cumulativeNewUsers: 0,
                    repeatDisbursal: 0,
                    total: 0,
                  })
                );
                monthlyData = [...monthlyData, ...newMonths];
              } else {
                // Remove months
                monthlyData = monthlyData.slice(0, params.numberOfMonths);
              }
            }

            const calculated = calculateMonthlyData(monthlyData, newParams);

            return {
              ...scenario,
              globalParams: newParams,
              monthlyData: calculated,
            };
          });

          return { scenarios };
        });
        get().saveHistory();
      },

      updateMonthlyData: (id, monthIndex, data) => {
        set((state) => {
          const scenarios = state.scenarios.map((scenario) => {
            if (scenario.id !== id) return scenario;

            const monthlyData = scenario.monthlyData.map((month, idx) =>
              idx === monthIndex ? { ...month, ...data } : month
            );

            const calculated = calculateMonthlyData(monthlyData, scenario.globalParams);

            return {
              ...scenario,
              monthlyData: calculated,
            };
          });

          return { scenarios };
        });
        get().saveHistory();
      },

      bulkUpdateMonthlyData: (id, monthIndices, field, value) => {
        set((state) => {
          const scenarios = state.scenarios.map((scenario) => {
            if (scenario.id !== id) return scenario;

            const monthlyData = scenario.monthlyData.map((month, idx) =>
              monthIndices.includes(idx) ? { ...month, [field]: value } : month
            );

            const calculated = calculateMonthlyData(monthlyData, scenario.globalParams);

            return {
              ...scenario,
              monthlyData: calculated,
            };
          });

          return { scenarios };
        });
        get().saveHistory();
      },

      resetScenario: (id) => {
        set((state) => {
          const scenario = state.scenarios.find((s) => s.id === id);
          if (!scenario) return state;

          const preset = PRESETS.Custom;
          const monthlyData = createEmptyMonthlyData(scenario.globalParams.numberOfMonths, preset);
          const calculated = calculateMonthlyData(monthlyData, scenario.globalParams);

          const scenarios = state.scenarios.map((s) =>
            s.id === id ? { ...s, monthlyData: calculated } : s
          );

          return { scenarios };
        });
        get().saveHistory();
      },

      importScenarioData: (id, data) => {
        set((state) => {
          const scenarios = state.scenarios.map((scenario) => {
            if (scenario.id !== id) return scenario;

            const calculated = calculateMonthlyData(data, scenario.globalParams);

            return {
              ...scenario,
              monthlyData: calculated,
            };
          });

          return { scenarios };
        });
        get().saveHistory();
      },

      toggleDarkMode: () => {
        set((state) => ({ darkMode: !state.darkMode }));
      },

      saveHistory: () => {
        set((state) => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(JSON.parse(JSON.stringify(state.scenarios)));
          // Keep only last 50 states
          if (newHistory.length > 50) {
            newHistory.shift();
          }
          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            return {
              scenarios: JSON.parse(JSON.stringify(state.history[state.historyIndex - 1])),
              historyIndex: state.historyIndex - 1,
            };
          }
          return state;
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            return {
              scenarios: JSON.parse(JSON.stringify(state.history[state.historyIndex + 1])),
              historyIndex: state.historyIndex + 1,
            };
          }
          return state;
        });
      },
    }),
    {
      name: 'disbursal-simulator-storage',
    }
  )
);
