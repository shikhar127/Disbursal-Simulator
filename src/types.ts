export interface GlobalParams {
  avgTicketSize: number;
  repeatTicketSize: number;
  repeatConversionRate: number; // stored as decimal (0.1 for 10%)
  numberOfMonths: number;
}

export interface MonthlyData {
  month: number;
  downloads: number;
  loanPageRate: number; // stored as decimal (0.9 for 90%)
  underwritingRate: number; // stored as decimal
  disbursalRate: number; // stored as decimal
  conversionRate: number; // stored as decimal
  // Calculated fields
  totalNewLoans: number;
  disbursalFromNew: number; // in Crores
  cumulativeNewUsers: number;
  repeatDisbursal: number; // in Crores
  total: number; // in Crores
}

export interface Scenario {
  id: string;
  name: string;
  globalParams: GlobalParams;
  monthlyData: MonthlyData[];
}

export interface AppState {
  scenarios: Scenario[];
  activeScenarioId: string;
  darkMode: boolean;
  history: Scenario[][];
  historyIndex: number;
}

export type PresetType = 'Optimistic' | 'Conservative' | 'Custom';

export interface PresetConfig {
  loanPageRate: number;
  underwritingRate: number;
  disbursalRate: number;
  conversionRate: number;
}

export const PRESETS: Record<PresetType, PresetConfig> = {
  Optimistic: {
    loanPageRate: 0.9,
    underwritingRate: 0.95,
    disbursalRate: 0.6,
    conversionRate: 0.03,
  },
  Conservative: {
    loanPageRate: 0.4,
    underwritingRate: 0.85,
    disbursalRate: 0.15,
    conversionRate: 0.01,
  },
  Custom: {
    loanPageRate: 0.5,
    underwritingRate: 0.8,
    disbursalRate: 0.3,
    conversionRate: 0.02,
  },
};

export const DEFAULT_GLOBAL_PARAMS: GlobalParams = {
  avgTicketSize: 100000,
  repeatTicketSize: 50000,
  repeatConversionRate: 0.1,
  numberOfMonths: 25,
};
