import type { MonthlyData, GlobalParams } from '../types';

export const calculateMonthlyData = (
  monthlyData: MonthlyData[],
  globalParams: GlobalParams
): MonthlyData[] => {
  const calculated: MonthlyData[] = [];

  for (let i = 0; i < monthlyData.length; i++) {
    const month = monthlyData[i];

    // Calculate Total New Loans
    const totalNewLoans =
      month.downloads *
      month.loanPageRate *
      month.underwritingRate *
      month.disbursalRate;

    // Calculate Disbursal from New (in Crores)
    const disbursalFromNew =
      (totalNewLoans * globalParams.avgTicketSize) / 10000000;

    // Calculate Cumulative New Users (running sum)
    const cumulativeNewUsers =
      (i > 0 ? calculated[i - 1].cumulativeNewUsers : 0) + totalNewLoans;

    // Calculate Repeat Disbursal (in Crores)
    // Month 1 = 0, Month N uses previous month's cumulative users
    const repeatDisbursal = i === 0
      ? 0
      : (calculated[i - 1].cumulativeNewUsers *
         globalParams.repeatConversionRate *
         globalParams.repeatTicketSize) / 10000000;

    // Calculate Total (in Crores)
    const total = disbursalFromNew + repeatDisbursal;

    calculated.push({
      ...month,
      totalNewLoans: Math.round(totalNewLoans * 100) / 100,
      disbursalFromNew: Math.round(disbursalFromNew * 100) / 100,
      cumulativeNewUsers: Math.round(cumulativeNewUsers * 100) / 100,
      repeatDisbursal: Math.round(repeatDisbursal * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  }

  return calculated;
};

export const createEmptyMonthlyData = (
  numberOfMonths: number,
  preset?: { loanPageRate: number; underwritingRate: number; disbursalRate: number; conversionRate: number }
): MonthlyData[] => {
  return Array.from({ length: numberOfMonths }, (_, i) => ({
    month: i + 1,
    downloads: 1000,
    loanPageRate: preset?.loanPageRate ?? 0.5,
    underwritingRate: preset?.underwritingRate ?? 0.8,
    disbursalRate: preset?.disbursalRate ?? 0.3,
    conversionRate: preset?.conversionRate ?? 0.02,
    totalNewLoans: 0,
    disbursalFromNew: 0,
    cumulativeNewUsers: 0,
    repeatDisbursal: 0,
    total: 0,
  }));
};

export const calculateSummaryMetrics = (monthlyData: MonthlyData[]) => {
  const totalDisbursals = monthlyData.reduce((sum, month) => sum + month.total, 0);
  const finalCumulativeUsers = monthlyData[monthlyData.length - 1]?.cumulativeNewUsers ?? 0;
  const avgMonthlyDisbursal = totalDisbursals / monthlyData.length;

  return {
    totalDisbursals: Math.round(totalDisbursals * 100) / 100,
    finalCumulativeUsers: Math.round(finalCumulativeUsers * 100) / 100,
    avgMonthlyDisbursal: Math.round(avgMonthlyDisbursal * 100) / 100,
  };
};

export const validatePercentage = (value: number): boolean => {
  return value >= 0 && value <= 1;
};

export const validateDownloads = (value: number): boolean => {
  return Number.isInteger(value) && value >= 0;
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const parsePercentage = (value: string): number => {
  const num = parseFloat(value.replace('%', ''));
  return isNaN(num) ? 0 : num / 100;
};
